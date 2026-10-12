import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DirectionalLight,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene as ThreeScene,
  Sprite,
  SpriteMaterial,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/** Compact number formatting for readouts: fixed decimals in the normal range, exponential outside it. */
export function fmt(x: number, digits = 6): string {
  if (!Number.isFinite(x)) return String(x);
  if (x !== 0 && (Math.abs(x) >= 1e7 || Math.abs(x) < 1e-4)) return x.toExponential(3);
  return String(Number(x.toFixed(digits)));
}

export const COLORS = {
  blue: 0x4da3ff,
  yellow: 0xffd166,
  red: 0xff6b6b,
  green: 0x7be0a3,
  purple: 0xc792ff,
  teal: 0x4dd0e1,
  gray: 0x8fa3c7,
  white: 0xffffff,
} as const;

export interface ThreeStage {
  readonly renderer: WebGLRenderer;
  readonly scene: ThreeScene;
  readonly camera: PerspectiveCamera;
  readonly controls: OrbitControls;
  resize(width: number, height: number): void;
  dispose(): void;
}

/**
 * Creates a three stage (renderer, scene, camera, orbit controls, lights)
 * and runs a render loop with damped controls until disposed.
 * Imported only from 3D scene files.
 * (That way three is split into the vendor-three chunk and loaded only when entering a 3D scene)
 */
export function createThreeStage(host: HTMLElement): ThreeStage {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  host.append(renderer.domElement);

  const scene = new ThreeScene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 0, 5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  scene.add(new AmbientLight(0xffffff, 0.85));
  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(8, 16, 10);
  scene.add(key);
  const fill = new DirectionalLight(0x88aaff, 0.5);
  fill.position.set(-10, 6, -8);
  scene.add(fill);

  let raf = 0;
  const loop = (): void => {
    raf = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  };

  const resize = (width: number, height: number): void => {
    renderer.setSize(width, height, false);
    camera.aspect = height === 0 ? 1 : width / height;
    camera.updateProjectionMatrix();
  };
  resize(host.clientWidth || 640, host.clientHeight || 360);
  loop();

  return {
    renderer,
    scene,
    camera,
    controls,
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      controls.dispose();
      // Disposing geometry, materials, and textures is the creator's (the scene's) responsibility. Only the renderer and WebGL context are released here.
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

// ---------- disposal ----------

// Three.js does not type geometry/material on Object3D; this structural
// view is the standard way to dispose a subtree.
interface DisposableNode {
  geometry?: BufferGeometry;
  material?: Material | Material[];
}

/** Disposes every geometry and material in a subtree. */
export function disposeObject(root: Object3D): void {
  root.traverse((obj) => {
    const node = obj as DisposableNode;
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach((m) => {
        const withMap = m as MeshStandardMaterial;
        if (withMap.map) withMap.map.dispose();
        m.dispose();
      });
    }
  });
}

/** Removes all children of a group, disposing their geometries/materials. */
export function clearGroup(group: Group): void {
  while (group.children.length) {
    const child = group.children.pop();
    if (!child) break;
    group.remove(child);
    disposeObject(child);
  }
}

// ---------- mesh factories ----------

export function createGroup(): Group {
  return new Group();
}

/** A floor grid with theme-neutral colors. */
export function createGrid(size: number, divisions: number, opacity = 0.28): GridHelper {
  const grid = new GridHelper(size, divisions, 0x8fa3c7, 0x8fa3c7);
  const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
  materials.forEach((m) => {
    m.transparent = true;
    m.opacity = opacity;
  });
  grid.position.y = -0.002;
  return grid;
}

export interface BarItem {
  x?: number;
  z?: number;
  height: number;
  color: number;
  opacity?: number;
  width?: number;
  depth?: number;
}

export interface BarsOpts {
  width?: number;
  depth?: number;
}

/** Bars stand on y = 0; negative heights hang below the axis. */
export function createBars(items: BarItem[], opts: BarsOpts = {}): Group {
  const group = new Group();
  const defaultWidth = opts.width ?? 0.6;
  const defaultDepth = opts.depth ?? 0.6;
  items.forEach((it) => {
    const h = it.height;
    if (h === 0) return;
    const geo = new BoxGeometry(it.width ?? defaultWidth, Math.abs(h), it.depth ?? defaultDepth);
    const mat = new MeshStandardMaterial({
      color: it.color,
      transparent: it.opacity !== undefined && it.opacity < 1,
      opacity: it.opacity ?? 1,
      roughness: 0.55,
      metalness: 0.05,
    });
    const mesh = new Mesh(geo, mat);
    mesh.position.set(it.x ?? 0, h / 2, it.z ?? 0);
    group.add(mesh);
  });
  return group;
}

/** Flat translucent horizontal plane (a limit plane you can orbit under). */
export function createPlane(w: number, d: number, color: number, opacity: number): Mesh {
  const geo = new BoxGeometry(w, 0.045, d);
  const mat = new MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new Mesh(geo, mat);
}

export interface LineOpts {
  dashed?: boolean;
  dashSize?: number;
  gapSize?: number;
  opacity?: number;
}

export function createLine(points: Array<[number, number, number]>, color: number, opts: LineOpts = {}): Line {
  const verts = points.map((p) => new Vector3(p[0], p[1], p[2]));
  const geo = new BufferGeometry().setFromPoints(verts);
  let mat: LineBasicMaterial | LineDashedMaterial;
  if (opts.dashed) {
    mat = new LineDashedMaterial({
      color,
      dashSize: opts.dashSize ?? 0.45,
      gapSize: opts.gapSize ?? 0.28,
      transparent: true,
      opacity: opts.opacity ?? 1,
    });
  } else {
    mat = new LineBasicMaterial({
      color,
      transparent: true,
      opacity: opts.opacity ?? 1,
    });
  }
  const line = new Line(geo, mat);
  if (opts.dashed) line.computeLineDistances();
  return line;
}

let circleTexture: CanvasTexture | null = null;
function getCircleTexture(): CanvasTexture {
  if (circleTexture) return circleTexture;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  circleTexture = new CanvasTexture(c);
  return circleTexture;
}

export interface PointsOpts {
  size?: number;
}

export function createPoints(points: Array<[number, number, number]>, color: number, opts: PointsOpts = {}): Points {
  const verts = new Float32Array(points.length * 3);
  points.forEach((p, i) => {
    verts[i * 3] = p[0];
    verts[i * 3 + 1] = p[1];
    verts[i * 3 + 2] = p[2];
  });
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(verts, 3));
  const mat = new PointsMaterial({
    color,
    size: opts.size ?? 0.32,
    map: getCircleTexture(),
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new Points(geo, mat);
}

// ---------- canvas-texture labels ----------

export interface LabelOpts {
  fontSize?: number;
  pad?: number;
  color?: string;
  bg?: string;
  worldHeight?: number;
}

function drawLabelCanvas(text: string, opts: LabelOpts): HTMLCanvasElement {
  const fontSize = opts.fontSize ?? 46;
  const pad = opts.pad ?? 16;
  const font = '700 ' + fontSize + 'px Arial, sans-serif';
  const measure = document.createElement('canvas').getContext('2d');
  let tw = 0;
  if (measure) {
    measure.font = font;
    tw = Math.ceil(measure.measureText(text).width);
  }
  const canvas = document.createElement('canvas');
  canvas.width = tw + pad * 2;
  canvas.height = fontSize + pad * 2;
  const g = canvas.getContext('2d');
  if (g) {
    if (opts.bg) {
      g.fillStyle = opts.bg;
      g.beginPath();
      g.roundRect(0, 0, canvas.width, canvas.height, 14);
      g.fill();
    }
    g.font = font;
    g.fillStyle = opts.color ?? '#ffffff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  }
  return canvas;
}

interface LabelData {
  text: string;
  opts: LabelOpts;
}

export function createLabel(text: string, opts: LabelOpts = {}): Sprite {
  const canvas = drawLabelCanvas(text, opts);
  const tex = new CanvasTexture(canvas);
  tex.anisotropy = 4;
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new Sprite(mat);
  const worldHeight = opts.worldHeight ?? 0.85;
  sprite.scale.set(worldHeight * (canvas.width / canvas.height), worldHeight, 1);
  const data: LabelData = { text, opts };
  sprite.userData['label'] = data;
  return sprite;
}

/** Regenerates the label texture only when the text actually changed. */
export function updateLabel(sprite: Sprite, text: string): void {
  const data = sprite.userData['label'] as LabelData | undefined;
  if (data && data.text === text) return;
  const opts = data ? data.opts : {};
  const canvas = drawLabelCanvas(text, opts);
  const material = sprite.material as SpriteMaterial;
  const old = material.map;
  const tex = new CanvasTexture(canvas);
  tex.anisotropy = 4;
  material.map = tex;
  material.needsUpdate = true;
  if (old) old.dispose();
  const worldHeight = opts.worldHeight ?? 0.85;
  sprite.scale.set(worldHeight * (canvas.width / canvas.height), worldHeight, 1);
  sprite.userData['label'] = { text, opts } satisfies LabelData;
}
