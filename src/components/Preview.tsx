import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VRM, VRMSchema, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import styled, { keyframes } from "styled-components";
import { useFleurContext, useStore } from "@fleur/react";
import { rgba } from "polished";

import { AppOps, AppSelector, AppStore } from "../domains/App";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { letDownload, styleWhen, useAsyncEffect } from "../utils/utils";
import { previewBlendShapes } from "../domains/constants";
import { loadImage, loadImageFromBlob } from "../utils/loadImage";

import overlay1BluePath from "../resources/images/overlay1-blue.png";
import overlay1CyanPath from "../resources/images/overlay1-cyan.png";
import overlay1GreenPath from "../resources/images/overlay1-green.png";
import overlay1OrangePath from "../resources/images/overlay1-orange.png";
import overlay1PinkPath from "../resources/images/overlay1-pink.png";
import overlay1PurplePath from "../resources/images/overlay1-purple.png";
import overlay2Path from "../resources/images/overlay2.png";

const images = [
  overlay1BluePath,
  overlay1CyanPath,
  overlay1GreenPath,
  overlay1OrangePath,
  overlay1PinkPath,
  overlay1PurplePath,
];

export const Preview = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, { shot, resetCamera }] = useVRMRenderer(canvasRef);
  const generating = useStore(AppSelector.generating);

  const waiting = loading || generating;

  return (
    <Root>
      <Canvas ref={canvasRef} />

      <Controls>
        <span onClick={resetCamera}>😀</span>
        <span onClick={shot}>📷</span>
      </Controls>

      <Overlay visible={waiting}>
        <Loader />
      </Overlay>
    </Root>
  );
};

const useVRMRenderer = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
) => {
  const [loading, setLoading] = useState(false);

  const clock = useMemo(() => new THREE.Clock(), []);
  const loader = useMemo(() => new GLTFLoader(), []);

  const rootSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gltfRef = useRef<GLTF>();
  const vrmRef = useRef<VRM | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const { executeOperation, getStore } = useFleurContext();
  const {
    currentVrmUrl,
    previewBlendShape,
    userSelectPreviewBlendShape,
  } = useStore((get) => get(AppStore).state);

  const shot = useCallback(async () => {
    const blob = await new Promise<Blob>((r) =>
      canvasRef.current!.toBlob((blob) => r(blob!), "image/png")
    );

    // rendererRef.current.data;

    const { image, url: captureUrl } = await loadImageFromBlob(blob);
    const overlay1 = await loadImage(
      images[Math.round(Math.random() * images.length)]
    );
    const overlay2 = await loadImage(overlay2Path);

    const canvas = Object.assign(document.createElement("canvas"), {
      width: image.width / window.devicePixelRatio,
      height: image.height / window.devicePixelRatio,
    });

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overlay1, 32, 32);
    ctx.drawImage(
      overlay2,
      canvas.width - overlay2.width - 16,
      canvas.height - overlay2.height
    );

    const result = await new Promise<Blob>((r) =>
      canvas!.toBlob((blob) => r(blob!), "image/jpeg", 100)
    );
    const resultUrl = URL.createObjectURL(result);

    letDownload(resultUrl, `gizabalify-screenshot-${Date.now()}.jpg`);
    URL.revokeObjectURL(captureUrl);
    URL.revokeObjectURL(resultUrl);

    return resultUrl;
  }, []);

  const resetCamera = useCallback(() => {
    if (vrmRef.current) {
      const camPos = new THREE.Vector3();
      vrmRef.current.humanoid
        ?.getBone(VRMSchema.HumanoidBoneName.Head)
        ?.node.getWorldPosition(camPos);

      cameraRef.current?.position.set(0, camPos.y, 2);
      controlsRef.current!.target.set(0, camPos.y, 0);
      controlsRef.current!.update();
    } else {
      cameraRef.current?.position.set(0, 1, 5);
    }
  }, []);

  // Initialize three
  useEffect(() => {
    // CameraControls.install({ THREE });
    const canvas = canvasRef.current!;

    const renderer = (rendererRef.current = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      preserveDrawingBuffer: true,
    }));
    renderer.setClearAlpha(0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const camera = (cameraRef.current = new THREE.PerspectiveCamera(
      30.0,
      window.innerWidth / window.innerHeight,
      0.1,
      20
    ));
    // const camera = (cameraRef.current = new THREE.OrthographicCamera(
    //   -1,
    //   1,
    //   1,
    //   -1,
    //   // 30.0,
    //   // window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // ));
    camera.position.set(0, 1, 5);

    // camera controls
    const controls = (controlsRef.current = new OrbitControls(
      camera,
      renderer.domElement
    ));
    controls.screenSpacePanning = true;
    controls.target.set(0.0, 1.0, 0.0);
    controls.update();

    // controlsRef.current = new CameraControls(
    //   cameraRef.current!,
    //   canvasRef.current!
    // );
    // controlsRef.current!.setTarget(0, 1, 0);

    const rootScene = (rootSceneRef.current = new THREE.Scene());

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1.0, 1.0, 1.0).normalize();
    rootScene.add(light);

    const gridHelper = new THREE.GridHelper(10, 10);
    rootScene.add(gridHelper);

    const render = () => {
      if (vrmRef.current) {
        const vrm = vrmRef.current;

        const s = Math.sin(Math.PI * clock.elapsedTime * 7);
        vrm.blendShapeProxy?.setValue(
          VRMSchema.BlendShapePresetName.Blink,
          0.5 - 0.5 * s
        );

        vrm.update(clock.getDelta());
        rendererRef.current?.render(rootScene, camera);
      }

      requestAnimationFrame(render);
    };

    renderer.render(rootScene, camera);
    requestAnimationFrame(render);
  }, []);

  // Resize handler
  useEffect(() => {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvasRef.current!.width = width;
      canvasRef.current!.height = height;
      cameraRef.current!.aspect = width / height;
      cameraRef.current?.updateProjectionMatrix();
      rendererRef.current?.setSize(width, height);
      rendererRef.current?.setPixelRatio(window.devicePixelRatio);
    });
  }, []);

  // VRM Loading
  useAsyncEffect(async () => {
    if (!currentVrmUrl) return;

    setLoading(true);

    // Load VRM
    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        currentVrmUrl,
        (gltf) => resolve(gltf),
        undefined,
        (e) => reject(e)
      );
    });

    VRMUtils.removeUnnecessaryJoints(gltf.scene);

    const vrm = await VRM.from(gltf, {});
    vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.Hips)!.rotation.y =
      Math.PI;

    const prevVrm = vrmRef.current;
    vrmRef.current = vrm;
    gltfRef.current = gltf;

    // Appearer VRM into scene
    prevVrm && rootSceneRef.current!.remove(prevVrm.scene);
    rootSceneRef.current!.add(vrm.scene);

    const { userSelectPreviewBlendShape, previewBlendShape } = getStore(
      AppStore
    ).state;

    vrm.blendShapeProxy?.setValue(
      userSelectPreviewBlendShape ?? previewBlendShape,
      100
    );

    // Reset cam position
    if (prevVrm == null) {
      const camPos = new THREE.Vector3();
      vrm.humanoid
        ?.getBone(VRMSchema.HumanoidBoneName.Head)
        ?.node.getWorldPosition(camPos);

      cameraRef.current?.position.set(0, camPos.y, 2);
      controlsRef.current!.target.set(0, camPos.y, 0);
      controlsRef.current!.update();
    }

    setLoading(false);
  }, [currentVrmUrl]);

  // Auto facial expression transition
  useEffect(() => {
    let i = 0;

    setInterval(() => {
      const userSpec = getStore(AppStore).state.userSelectPreviewBlendShape;
      if (userSpec) return;

      executeOperation(
        AppOps.changePreviewBlendShape,
        previewBlendShapes[i++ % previewBlendShapes.length]
      );
    }, 1000);
  }, []);

  // Apply current facial expression
  useEffect(() => {
    const vrm = vrmRef.current;
    if (!vrm) return;

    previewBlendShapes.forEach((name) =>
      vrm.blendShapeProxy?.setValue(name, 0)
    );
    vrm.blendShapeProxy?.setValue(
      userSelectPreviewBlendShape ?? previewBlendShape,
      100
    );
  }, [previewBlendShape, userSelectPreviewBlendShape, vrmRef.current]);

  return [loading, { shot, resetCamera }] as const;
};

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  font-size: 64px;
  user-select: none;

  span {
    display: inline-block;
    cursor: pointer;
  }

  span + span {
    margin-left: 32px;
  }
`;

const loaderAnim = keyframes`
  0%, 80%, 100% {
    transform: scaleY(1);
  }
  40% {
    transform: scaleY(1.2);
  }
  90% {
    transform: scaleY(.9);
  }
`;

const Overlay = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${rgba("#fff", 0.4)};
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
  pointer-events: none;

  ${({ visible }) => styleWhen(visible)`
    pointer-events:all;
    opacity: 1;
  `}
`;

const Loader = styled.div`
  &,
  &::before,
  &::after {
    display: block;
    background: #000;
    animation: ${loaderAnim} 0.5s infinite ease-in-out;
    width: 1em;
    height: 4em;
    transform-origin: center center;
    will-change: box-shadow, transform;
  }

  position: absolute;
  top: calc(50% - 2em);
  left: calc(50% - 1em);
  animation-delay: 0s;
  opacity: 0.4;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
  }

  &::before {
    left: -1.5em;
    animation-delay: -0.16s;
  }

  &::after {
    left: 1.5em;
    animation-delay: 0.16s;
  }
`;
