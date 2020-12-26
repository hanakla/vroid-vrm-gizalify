export const loadImageFromBlob = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  return { image: await loadImage(url), url };
};
​
export const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  }

