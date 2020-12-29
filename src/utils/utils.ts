import { DependencyList, EffectCallback, useEffect } from "react";

export const rescue = async <T>(
  action: () => Promise<T>
): Promise<[result: T, error: null] | [result: null, error: Error]> => {
  try {
    const result = await action();
    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

export const useAsyncEffect = (
  effect: () => Promise<ReturnType<EffectCallback>>,
  deps?: DependencyList
) => {
  useEffect(() => {
    let dispose: ReturnType<EffectCallback> = undefined;

    (async () => {
      dispose = await effect();
    })();

    return () => dispose && dispose();
  }, deps);
};

export const styleWhen = (flag: boolean) => (
  template: TemplateStringsArray,
  ...rest: any[]
) => (flag ? String.raw(template, ...rest) : "");

export const letDownload = (url: string, filename?: string) => {
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename ?? "",
  });

  a.click();
};
