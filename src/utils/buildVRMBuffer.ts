import { GltfVRM } from "./VRM";

export const buildVRMBuffer = (vrm: GltfVRM) => {
  const newGltfBuf = new Buffer(vrm.toString(), "utf-8");

  const jsonChunkType = new Buffer(4);
  jsonChunkType.writeUInt32LE(/* json */ 0x4e4f534a, 0);

  const binChunkType = new Buffer(4);
  binChunkType.writeUInt32LE(/* bin */ 0x004e4942, 0);

  const newJSONBufLength = Buffer.alloc(4);
  newJSONBufLength.writeUInt32LE(newGltfBuf.byteLength, 0);

  const binBufLength = Buffer.alloc(4);
  binBufLength.writeUInt32LE(vrm.bin.byteLength, 0);

  const newVRM = Buffer.concat([
    new Buffer([0x67, 0x6c, 0x54, 0x46]), // magic
    new Buffer([0x02, 0x00, 0x00, 0x00]), // Version
    new Buffer([0x00, 0x00, 0x00, 0x00]), // File Size

    newJSONBufLength,
    jsonChunkType,
    newGltfBuf,

    binBufLength,
    binChunkType,
    vrm.bin,
  ]);

  newVRM.writeUInt32LE(newVRM.byteLength, 8);

  return newVRM;
};
