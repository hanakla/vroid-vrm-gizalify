import Fleur from "@fleur/fleur";
import { AppStore } from "./App";

export const fleurApp = new Fleur({ stores: [AppStore] });
