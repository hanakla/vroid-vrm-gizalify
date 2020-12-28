import { InvalidVRoidVRMError } from "../InvalidVRoidVRMError";

export enum VRMBlendShapeName {
  A = "A",
  I = "I",
  U = "U",
  E = "E",
  O = "O",
}

export class GltfVRM {
  public readonly vrm: any;
  constructor(public readonly gltf: any, public readonly bin: any) {
    this.vrm = this.gltf.extensions.VRM;
  }

  public getFaceMesh() {
    const meshIndex = (this.gltf
      .meshes as any[]).findIndex(({ name }: { name: string }) =>
      /^Face.*\.baked/i.test(name)
    );

    if (meshIndex === -1) {
      throw new InvalidVRoidVRMError("Face mesh not found.");
    }

    return { index: meshIndex, mesh: this.gltf.meshes[meshIndex] };
  }

  public getFaceMeshes() {
    const { primitives } = this.getFaceMesh().mesh;
    const primitive = primitives[0];

    const { targets } = primitive;
    if (!targets) {
      throw new InvalidVRoidVRMError("FaceMesh.primitive[].targets not found");
    }

    return (targets as any[]).map((target, idx) => ({
      index: idx,
      name: primitive.extras?.targetNames?.[idx] ?? "<name not found>",
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
