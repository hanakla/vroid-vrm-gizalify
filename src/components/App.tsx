import { useFleurContext, useStore } from "@fleur/react";
import { basename } from "path";
import { ChangeEvent, DragEvent, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { createGlobalStyle } from "styled-components";
import { AppOps, AppSelector, AppStore } from "../domains/App";
import { Preview } from "./Preview";

export const App = () => {
  const { executeOperation, getStore } = useFleurContext();
  const { t } = useTranslation();
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  const toothMode = useStore(AppSelector.toothMode);
  const isDownloadable = useStore(AppSelector.isDownloadable);
  const isVRMLoaded = useStore(AppSelector.isVRMLoaded);
  const isToothTypeSelected = useStore(AppSelector.isToothTypeSelected);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    executeOperation(AppOps.setVrm, e.dataTransfer.files[0]);

    //   if (e instanceof HandledError) {
    //     downloadLink.textContent = e.message;
    //   } else {
    //     downloadLink.textContent = "Oops, process failed 🙄";
    //   }
    // }
  }, []);

  const handleChangeMode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    executeOperation(AppOps.setToothMode, e.currentTarget.value as any);
  }, []);

  const handleClickDownload = useCallback(() => {
    const fileName = AppSelector.downloadFileName(getStore);
    const { vrmUrl } = AppSelector.currentVrm(getStore);
    if (!fileName || !vrmUrl) return;

    const a = document.createElement("a");
    a.href = vrmUrl;
    a.download = fileName;
    a.click();
  }, [toothMode, isDownloadable]);

  useEffect(() => {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }, []);

  return (
    <Root onDragOver={handleDragOver} onDrop={handleDrop}>
      <GlobalStyle />
      <Container>
        <Preview />
        <Sidebar>
          <section>
            <Heading disabled={false}>1. Drop VRM in window</Heading>
            <p
              style={{
                padding: 8,
                backgroundColor: "rgba(255, 255, 255, .8)",
                color: "#333",
                borderRadius: 4,
              }}
            >
              {t("licence")}
            </p>
          </section>

          <section>
            <Heading disabled={!isVRMLoaded}>2. Choose teeth type</Heading>
            {isVRMLoaded && (
              <>
                <Label>
                  <input
                    type="radio"
                    name="teethType"
                    value="gizaba"
                    checked={toothMode === "gizaba"}
                    onChange={handleChangeMode}
                  />
                  ギザ歯(Jagged Teeth)
                </Label>
                <Label>
                  <input
                    type="radio"
                    name="teethType"
                    value="yaeba"
                    checked={toothMode === "yaeba"}
                    onChange={handleChangeMode}
                  />
                  八重歯(Double Teeth)
                </Label>
              </>
            )}
          </section>

          <section>
            <Heading disabled={!isToothTypeSelected}>
              3. Check expression
            </Heading>
          </section>
          <section>
            <Heading disabled={!isDownloadable}>4. Download</Heading>
            {isDownloadable && (
              <Button onClick={handleClickDownload}>Download</Button>
            )}
          </section>

          <Footer>
            <a href="https://twitter.com/hanak1a" target="_blank">
              Development by @hanak1a
            </a>
          </Footer>
        </Sidebar>
      </Container>
    </Root>
  );
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    font-size: 12px;
  }
`;

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  // display: flex;
  width: 100%;
  height: 100%;
  // flex-flow: columns;
`;

const Label = styled.label`
  display: block;
  padding: 4px;
`;

const Sidebar = styled.div`
  position: absolute;
  right: 0;
  width: 20%;
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 16px;
  background-color: rgba(200, 200, 200, 0.5);

  h1 {
    margin: 16px 0 8px;
    font-size: 18px;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 8px;
  text-align: center;
  border: none;
  background-color: #724abf;
  color: #fff;
  border-radius: 4px;
`;

const Heading = styled.h1<{ disabled: boolean }>`
  ${({ disabled }) => disabled && `opacity: .5;`}
`;

const Footer = styled.footer`
  margin-top: auto;
  padding: 8px;
  font-size: 12px;
  text-align: right;

  a {
    color: #aaa;
  }
`;
