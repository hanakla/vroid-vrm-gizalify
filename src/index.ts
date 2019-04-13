// import fs from "fs";
import { Buffer } from "buffer";
import { VRM, VRMBlendShapeName } from "./VRM";

window.addEventListener("dragover", e => {
  e.preventDefault();
});

window.addEventListener("drop", async e => {
  e.preventDefault();

  const [file] = e.dataTransfer.files;
  const reader = new FileReader();

  const vrmBuffer = await new Promise<ArrayBuffer>(resolve => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(file);
  });

  const gltfBin = new Buffer(vrmBuffer);
  const jsonBufSize = gltfBin.readUInt32LE(12);
  const binBuf = gltfBin.slice(jsonBufSize + 28);

  const jsonString = gltfBin.toString("utf8", 20, jsonBufSize + 20);
  const gltf = JSON.parse(jsonString);

  const vrm = new VRM(gltf);
  console.log({ gltf, vrm });

  console.log(vrm.findBlendByName(VRMBlendShapeName.A));
  const meshes = vrm.getFaceMeshes();

  const fung2Mesh = meshes.find(
    ({ name }) => name == "Face.M_F00_000_00_Fcl_HA_Fung2"
  );

  const findBlendShapeGroupByName = (name: string) =>
    vrm.blendShapeGroups.find(group => group.name === name);

  const aBlend = findBlendShapeGroupByName("A");
  const iBlend = findBlendShapeGroupByName("I");
  const uBlend = findBlendShapeGroupByName("U");
  const eBlend = findBlendShapeGroupByName("E");
  const oBlend = findBlendShapeGroupByName("O");
  const angryBlend = findBlendShapeGroupByName("Angry");
  const funBlend = findBlendShapeGroupByName("Fun");
  const joyBlend = findBlendShapeGroupByName("Joy");
  const sorrowBlend = findBlendShapeGroupByName("Sorrow");
  const surprisedBlend = findBlendShapeGroupByName("Surprised");

  // prettier-ignore
  [
    [aBlend, 70],
    [iBlend, 30],
    [uBlend, 30],
    [eBlend, 50],
    [oBlend, 60],
    [angryBlend, 0],
    [funBlend, 0],
    [joyBlend, 80],
    [sorrowBlend, 80],
    [surprisedBlend, 90],
  ].forEach(([blend, weight]) => {
    blend.binds.push({
      mesh: vrm.getFaceMesh().index,
      index: fung2Mesh.index,
      weight
    });
  });

  console.log(vrm);

  const newGltfBuf = new Buffer(vrm.toString(), "utf-8");

  const jsonChunkType = new Buffer(4);
  jsonChunkType.writeUInt32LE(/* json */ 0x4e4f534a, 0);

  const binChunkType = new Buffer(4);
  binChunkType.writeUInt32LE(/* bin */ 0x004e4942, 0);

  const newJSONBufLength = Buffer.alloc(4);
  newJSONBufLength.writeUInt32LE(newGltfBuf.byteLength, 0);

  const binBufLength = Buffer.alloc(4);
  binBufLength.writeUInt32LE(binBuf.byteLength, 0);

  const newVRM = Buffer.concat([
    new Buffer([0x67, 0x6c, 0x54, 0x46]),
    new Buffer([0x02, 0x00, 0x00, 0x00]),
    new Buffer([0x00, 0x00, 0x00, 0x00]), // File Size

    newJSONBufLength,
    jsonChunkType,
    newGltfBuf,

    binBufLength,
    binChunkType,
    binBuf
  ]);

  newVRM.writeUInt32LE(newVRM.byteLength, 8);

  const blob = new Blob([newVRM], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  console.log(url);
  //   window.open(url);
});
