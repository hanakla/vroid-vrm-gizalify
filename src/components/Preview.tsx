import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { VRM, VRMSchema, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import CameraControls from "camera-controls";
import styled from "styled-components";
import { useStore } from "@fleur/react";

import { AppStore } from "../domains/App";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useAsyncEffect } from "../utils/utils";

export const Preview = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useVRMRenderer(canvasRef);

  return (
    <div>
      <Canvas ref={canvasRef} />
    </div>
  );
};

const useVRMRenderer = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
) => {
  const clock = useMemo(() => new THREE.Clock(), []);
  const loader = useMemo(() => new GLTFLoader(), []);

  const rootSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gltfRef = useRef<GLTF>();
  const vrmRef = useRef<VRM | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const { currentVrmUrl } = useStore((get) => get(AppStore).state);

  useEffect(() => {
    // CameraControls.install({ THREE });
    const canvas = canvasRef.current!;

    const renderer = (rendererRef.current = new THREE.WebGLRenderer({
      canvas,
    }));
    renderer.setClearColor("#eee");
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

        const s = Math.sin(Math.PI * clock.elapsedTime * 2);

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

  useAsyncEffect(async () => {
    if (!currentVrmUrl) return;

    if (vrmRef.current) {
      rootSceneRef.current!.remove(vrmRef.current.scene);
    }

    const gltf = (gltfRef.current = await new Promise<GLTF>(
      (resolve, reject) => {
        loader.load(
          currentVrmUrl,
          (gltf) => resolve(gltf),
          undefined,
          (e) => reject(e)
        );
      }
    ));

    VRMUtils.removeUnnecessaryJoints(gltf.scene);

    const vrm = (vrmRef.current = await VRM.from(gltfRef.current!, {}));
    vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.Hips)!.rotation.y =
      Math.PI;

    rootSceneRef.current!.add(vrm.scene);

    const campos = new THREE.Vector3();
    vrm.humanoid
      ?.getBone(VRMSchema.HumanoidBoneName.Head)
      ?.node.getWorldPosition(campos),
      console.log(campos);

    cameraRef.current?.position.set(0, campos.y, 2);
    controlsRef.current!.target.set(0, campos.y, 0);
    controlsRef.current!.update();
  }, [currentVrmUrl]);

  useEffect(() => {
    let i = 0;
    setInterval(() => {
      const vrm = vrmRef.current;
      if (!vrm) return;

      const exprs = [
        VRMSchema.BlendShapePresetName.Angry,
        VRMSchema.BlendShapePresetName.Fun,
        VRMSchema.BlendShapePresetName.Joy,
        VRMSchema.BlendShapePresetName.Sorrow,
        VRMSchema.BlendShapePresetName.Neutral,
      ];

      exprs.forEach((name) => vrm.blendShapeProxy?.setValue(name, 0));
      vrm.blendShapeProxy?.setValue(exprs[i++ % exprs.length], 100);
    }, 1000);
  }, []);
};

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
`;
