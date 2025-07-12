import settings from "./settings.jsx";
import { storage } from "@vendetta/plugin";

export default {
  settings,

  onLoad() {
    console.log("[MyFirstPlugin] Loaded!");

    // Set a default value
    storage.enabled ??= true;

    if (storage.enabled) {
      console.log("[MyFirstPlugin] Setting is enabled!");
    } else {
      console.log("[MyFirstPlugin] Setting is disabled!");
    }
  },

  onUnload() {
    console.log("[MyFirstPlugin] Unloaded!");
  }
};
