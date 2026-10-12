import type { AnySceneModule, ControlState, SceneLoader } from '../contracts';
import { shallowEqual } from '../state';
import { h } from './dom';

const RELOAD_FLAG = 'real-analysis:chunk-reload';

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
    // 저장소를 쓸 수 없는 환경이면 자동 새로고침 보호만 포기한다.
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
 * 씬 하나를 호스트 요소에 올리고 수명주기를 관리한다.
 * 상태 흐름: idle → loading → mounted → disposed
 */
export class SceneHost {
  private readonly host: HTMLElement;
  private mounted: Mounted | undefined;
  private loadToken = 0;
  private computeSeq = 0;
  private frame = 0;
  private observer: ResizeObserver | undefined;

  constructor(host: HTMLElement) {
    this.host = host;
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
    // 로딩 중에 다른 씬으로 이동했다면 이 결과는 버린다. (동적 import는 취소할 수 없다)
    if (token !== this.loadToken) return;
    writeReloadFlag(false);

    try {
      const scene = module.createScene();
      scene.mount(this.host);
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

  /** 컨트롤 값이 바뀌었을 때 호출한다. 같은 값이면 다시 계산하지 않는다. */
  setState(next: ControlState): void {
    const mounted = this.mounted;
    if (!mounted) return;
    if (mounted.hasData && shallowEqual(mounted.state, next)) return;
    mounted.state = next;
    this.compute(mounted);
  }

  /** rAF, observer, 씬(WebGL 포함), DOM을 순서대로 해제한다. */
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

  /** 입력 이벤트마다 그리지 않고 프레임당 한 번만 렌더한다. */
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
    this.showError('이 씬을 표시하는 중 오류가 발생했습니다.');
  }

  /** 재배포 직후 구버전 탭에서는 청크 파일이 사라져 있을 수 있다. 한 번만 자동으로 새로고침한다. */
  private handleLoadError(error: unknown): void {
    console.error(error);
    if (!readReloadFlag()) {
      writeReloadFlag(true);
      location.reload();
      return;
    }
    const button = h('button', { type: 'button' }, '새로고침');
    button.addEventListener('click', () => location.reload());
    this.host.dataset['status'] = 'error';
    this.host.replaceChildren(
      h(
        'div',
        { class: 'scene-error', role: 'alert' },
        h('p', {}, '씬을 불러오지 못했습니다. 새 버전이 배포되었을 수 있습니다.'),
        button,
      ),
    );
  }
}
