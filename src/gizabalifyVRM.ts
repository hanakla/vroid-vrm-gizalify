import { GltfVRM } from "./VRM";
import { HandledError } from "./HandledError";

export const gizabalifyVRM = (vrm: GltfVRM) => {
  const meshes = vrm.getFaceMeshes();

  console.log(meshes);
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
    throw new HandledError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2 mesh)"
    );
  }

  if (!fung2UpMesh) {
    throw new HandledError(
      "Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2_up mesh)"
    );
  }

  const findBlendShapeGroupByName = (name: string) =>
    vrm.blendShapeGroups.find((group) => group.name === name);

  // Funをいい感じに調整する
  {
    const funBlendshape = findBlendShapeGroupByName("Fun");
    funBlendshape.binds[0].weight = 80;

    const mth_A_mesh = meshes.find(
      ({ name }) => name === "Face.M_F00_000_00_Fcl_MTH_A"
    );
    const mth_E_mesh = meshes.find(
      ({ name }) => name === "Face.M_F00_000_00_Fcl_MTH_E"
    );

    [
      [mth_E_mesh, 24],
      [mth_A_mesh, 49],
      // [fung2UpMesh, 100],
    ].forEach(([mesh, weight]) => {
      funBlendshape.binds.push({
        mesh: vrm.getFaceMesh().index,
        index: mesh.index,
        weight: weight,
      });
    });
  }

  // ギザ歯を全表情に入れる
  [
    [findBlendShapeGroupByName("Neutral"), 100, fung2Mesh],
    [findBlendShapeGroupByName("A"), 70, fung2Mesh],
    [findBlendShapeGroupByName("I"), 60, fung2Mesh],
    [findBlendShapeGroupByName("U"), 30, fung2Mesh],
    [findBlendShapeGroupByName("E"), 60, fung2Mesh],
    [findBlendShapeGroupByName("O"), 80, fung2Mesh],
    [findBlendShapeGroupByName("Angry"), 0, fung2Mesh],
    [findBlendShapeGroupByName("Fun"), 100, fung2UpMesh],
    [findBlendShapeGroupByName("Fun"), 40, fung2LowMesh],
    [findBlendShapeGroupByName("Joy"), 80, fung2Mesh],
    [findBlendShapeGroupByName("Sorrow"), 80, fung2Mesh],
    [findBlendShapeGroupByName("Surprised"), 90, fung2Mesh],
  ].forEach(([blend, weight, mesh]) => {
    if (!blend) {
      throw new HandledError(
        "Oops, it VRM looks like not exported from VRoid Studio. (Missing blendshape)"
      );
    }

    blend.binds.push({
      mesh: vrm.getFaceMesh().index,
      index: mesh.index,
      weight,
    });
  });
};
