import { Buffer } from "buffer";
import { GltfVRM } from "./VRM";
import { extname, basename } from "path";
import { buildVRMBuffer } from "./buildVRMBuffer";
import { gizabalifyVRM } from "./gizabalifyVRM";
import { HandledError } from "./HandledError";
import { yaebalifyVRM } from "./yaebalifyVRM";

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

  const teethType = (document.querySelector(
    '[name="teethType"]:checked'
  ) as HTMLInputElement).value;

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

    const vrm = new GltfVRM(gltf);

    if (teethType === "gizaba") gizabalifyVRM(vrm);
    else yaebalifyVRM(vrm);

    const newVRM = buildVRMBuffer(vrm, binBuf);

    const blob = new Blob([newVRM], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const suffix = teethType === "gizaba" ? "gizabalify" : "yaebalify";

    downloadLink.textContent = "Complete! click here to download.";
    recentBlobUrl = downloadLink.href = url;
    downloadLink.download = `${basename(filename, ".vrm")}-${suffix}.vrm`;
  } catch (e) {
    console.error(e);

    if (e instanceof HandledError) {
      downloadLink.textContent = e.message;
    } else {
      downloadLink.textContent = "Oops, process failed 🙄";
    }
  }
});
