import domready from "domready";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { FleurContext } from "@fleur/react";
import { fleurApp } from "./domains";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import DetectLanguage from "i18next-browser-languagedetector";

domready(() => {
  const root = document.getElementById("root");
  const context = fleurApp.createContext();

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
    </FleurContext>,
    root
  );
});
