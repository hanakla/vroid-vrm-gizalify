import { GltfVRM } from "./VRM";
import { InvalidVRoidVRMError } from "../InvalidVRoidVRMError";

export const gizabalifyVRM = (
  vrm: GltfVRM,
  {
    weight = 0,
    withinNeutral = false,
  }: { weight: number; withinNeutral: boolean }
) => {
  const meshes = vrm.getFaceMeshes();
  const normWeight = weight / 100;

  // console.log(meshes);
  const fung2Mesh = meshes.find(
    ({ name }) =>
      name === "Face.M_F00_000_00_Fcl_HA_Fung2" ||
      name === "Face.M_F00_000_Fcl_HA_Fung2"
  );

  const fung2UpMesh = meshes.find(
    ({ name }) =>
      name === "Face.M_F00_000_00_Fcl_HA_Fung_Up" ||
      name === "Face.M_F00_000_00_Fcl_HA_Fung2_Up"
  );
  const fung2LowMesh = meshes.find(
    ({ name }) =>
      name === "Face.M_F00_000_00_Fcl_HA_Fung_Low" ||
      name === "Face.M_F00_000_00_Fcl_HA_Fung2_Low"
  );

  if (!fung2Mesh) {
    throw new InvalidVRoidVRMError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2 mesh)"
    );
  }

  if (!fung2UpMesh) {
    throw new InvalidVRoidVRMError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2_up mesh)"
    );
  }

  const findBlendShapeGroupByName = (name: string) => {
    return vrm.blendShapeGroups.find((group) => group.name === name);
  };

  // ギザ歯を全表情に入れる
  [
    ...(withinNeutral
      ? [
          [
            findBlendShapeGroupByName("Neutral"),
            Math.round(100 * normWeight),
            fung2Mesh,
          ],
        ]
      : []),
    [findBlendShapeGroupByName("A"), Math.round(70 * normWeight), fung2Mesh],
    [findBlendShapeGroupByName("I"), Math.round(60 * normWeight), fung2Mesh],
    [findBlendShapeGroupByName("U"), Math.round(50 * normWeight), fung2Mesh],
    [findBlendShapeGroupByName("E"), Math.round(20 * normWeight), fung2Mesh],
    [findBlendShapeGroupByName("O"), Math.round(60 * normWeight), fung2UpMesh],
    [findBlendShapeGroupByName("O"), Math.round(50 * normWeight), fung2LowMesh],
    [findBlendShapeGroupByName("Angry"), Math.round(0 * normWeight), fung2Mesh],
    [
      findBlendShapeGroupByName("Fun"),
      Math.round(100 * normWeight),
      fung2UpMesh,
    ],
    [
      findBlendShapeGroupByName("Fun"),
      Math.round(100 * normWeight),
      fung2LowMesh,
    ],
    [findBlendShapeGroupByName("Joy"), Math.round(80 * normWeight), fung2Mesh],
    [
      findBlendShapeGroupByName("Sorrow"),
      Math.round(80 * normWeight),
      fung2Mesh,
    ],
    [
      findBlendShapeGroupByName("Surprised"),
      Math.round(90 * normWeight),
      fung2Mesh,
    ],
  ].forEach(([blend, weight, mesh]) => {
    if (!blend) {
      throw new InvalidVRoidVRMError(
        "Oops, it VRM looks like not exported from VRoid Studio. (Missing blendshape)"
      );
    }

    blend.binds.unshift({
      mesh: vrm.getFaceMesh().index,
      index: mesh.index,
      weight: Math.max(0, Math.min(weight, 100)),
    });
  });
};
