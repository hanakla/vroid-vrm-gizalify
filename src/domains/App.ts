import {
  action,
  actions,
  operation,
  operations,
  reducerStore,
  selector,
} from "@fleur/fleur";
import { VRMSchema } from "@pixiv/three-vrm";
import { validateBytes } from "gltf-validator";
import { basename } from "path";
import { buildVRMBuffer } from "../utils/vrm/buildVRMBuffer";
import { extractGLTFJson } from "../utils/vrm/extractGLTFJson";
import { gizabalifyVRM } from "../utils/vrm/gizabalifyVRM";
import { rescue } from "@hanakla/rescue";
import { yaebalifyVRM } from "../utils/vrm/yaebalifyVRM";
import { InvalidVRoidVRMError } from "../utils/InvalidVRoidVRMError";

type ToothMode = "gizaba" | "yaeba";

export const AppOps = operations({
  async loadVRM(context, file: File) {
    context.dispatch(AppActions.clearVRM);

    const buffer = await file.arrayBuffer();
    const bin = new Uint8Array(buffer);

    const [, error] = await rescue(() => validateBytes(bin));

    if (error) {
      context.dispatch(AppActions.vrmLoadStatus, {
        errorCode: "errors.invalidVrm",
      });
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

  async setWeight(context, weight: number) {
    context.dispatch(AppActions.weightChanged, { weight });
    await context.executeOperation(AppOps._generateTransformedVRM);
  },

  async setWithInNeutral(context, withinNeutral: boolean) {
    context.dispatch(AppActions.withinNeutralChanged, { withinNeutral });
    await context.executeOperation(AppOps._generateTransformedVRM);
  },

  setUserSelectPreviewBlendShape(
    context,
    name: VRMSchema.BlendShapePresetName | null
  ) {
    context.dispatch(AppActions.userSelectPreviewBlendShapeChanged, { name });
  },

  changePreviewBlendShape(context, name: VRMSchema.BlendShapePresetName) {
    context.dispatch(AppActions.previewBlendShapeChanged, { name });
  },

  _generateTransformedVRM: (() => {
    let latestRun = Promise.resolve();
    let latestAbort = new AbortController();

    return operation(async (context) => {
      const prevRun = latestRun;

      return (latestRun = (async () => {
        latestAbort.abort();

        const currentAbort = (latestAbort = new AbortController());
        currentAbort.signal.onabort = () => console.log("aborted");
        await prevRun;

        if (currentAbort.signal.aborted) return;

        // Model regeneration
        context.dispatch(AppActions.generatingStatusChanged, {
          generating: true,
        });

        const {
          sourceVRMBuffer: sourceVrmBin,
          toothMode,
          weight,
          withinNeutral,
        } = context.getStore(AppStore).state;

        if (!toothMode || !sourceVrmBin) {
          context.dispatch(AppActions.generatingStatusChanged, {
            generating: false,
          });
          return;
        }

        const [result, error] = await rescue(() =>
          extractGLTFJson(sourceVrmBin)
        );

        if (error) {
          context.dispatch(AppActions.vrmLoadStatus, {
            errorCode: "errors.invalidVrm",
          });
          return;
        }

        if (currentAbort.signal.aborted) return;

        const [, convertError] = rescue(
          () => {
            if (toothMode === "gizaba") {
              gizabalifyVRM(result!, { weight, withinNeutral });
            } else {
              yaebalifyVRM(result!, { weight, withinNeutral });
            }
          },
          { expects: [InvalidVRoidVRMError] }
        );

        if (convertError) {
          context.dispatch(AppActions.generatingStatusChanged, {
            generating: false,
            errorCode: "errors.blendshapeNotFound",
          });
          return;
        }

        const newVRM = buildVRMBuffer(result!);
        const blob = new Blob([newVRM], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        await new Promise((r) => setTimeout(r, 100));

        if (!currentAbort.signal.aborted) {
          context.dispatch(AppActions.vrmGenerated, {
            currentVrmBin: newVRM,
            url,
          });

          context.dispatch(AppActions.generatingStatusChanged, {
            generating: false,
          });
        } else {
          URL.revokeObjectURL(url);
          return;
        }
      })());
    });
  })(),
});

export const AppActions = actions("App", {
  clearVRM: action<void>(),
  vrmLoaded: action<{
    vrmBin: ArrayBuffer;
    url: string;
    sourceFileName: string;
  }>(),
  vrmGenerated: action<{ currentVrmBin: ArrayBuffer; url: string }>(),
  vrmLoadStatus: action<{ errorCode: string | null }>(),
  toothModeChanged: action<{ mode: ToothMode }>(),
  weightChanged: action<{ weight: number }>(),
  withinNeutralChanged: action<{ withinNeutral: boolean }>(),
  generatingStatusChanged: action<{
    generating: boolean;
    errorCode?: string | null;
  }>(),
  previewBlendShapeChanged: action<{ name: VRMSchema.BlendShapePresetName }>(),
  userSelectPreviewBlendShapeChanged: action<{
    name: VRMSchema.BlendShapePresetName | null;
  }>(),
});

interface State {
  sourceFileName: string | null;
  sourceVRMBuffer: ArrayBuffer | null;
  currentVrmBin: ArrayBuffer | null;
  currentVrmUrl: string | null;
  loadStatus: string | null;
  toothMode: ToothMode | null;
  generateStatus: {
    running: boolean;
    errorCode: string | null;
  };
  /** 0 to 100 */
  weight: number;
  withinNeutral: boolean;
  previewBlendShape: VRMSchema.BlendShapePresetName;
  userSelectPreviewBlendShape: VRMSchema.BlendShapePresetName | null;
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
    weight: 100,
    withinNeutral: false,
    generateStatus: {
      running: false,
      errorCode: null,
    },
    previewBlendShape: VRMSchema.BlendShapePresetName.Angry,
    userSelectPreviewBlendShape: null,
  })
)
  .listen(AppActions.clearVRM, (draft) => {
    draft.sourceFileName = null;
    draft.sourceVRMBuffer = null;
    draft.currentVrmBin = null;
    draft.currentVrmUrl = null;
    draft.loadStatus = null;
    draft.generateStatus = {
      running: false,
      errorCode: null,
    };
  })
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
  .listen(
    AppActions.generatingStatusChanged,
    (draft, { generating, errorCode: error }) => {
      draft.generateStatus = { running: generating, errorCode: error ?? null };
    }
  )
  .listen(AppActions.vrmGenerated, (draft, { currentVrmBin, url }) => {
    if (draft.currentVrmUrl) URL.revokeObjectURL(draft.currentVrmUrl);

    draft.currentVrmBin = currentVrmBin;
    draft.currentVrmUrl = url;
  })
  .listen(AppActions.vrmLoadStatus, (draft, { errorCode: status }) => {
    draft.loadStatus = status;
  })
  .listen(AppActions.toothModeChanged, (draft, { mode }) => {
    draft.toothMode = mode;
  })
  .listen(AppActions.weightChanged, (draft, { weight }) => {
    draft.weight = weight;
  })
  .listen(AppActions.withinNeutralChanged, (draft, { withinNeutral }) => {
    draft.withinNeutral = withinNeutral;
  })
  .listen(AppActions.previewBlendShapeChanged, (draft, { name }) => {
    draft.previewBlendShape = name;
  })
  .listen(AppActions.userSelectPreviewBlendShapeChanged, (draft, { name }) => {
    draft.userSelectPreviewBlendShape = name;
  });

export const AppSelector = {
  // Status
  isVRMLoaded: selector((get) => get(AppStore).sourceVRMBuffer != null),
  isToothTypeSelected: selector((get) => get(AppStore).toothMode != null),
  isDownloadable: selector(
    (get) =>
      get(AppStore).currentVrmUrl != null &&
      get(AppStore).toothMode != null &&
      get(AppStore).generateStatus.running === false &&
      get(AppStore).generateStatus.errorCode == null
  ),
  sourceFileName: selector((get) => get(AppStore).sourceFileName),
  currentVrm: selector((get) => ({
    vrmBin: get(AppStore).currentVrmBin,
    vrmUrl: get(AppStore).currentVrmUrl,
  })),
  loadStatus: selector((get) => get(AppStore).loadStatus),

  // Settings
  toothMode: selector((get) => get(AppStore).toothMode),
  getWeight: selector((get) => get(AppStore).weight),
  withinNeutral: selector((get) => get(AppStore).withinNeutral),
  generating: selector((get) => get(AppStore).generateStatus.running),
  generateErrorCode: selector((get) => get(AppStore).generateStatus.errorCode),
  previewBlendShape: selector((get) => get(AppStore).previewBlendShape),
  userSelectPreviewBlendShape: selector(
    (get) => get(AppStore).userSelectPreviewBlendShape
  ),

  // Presentation
  downloadFileName: selector((get) => {
    const { sourceFileName, toothMode } = get(AppStore);
    if (!sourceFileName) return;

    const suffix = toothMode === "gizaba" ? "gizabalify" : "yaebalify";
    return `${basename(sourceFileName, ".vrm")}-${suffix}.vrm`;
  }),
};
