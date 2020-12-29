import { ModalComponentType } from "@fleur/mordred";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { letDownload, rescue, useAsyncEffect } from "../utils/utils";

export const ConfirmPhoto: ModalComponentType<
  { url: string; blob: Blob },
  void
> = ({ url, blob, onClose }) => {
  const { t } = useTranslation();
  const [clipboardGranted, setClipBoardGranted] = useState<boolean | null>(
    false
  );

  const handleClickDownload = useCallback(async () => {
    if (clipboardGranted) {
      navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } else {
      letDownload(url, `gizabalify-screenshot-${Date.now()}.jpg`);
    }
  }, [url, clipboardGranted, blob]);

  const twitterUrl = useMemo(
    () =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        t("shareText")!
      )}&url=${encodeURIComponent(location.href)}`,
    []
  );

  const handleClickShare = useCallback((e: MouseEvent) => {
    window.open(twitterUrl, void 0, "width=500,height=500");
    e.preventDefault();
  }, []);

  useAsyncEffect(async () => {
    const [result] = await rescue(() =>
      navigator.permissions.query({
        name: "clipboard-write" as any,
      })
    );
    setClipBoardGranted(result?.state === "granted");
  }, []);

  return (
    <Root>
      <img src={url} style={{ width: "100%" }} />
      <div style={{ marginTop: "16px", padding: "0 16px" }}>
        <a href={twitterUrl} onClick={handleClickShare}>
          {t("letShare")}
        </a>
      </div>
      <Footer>
        <Button onClick={onClose}>{t("close")}</Button>
        <Button
          kind="primary"
          onClick={handleClickDownload}
          disabled={clipboardGranted === null}
        >
          {clipboardGranted == null ||
          clipboardGranted === false ||
          typeof ClipboardItem === "undefined"
            ? t("save")
            : t("copyToClipboard")}
        </Button>
      </Footer>
    </Root>
  );
};

const Root = styled.div`
  max-width: 800px;
  margin: auto;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
`;

const Footer = styled.footer`
  display: flex;
  flex-flow: row;
  gap: 16px;
  padding: 16px;
`;
