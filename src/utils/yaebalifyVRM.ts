import { GltfVRM } from "./VRM";
import { HandledError } from "./HandledError";

export const yaebalifyVRM = (vrm: GltfVRM) => {
  const meshes = vrm.getFaceMeshes();
  console.log(meshes);

  const fung1Mesh = meshes.find(
    ({ name }) =>
      name === "Face.M_F00_000_00_Fcl_HA_Fung1_Up" ||
      name === "Face.M_F00_000_Fcl_HA_Fung1_Up"
  );

  if (!fung1Mesh) {
    throw new HandledError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2 mesh)"
    );
  }

  const findBlendShapeGroupByName = (name: string) =>
    vrm.blendShapeGroups.find((group) => group.name === name);

  [
    [findBlendShapeGroupByName("Neutral"), 100],
    [findBlendShapeGroupByName("A"), 80],
    [findBlendShapeGroupByName("I"), 80],
    [findBlendShapeGroupByName("U"), 30],
    [findBlendShapeGroupByName("E"), 80],
    [findBlendShapeGroupByName("O"), 70],
    [findBlendShapeGroupByName("Angry"), 40],
    [findBlendShapeGroupByName("Fun"), 60],
    [findBlendShapeGroupByName("Joy"), 80],
    [findBlendShapeGroupByName("Sorrow"), 80],
    [findBlendShapeGroupByName("Surprised"), 80],
  ].forEach(([blend, weight]) => {
    if (!blend) {
      throw new HandledError(
        "Oops, it VRM looks like not exported from VRoid Studio. (Missing blendshape)"
      );
    }

    blend.binds.push({
      mesh: vrm.getFaceMesh().index,
      index: fung1Mesh.index,
      weight,
    });
  });
};
