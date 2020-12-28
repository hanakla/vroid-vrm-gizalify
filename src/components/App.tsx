import { useFleurContext, useStore } from "@fleur/react";
import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
  Fragment,
} from "react";
import { useTranslation } from "react-i18next";
import styled, { createGlobalStyle } from "styled-components";
import { AppOps, AppSelector, AppStore } from "../domains/App";
import { previewBlendShapes } from "../domains/constants";
import { selectFile } from "../utils/selectFile";
import { Preview } from "./Preview";
import reset from "styled-reset";
import { styleWhen } from "../utils/utils";
import { Button } from "./Button";

export const App = () => {
  const { executeOperation, getStore } = useFleurContext();
  const { t } = useTranslation();

  const sourceFileName = useStore(AppSelector.sourceFileName);
  const toothMode = useStore(AppSelector.toothMode);
  const weight = useStore(AppSelector.getWeight);
  const withinNeutral = useStore(AppSelector.withinNeutral);
  const previewBlendShape = useStore(AppSelector.previewBlendShape);
  const enableBlink = useStore((get) => get(AppStore).state.enableBlink);
  const generating = useStore(AppSelector.generating);
  const generateErrorCode = useStore(AppSelector.generateErrorCode);
  const userSelectPreviewBlendShape = useStore(
    AppSelector.userSelectPreviewBlendShape
  );
  const loadStatus = useStore(AppSelector.loadStatus);

  const isVRMLoaded = useStore(AppSelector.isVRMLoaded);
  const isToothTypeSelected = useStore(AppSelector.isToothTypeSelected);
  const isDownloadable = useStore(AppSelector.isDownloadable);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    executeOperation(AppOps.loadVRM, e.dataTransfer.files[0]);
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

  const handleClickChooseVrm = useCallback(() => {
    const files = selectFile({ extensions: [".vrm"] });
    if (!files[0]) return;
    executeOperation(AppOps.loadVRM, files[0]);
  }, []);

  useEffect(() => {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }, []);

  const handleChangeWeight = useCallback(
    ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      executeOperation(AppOps.setWeight, currentTarget.valueAsNumber);
    },
    []
  );

  const handleClickBlendShapeName = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      const next = e.currentTarget.dataset.name! as any;

      executeOperation(
        AppOps.setUserSelectPreviewBlendShape,
        next === userSelectPreviewBlendShape ? null : next
      );
    },
    [userSelectPreviewBlendShape]
  );

  const handleChangeWithinNeutral = useCallback(
    ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      executeOperation(AppOps.setWithInNeutral, currentTarget.checked);
    },
    []
  );

  const handleInputWeight = useCallback(
    ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      if (Number.isNaN(currentTarget.valueAsNumber)) return;
      executeOperation(AppOps.setWeight, currentTarget.valueAsNumber);
    },
    []
  );

  const handleChangeBlink = useCallback(
    ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      executeOperation(AppOps.setEnableBlink, currentTarget.checked);
    },
    []
  );

  return (
    <Root
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        cursor: dragOver ? "copy" : generating ? "progress" : "auto",
      }}
    >
      <GlobalStyle />
      <Container>
        <Preview />
        <Sidebar>
          <section>
            <Heading disabled={false}>{t("headings.dropVrm")}</Heading>
            <Dropzone onClick={handleClickChooseVrm}>
              {sourceFileName ? `✅ ${sourceFileName}` : t("chooseVrm")}
            </Dropzone>
            <Notation>{t("licence")}</Notation>
            {loadStatus && <Error>{t(loadStatus)}</Error>}
          </section>

          <section>
            <Heading disabled={!isVRMLoaded}>
              {t("headings.chooseTeeth")}
            </Heading>
            {isVRMLoaded && (
              <>
                <Label>
                  <Radio
                    name="teethType"
                    value="gizaba"
                    checked={toothMode === "gizaba"}
                    onChange={handleChangeMode}
                  />
                  ギザ歯 (Jagged Teeth)
                </Label>
                <Label>
                  <Radio
                    name="teethType"
                    value="yaeba"
                    checked={toothMode === "yaeba"}
                    onChange={handleChangeMode}
                  />
                  八重歯 (Double Teeth)
                </Label>
                <Label style={{ marginTop: 8 }}>
                  <input
                    type="checkbox"
                    style={{
                      margin: 0,
                      marginRight: 4,
                      verticalAlign: "text-bottom",
                    }}
                    checked={withinNeutral}
                    onChange={handleChangeWithinNeutral}
                  />
                  {t("enableNeutral")}
                </Label>
              </>
            )}
            {generateErrorCode && <Error>{t(generateErrorCode)}</Error>}
          </section>

          <section>
            <Heading disabled={!isToothTypeSelected}>
              {t("headings.checkFace")}
            </Heading>
            {isToothTypeSelected && (
              <>
                <label>
                  <div>
                    {t("weight")}:{" "}
                    <span>
                      <WeightInput
                        type="number"
                        style={{ fontWeight: "bold", appearance: "none" }}
                        value={weight}
                        onChange={handleInputWeight}
                      />
                      %
                    </span>
                  </div>
                  <Range
                    min={0}
                    max={150}
                    step={1}
                    value={weight}
                    onChange={handleChangeWeight}
                    style={{ width: "100%" }}
                    disabled={!isToothTypeSelected}
                  />
                </label>
                <div style={{ marginTop: 16 }}>
                  {t("currentBlendShape")}
                  <BlendshapeList>
                    {previewBlendShapes.map((name) => (
                      <Fragment key={name}>
                        {name === "a" && <br />}
                        <BlendshapeLabel
                          data-name={name}
                          onClick={handleClickBlendShapeName}
                          active={
                            name ===
                            (userSelectPreviewBlendShape ?? previewBlendShape)
                          }
                        >
                          {name}
                        </BlendshapeLabel>
                      </Fragment>
                    ))}
                  </BlendshapeList>

                  <Label style={{ marginTop: 8 }}>
                    <input
                      type="checkbox"
                      style={{
                        margin: 0,
                        marginRight: 4,
                        verticalAlign: "text-bottom",
                      }}
                      checked={enableBlink}
                      onChange={handleChangeBlink}
                    />
                    {t("enableBlink")}
                  </Label>
                </div>
              </>
            )}
          </section>
          <section>
            <Heading disabled={!isToothTypeSelected}>
              {t("headings.download")}
            </Heading>

            {isToothTypeSelected && (
              <Button
                kind="primary"
                onClick={handleClickDownload}
                disabled={!isDownloadable}
              >
                {isDownloadable ? t("download") : t("generating")}
              </Button>
            )}
          </section>

          <Footer>
            <a href="https://twitter.com/hanak1a" target="_blank">
              Development by @hanak1a
            </a>
            <a
              href="https://github.com/hanakla/vroid-vrm-gizalify"
              style={{ display: "inline-block", marginLeft: 8 }}
              target="_blank"
            >
              Code on GitHub
            </a>
          </Footer>
        </Sidebar>
      </Container>
    </Root>
  );
};

const GlobalStyle = createGlobalStyle`
  ${reset}

  html,
  body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: -apple-system, Roboto, Ubuntu, Cantarell, 'Noto Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
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
  }

  a {
    color: #757575;
  }
`;

const Root = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafafa;
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
  width: 25%;
  min-width: 350px;
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 16px;
  background-color: rgba(45, 48, 51, 0.7);
  color: #fafafa;
  user-select: none;
`;

const Error = styled.div`
  margin: 16px 0;
  color: #f44;
  font-weight: bold;
`;

const Dropzone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  margin: 16px 0;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
`;

const Notation = styled.p`
  position: relative;
  margin-top: 8px;
  padding: 0 8px;
  padding-left: calc(1em + 8px);
  border-radius: 4px;

  &::before {
    content: "ℹ️";
    position: absolute;
    transform: translateX(calc(-100% - 5px));
    line-height: 1.4;
  }
`;

const BlendshapeList = styled.div`
  margin-top: -4px;
  margin-left: -4px;
  padding-top: 4px;
`;

const BlendshapeLabel = styled.span<{ active: boolean }>`
  display: inline-block;
  margin-top: 4px;
  margin-left: 4px;
  padding: 8px;
  min-width: 60px;
  user-select: none;
  cursor: pointer;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
  background-color: #ff982f;
  color: #fff;
  border-radius: 4px;
  line-height: 1;
  font-weight: bold;
  text-align: center;

  &:hover {
    opacity: 0.8;
  }
`;

const Radio = styled.input.attrs(() => ({ type: "radio" }))`
  margin: 0;
  margin-right: 4px;
  vertical-align: text-bottom;
`;

const WeightInput = styled.input`
  width: 4em;
  text-align: right;
  appearance: none;
  font: inherit;
  background: none;
  border: none;
  color: inherit;
  outline: none;
`;

const Heading = styled.h1<{ disabled: boolean }>`
  margin-top: 20px;
  margin-bottom: 12px;
  font-size: 18px;
  line-height: 24px;
  font-weight: bold;

  ${({ disabled }) => styleWhen(disabled)`opacity: .4;`}
`;

const Footer = styled.footer`
  margin-top: auto;
  font-size: 12px;
  text-align: right;

  a {
    color: inherit;
  }
`;

const Range = styled.input.attrs(() => ({ type: "range" }))`
  appearance: none;
  cursor: pointer;
  outline: none;
  height: 4px;

  &::-webkit-slider-thumb {
    appearance: none;
    background: #53aeff;
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
`;
