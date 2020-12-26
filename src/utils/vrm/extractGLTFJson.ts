import { extname } from "path";
import { Buffer } from "buffer";
import { GltfVRM } from "./VRM";
import { HandledError } from "../HandledError";

const validGltf = (bin: Buffer) => {
  return bin.slice(0, 4).toString("utf-8") === "glTF";
};

export const extractGLTFJson = async (buffer: ArrayBuffer) => {
  const gltfBuffer = Buffer.from(buffer);

  if (!validGltf(gltfBuffer)) {
    throw new HandledError("Invalid VRM🙅");
  }

  const jsonBufSize = gltfBuffer.readUInt32LE(12);
  const binBuf = gltfBuffer.slice(jsonBufSize + 28);

  const jsonString = gltfBuffer.toString("utf8", 20, jsonBufSize + 20);
  const gltf = JSON.parse(jsonString);

  return new GltfVRM(gltf, binBuf);
};
