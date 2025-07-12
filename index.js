import settings from "./settings.jsx";
import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

function safePatch(name, fn) {
  try {
    return fn();
  } catch (e) {
    console.error(`[AntiBloat] Error in ${name}:`, e);
  }
}

export default {
  settings,
  patches: [],
  onLoad() {
    // Default toggle values
    storage.hideNitro ??= true;
    storage.hideQuests ??= true;
    storage.hideTabs ??= true;

    if (storage.hideNitro) {
      const Upsell = findByProps("tryItOutCtaText");
      if (Upsell) {
        this.patches.push(
          safePatch("hideNitroUpsell", () =>
            after("default", Upsell, () => null)
          )
        );
      }
    }

    if (storage.hideQuests) {
      const GuildHome = findByProps("useGuildHome");
      if (GuildHome) {
        this.patches.push(
          safePatch("hideQuests", () =>
            after("useGuildHome", GuildHome, (_, ret) => {
              ret.shouldShowQuests = false;
              ret.guildHomeSections = ret.guildHomeSections?.filter(
                s => s.sectionType !== "QUESTS"
              );
            })
          )
        );
      }
    }

    if (storage.hideTabs) {
      const TabBar = findByProps("TabBarItem");
      if (TabBar) {
        this.patches.push(
          safePatch("hideExploreAndMonetization", () =>
            after("TabBarItem", TabBar, ([args], ret) => {
              if (["Explore", "Monetization"].includes(args.title)) return null;
              return ret;
            })
          )
        );
      }
    }
  },
  onUnload() {
    this.patches.forEach(unpatch => unpatch());
    this.patches = [];
  },
};
