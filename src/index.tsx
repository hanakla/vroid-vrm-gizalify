import domready from "domready";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { FleurContext } from "@fleur/react";
import { fleurApp } from "./domains";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import DetectLanguage from "i18next-browser-languagedetector";
import { Mordred, MordredRenderer } from "@fleur/mordred";
import styled from "styled-components";
import { rgba } from "polished";

domready(() => {
  const root = document.getElementById("root");
  const context = fleurApp.createContext();

  Mordred.init();

  i18next
    .use(initReactI18next)
    .use(DetectLanguage)
    .init({
      resources: {
        en: require("./resources/locale/en.json"),
        ja: require("./resources/locale/ja.json"),
      },
      defaultNS: "common",
      fallbackLng: "ja",
    });

  ReactDOM.render(
    <FleurContext value={context}>
      <App />
      <MordredRenderer>
        {({ children }) => <Backdrop>{children}</Backdrop>}
      </MordredRenderer>
    </FleurContext>,
    root
  );
});

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: ${rgba("#335", 0.3)};
`;
