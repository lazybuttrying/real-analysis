import { PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from 'three';

export interface ThreeStage {
  readonly renderer: WebGLRenderer;
  readonly scene: ThreeScene;
  readonly camera: PerspectiveCamera;
  resize(width: number, height: number): void;
  dispose(): void;
}

/**
 * three 무대(렌더러, 씬, 카메라)를 만든다. 3D 씬 파일에서만 import 한다.
 * (그래야 three가 vendor-three 청크로 분리되어 3D 씬에 들어갈 때만 로드된다)
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
      // geometry, material, texture 해제는 만든 쪽(씬)의 책임이다. 여기서는 렌더러와 WebGL 컨텍스트만 해제한다.
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
