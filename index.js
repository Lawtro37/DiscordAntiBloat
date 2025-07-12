import settings from "./settings.jsx";
import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let patches = [];

function safePatch(name, fn) {
  try {
    const unpatch = fn();
    if (unpatch) patches.push(unpatch);
  } catch (e) {
    console.error(`[AntiBloat] Error in ${name}:`, e);
  }
}

export default {
  settings,

  onLoad() {
    // Set default settings
    storage.hideNitro ??= true;
    storage.hideQuests ??= true;
    storage.hideTabs ??= true;

    // Nitro upsells
    if (storage.hideNitro) {
      safePatch("hideNitroUpsell", () => {
        const Upsell = findByProps("tryItOutCtaText");
        if (!Upsell) return;
        return after("default", Upsell, () => null);
      });
    }

    // Server Quests
    if (storage.hideQuests) {
      safePatch("hideQuests", () => {
        const GuildHome = findByProps("useGuildHome");
        if (!GuildHome) return;
        return after("useGuildHome", GuildHome, (_, ret) => {
          ret.shouldShowQuests = false;
          ret.guildHomeSections = ret.guildHomeSections?.filter(
            s => s.sectionType !== "QUESTS"
          );
        });
      });
    }

    // Explore and Monetization tabs
    if (storage.hideTabs) {
      safePatch("hideExploreAndMonetization", () => {
        const TabBar = findByProps("TabBarItem");
        if (!TabBar) return;
        return after("TabBarItem", TabBar, ([args], ret) => {
          if (["Explore", "Monetization"].includes(args.title)) return null;
          return ret;
        });
      });
    }
  },

  onUnload() {
    patches.forEach(unpatch => unpatch());
    patches = [];
  },
};
