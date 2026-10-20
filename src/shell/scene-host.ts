import type { AnySceneModule, ControlState, Lang, SceneLoader } from '../contracts';
import { shallowEqual } from '../state';
import { site } from '../site.config';
import { h } from './dom';
import { tr } from './i18n';

const RELOAD_FLAG = site.reloadFlag;

function readReloadFlag(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) === '1';
  } catch {
    return false;
  }
}

function writeReloadFlag(on: boolean): void {
  try {
    if (on) sessionStorage.setItem(RELOAD_FLAG, '1');
    else sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    // If storage is unavailable in this environment, just give up the auto-reload guard.
  }
}

interface Mounted {
  model: AnySceneModule['model'];
  scene: ReturnType<AnySceneModule['createScene']>;
  state: ControlState;
  data: unknown;
  hasData: boolean;
}

/**
 * Mounts one scene into a host element and manages its lifecycle.
 * State flow: idle → loading → mounted → disposed
 */
export class SceneHost {
  private readonly host: HTMLElement;
  private readonly lang: Lang;
  private mounted: Mounted | undefined;
  private loadToken = 0;
  private computeSeq = 0;
  private frame = 0;
  private observer: ResizeObserver | undefined;

  constructor(host: HTMLElement, lang: Lang) {
    this.host = host;
    this.lang = lang;
  }

  async show(load: SceneLoader, state: ControlState): Promise<void> {
    this.dispose();
    const token = ++this.loadToken;
    this.host.dataset['status'] = 'loading';

    let module: AnySceneModule;
    try {
      module = await load();
    } catch (error) {
      if (token === this.loadToken) this.handleLoadError(error);
      return;
    }
    // If navigation moved to another scene while loading, discard this result. (A dynamic import cannot be cancelled)
    if (token !== this.loadToken) return;
    writeReloadFlag(false);

    try {
      const scene = module.createScene();
      scene.mount(this.host, this.lang);
      const mounted: Mounted = { model: module.model, scene, state, data: undefined, hasData: false };
      this.mounted = mounted;

      this.observer = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (rect && this.mounted === mounted) mounted.scene.resize?.(rect.width, rect.height);
      });
      this.observer.observe(this.host);

      this.host.dataset['status'] = 'ready';
      this.compute(mounted);
    } catch (error) {
      this.fail(error);
    }
  }

  /** Called when a control value changes. Does not recompute if the value is unchanged. */
  setState(next: ControlState): void {
    const mounted = this.mounted;
    if (!mounted) return;
    if (mounted.hasData && shallowEqual(mounted.state, next)) return;
    mounted.state = next;
    this.compute(mounted);
  }

  /** Releases, in order: rAF, the observer, the scene (including WebGL), and the DOM. */
  dispose(): void {
    this.loadToken++;
    this.computeSeq++;
    cancelAnimationFrame(this.frame);
    this.frame = 0;

    this.observer?.disconnect();
    this.observer = undefined;

    const mounted = this.mounted;
    this.mounted = undefined;
    if (mounted) {
      try {
        mounted.scene.dispose();
      } catch (error) {
        console.error(error);
      }
    }
    this.host.replaceChildren();
    delete this.host.dataset['status'];
  }

  showError(message: string): void {
    this.host.dataset['status'] = 'error';
    this.host.replaceChildren(h('p', { class: 'scene-error', role: 'alert' }, message));
  }

  private compute(mounted: Mounted): void {
    const seq = ++this.computeSeq;
    const isCurrent = (): boolean => seq === this.computeSeq && this.mounted === mounted;

    try {
      const result: unknown = mounted.model.compute(mounted.state);
      if (result instanceof Promise) {
        result.then(
          (data: unknown) => {
            if (isCurrent()) this.accept(mounted, data);
          },
          (error: unknown) => {
            if (isCurrent()) this.fail(error);
          },
        );
      } else {
        this.accept(mounted, result);
      }
    } catch (error) {
      this.fail(error);
    }
  }

  private accept(mounted: Mounted, data: unknown): void {
    mounted.data = data;
    mounted.hasData = true;
    this.schedule();
  }

  /** Renders at most once per frame instead of on every input event. */
  private schedule(): void {
    if (this.frame !== 0) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const mounted = this.mounted;
      if (!mounted || !mounted.hasData) return;
      try {
        mounted.scene.render(mounted.data, mounted.state);
      } catch (error) {
        this.fail(error);
      }
    });
  }

  private fail(error: unknown): void {
    console.error(error);
    this.showError(tr(this.lang, 'sceneDisplayError'));
  }

  /** Right after a redeploy, an old tab may find its chunk files gone. Reload automatically, once only. */
  private handleLoadError(error: unknown): void {
    console.error(error);
    if (!readReloadFlag()) {
      writeReloadFlag(true);
      location.reload();
      return;
    }
    const button = h('button', { type: 'button' }, tr(this.lang, 'reload'));
    button.addEventListener('click', () => location.reload());
    this.host.dataset['status'] = 'error';
    this.host.replaceChildren(
      h(
        'div',
        { class: 'scene-error', role: 'alert' },
        h('p', {}, tr(this.lang, 'sceneLoadFailed')),
        button,
      ),
    );
  }
}
