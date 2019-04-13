import { Buffer } from "buffer";
import { VRM } from "./VRM";
import { extname, basename } from "path";

let recentBlobUrl: string;

const validGltf = (file: File, bin: Buffer) => {
  return (
    extname(file.name) === ".vrm" &&
    bin.slice(0, 4).toString("utf-8") === "glTF"
  );
};

window.addEventListener("dragover", e => {
  e.preventDefault();
});

window.addEventListener("drop", async e => {
  e.preventDefault();

  const downloadLink = document.querySelector("#download") as HTMLAnchorElement;
  downloadLink.removeAttribute("href");
  downloadLink.textContent = "Gizabalify... 🕐";

  const file = e.dataTransfer.files[0];
  if (recentBlobUrl) {
    URL.revokeObjectURL(recentBlobUrl);
  }

  await new Promise(r => setTimeout(r, 500));

  try {
    const filename = file.name;
    const reader = new FileReader();

    const gltfBuffer = await new Promise<Buffer>(resolve => {
      reader.onload = () => resolve(new Buffer(reader.result as ArrayBuffer));
      reader.readAsArrayBuffer(file);
    });

    if (!validGltf(file, gltfBuffer)) {
      downloadLink.textContent = "Invalid VRM🙅";
      return;
    }

    const jsonBufSize = gltfBuffer.readUInt32LE(12);
    const binBuf = gltfBuffer.slice(jsonBufSize + 28);

    const jsonString = gltfBuffer.toString("utf8", 20, jsonBufSize + 20);
    const gltf = JSON.parse(jsonString);

    const vrm = new VRM(gltf);

    const meshes = vrm.getFaceMeshes();
    const fung2Mesh = meshes.find(
      ({ name }) =>
        name === "Face.M_F00_000_00_Fcl_HA_Fung2" ||
        name === "Face.M_F00_000_Fcl_HA_Fung2"
    );

    if (!fung2Mesh) {
      downloadLink.textContent =
        "Oops, it VRM looks like not exported from VRoid Studio";

      throw new Error("Unsupported VRM");
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
        downloadLink.textContent =
          "Oops, it VRM looks like not exported from VRoid Studio";

        throw new Error("Unsupported VRM");
      }

      blend.binds.push({
        mesh: vrm.getFaceMesh().index,
        index: fung2Mesh.index,
        weight
      });
    });

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

    downloadLink.textContent = "Complete! click here to download.";
    recentBlobUrl = downloadLink.href = url;
    downloadLink.download = `${basename(filename, ".vrm")}-gizabalify.vrm`;
  } catch (e) {
    console.error(e);
    downloadLink.textContent = "Oops, process failed 🙄";
  }
});
