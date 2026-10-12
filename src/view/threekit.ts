import { PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from 'three';

export interface ThreeStage {
  readonly renderer: WebGLRenderer;
  readonly scene: ThreeScene;
  readonly camera: PerspectiveCamera;
  resize(width: number, height: number): void;
  dispose(): void;
}

/**
 * Creates a three stage (renderer, scene, camera). Imported only from 3D scene files.
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
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const resize = (width: number, height: number): void => {
    renderer.setSize(width, height, false);
    camera.aspect = height === 0 ? 1 : width / height;
    camera.updateProjectionMatrix();
  };
  resize(host.clientWidth || 640, host.clientHeight || 360);

  return {
    renderer,
    scene,
    camera,
    resize,
    dispose() {
      // Disposing geometry, materials, and textures is the creator's (the scene's) responsibility. Only the renderer and WebGL context are released here.
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
