import {
  action,
  actions,
  operations,
  reducerStore,
  selector,
} from "@fleur/fleur";
import { validateBytes } from "gltf-validator";
import { basename } from "path";
import { buildVRMBuffer } from "../utils/buildVRMBuffer";
import { extractGLTFJson } from "../utils/extractGLTFJson";
import { gizabalifyVRM } from "../utils/gizabalifyVRM";
import { rescue } from "../utils/utils";
import { GltfVRM } from "../utils/VRM";
import { yaebalifyVRM } from "../utils/yaebalifyVRM";

type ToothMode = "gizaba" | "yaeba";

export const AppOps = operations({
  async setVrm(context, file: File) {
    const buffer = await file.arrayBuffer();
    const bin = new Uint8Array(buffer);

    const [result, error] = await rescue(() => validateBytes(bin));
    console.log("validation: ", { result, error });

    if (error) {
      context.dispatch(AppActions.vrmLoadStatus, { status: error.message });
      return;
    }

    context.dispatch(AppActions.vrmLoaded, {
      vrmBin: buffer,
      url: URL.createObjectURL(file),
      sourceFileName: file.name,
    });

    await context.executeOperation(AppOps._generateTransformedVRM);
  },

  async setToothMode(context, nextMode: ToothMode) {
    context.dispatch(AppActions.toothModeChanged, { mode: nextMode });
    await context.executeOperation(AppOps._generateTransformedVRM);
  },

  async _generateTransformedVRM(context) {
    const { currentVrmBin: vrmBin, toothMode } = context.getStore(
      AppStore
    ).state;
    if (!toothMode) return;
    if (!vrmBin) return;

    const [result, error] = await rescue(() => extractGLTFJson(vrmBin));

    if (error) {
      context.dispatch(AppActions.vrmLoadStatus, { status: error.message });
      return;
    }

    if (toothMode === "gizaba") {
      gizabalifyVRM(result!);
    } else {
      yaebalifyVRM(result!);
    }

    const newVRM = buildVRMBuffer(result!);
    const blob = new Blob([newVRM], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    context.dispatch(AppActions.vrmGenerated, { currentVrmBin: newVRM, url });
  },
});

export const AppActions = actions("App", {
  vrmLoaded: action<{
    vrmBin: ArrayBuffer;
    url: string;
    sourceFileName: string;
  }>(),
  vrmGenerated: action<{ currentVrmBin: ArrayBuffer; url: string }>(),
  vrmLoadStatus: action<{ status: string | null }>(),
  toothModeChanged: action<{ mode: ToothMode }>(),
});

interface State {
  sourceFileName: string | null;
  sourceVRMBuffer: ArrayBuffer | null;
  currentVrmBin: ArrayBuffer | null;
  currentVrmUrl: string | null;
  loadStatus: string | null;
  toothMode: ToothMode | null;
}

export const AppStore = reducerStore(
  "App",
  (): State => ({
    sourceFileName: null,
    sourceVRMBuffer: null,
    currentVrmBin: null,
    currentVrmUrl: null,
    loadStatus: null,
    toothMode: null,
  })
)
  .listen(AppActions.vrmLoaded, (draft, { vrmBin, url, sourceFileName }) => {
    if (draft.currentVrmUrl) URL.revokeObjectURL(draft.currentVrmUrl);

    draft.sourceFileName = sourceFileName;
    draft.sourceVRMBuffer = vrmBin;
    draft.currentVrmBin = vrmBin;
    draft.currentVrmUrl = url;
    draft.toothMode = null;
    draft.loadStatus = null;

    console.log({ ...draft });
  })
  .listen(AppActions.vrmGenerated, (draft, { currentVrmBin, url }) => {
    draft.currentVrmBin = currentVrmBin;
    draft.currentVrmUrl = url;
  })
  .listen(AppActions.vrmLoadStatus, (draft, { status }) => {
    draft.loadStatus = status;
  })
  .listen(AppActions.toothModeChanged, (draft, { mode }) => {
    draft.toothMode = mode;
  });

export const AppSelector = {
  isVRMLoaded: selector((get) => get(AppStore).sourceVRMBuffer != null),
  isToothTypeSelected: selector((get) => get(AppStore).toothMode != null),
  isDownloadable: selector(
    (get) => !!get(AppStore).currentVrmBin && get(AppStore).toothMode != null
  ),
  toothMode: selector((get) => get(AppStore).toothMode),
  currentVrm: selector((get) => ({
    vrmBin: get(AppStore).currentVrmBin,
    vrmUrl: get(AppStore).currentVrmUrl,
  })),
  downloadFileName: selector((get) => {
    const { sourceFileName, toothMode } = get(AppStore);
    if (!sourceFileName) return;

    const suffix = toothMode === "gizaba" ? "gizabalify" : "yaebalify";
    return `${basename(sourceFileName, ".vrm")}-${suffix}.vrm`;
  }),
};
