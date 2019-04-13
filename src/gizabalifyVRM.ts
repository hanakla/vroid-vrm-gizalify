import { GltfVRM } from "./VRM";
import { HandledError } from "./HandledError";

export const gizabalifyVRM = (vrm: GltfVRM) => {
  const meshes = vrm.getFaceMeshes();

  const fung2Mesh = meshes.find(
    ({ name }) =>
      name === "Face.M_F00_000_00_Fcl_HA_Fung2" ||
      name === "Face.M_F00_000_Fcl_HA_Fung2"
  );

  if (!fung2Mesh) {
    throw new HandledError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2 mesh)"
    );
  }

  const findBlendShapeGroupByName = (name: string) =>
    vrm.blendShapeGroups.find(group => group.name === name);

  [
    [findBlendShapeGroupByName("A"), 70],
    [findBlendShapeGroupByName("I"), 30],
    [findBlendShapeGroupByName("U"), 30],
    [findBlendShapeGroupByName("E"), 50],
    [findBlendShapeGroupByName("O"), 60],
    [findBlendShapeGroupByName("Angry"), 0],
    [findBlendShapeGroupByName("Fun"), 0],
    [findBlendShapeGroupByName("Joy"), 80],
    [findBlendShapeGroupByName("Sorrow"), 80],
    [findBlendShapeGroupByName("Surprised"), 90]
  ].forEach(([blend, weight]) => {
    if (!blend) {
      throw new HandledError(
        "Oops, it VRM looks like not exported from VRoid Studio. (Missing blendshape)"
      );
    }

    blend.binds.push({
      mesh: vrm.getFaceMesh().index,
      index: fung2Mesh.index,
      weight
    });
  });
};
