import { InvalidVRoidVRMError } from "../InvalidVRoidVRMError";
import { GltfVRM } from "./VRM";

export const yaebalifyVRM = (
  vrm: GltfVRM,
  {
    weight = 0,
    withinNeutral = false,
  }: { weight: number; withinNeutral: boolean }
) => {
  const meshes = vrm.getFaceMeshes();
  const normWeight = weight / 100;

  const fung1Mesh = meshes.find(
    ({ name }) =>
      name === "Face.M_F00_000_00_Fcl_HA_Fung1_Up" ||
      name === "Face.M_F00_000_Fcl_HA_Fung1_Up"
  );

  if (!fung1Mesh) {
    throw new InvalidVRoidVRMError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2 mesh)"
    );
  }

  const findBlendShapeGroupByName = (name: string) =>
    vrm.blendShapeGroups.find((group) => group.name === name);

  [
    ...(withinNeutral
      ? [[findBlendShapeGroupByName("Neutral"), Math.round(100 * normWeight)]]
      : []),
    [findBlendShapeGroupByName("A"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("I"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("U"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("E"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("O"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("Angry"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("Fun"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("Joy"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("Sorrow"), Math.round(100 * normWeight)],
    [findBlendShapeGroupByName("Surprised"), Math.round(100 * normWeight)],
  ].forEach(([blend, weight]) => {
    if (!blend) {
      throw new InvalidVRoidVRMError(
        "Oops, it VRM looks like not exported from VRoid Studio. (Missing blendshape)"
      );
    }

    blend.binds.push({
      mesh: vrm.getFaceMesh().index,
      index: fung1Mesh.index,
      weight: Math.max(0, Math.min(weight, 100)),
    });
  });
};
