export enum VRMBlendShapeName {
  A = "A",
  I = "I",
  U = "U",
  E = "E",
  O = "O",
}

export class GltfVRM {
  private vrm: any;
  constructor(private gltf: any) {
    this.vrm = this.gltf.extensions.VRM;
  }

  public getFaceMesh() {
    const meshIndex = (this.gltf.meshes as any[]).findIndex(
      ({ name }: { name: string }) =>
        name === "Face.baked" || name === "Face (merged).baked"
    );

    return { index: meshIndex, mesh: this.gltf.meshes[meshIndex] };
  }

  public getFaceMeshes() {
    const { primitives } = this.getFaceMesh().mesh;
    const {
      targets,
      extras: { targetNames },
    } = primitives[0];

    return (targets as any[]).map((target, idx) => ({
      index: idx,
      name: targetNames[idx],
      target,
    }));
  }

  public get blendShapeGroups(): any[] {
    return this.vrm.blendShapeMaster.blendShapeGroups;
  }

  public toString() {
    console.log("VRM serialized", this.gltf);
    return JSON.stringify(this.gltf);
  }
}
