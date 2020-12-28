import { ModalComponentType } from "@fleur/mordred";
import { MouseEvent, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { letDownload } from "../utils/utils";

export const ConfirmPhoto: ModalComponentType<{ url: string }, void> = ({
  url,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleClickDownload = useCallback(() => {
    letDownload(url, `gizabalify-screenshot-${Date.now()}.jpg`);
    onClose();
  }, [url]);

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
        <Button kind="primary" onClick={handleClickDownload}>
          {t("save")}
        </Button>
      </Footer>
    </Root>
  );
};

const Root = styled.div`
  max-width: 800px;
  max-height 80vh;
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
