let patches = [];

import vendetta from "@vendetta/metro";
import { FormSwitchRow } from "@vendetta/ui/components/Forms";
import { ScrollView } from "@vendetta/ui/components/General";
import { storage } from "@vendetta/storage";
import { after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";

function safePatch(name, fn) {
  try {
    fn();
  } catch (e) {
    console.log(`[AntiBloat] Error in ${name}:`, e);
  }
}

function hideNitroUpsell() {
  safePatch("hideNitroUpsell", () => {
    const Upsell = findByProps("tryItOutCtaText");
    if (!Upsell) return;
    patches.push(after("default", Upsell, (_, ret) => null));
  });
}

function hideQuests() {
  safePatch("hideQuests", () => {
    const GuildHome = findByProps("useGuildHome");
    if (!GuildHome) return;
    patches.push(after("useGuildHome", GuildHome, (_, ret) => {
      ret.shouldShowQuests = false;
      ret.guildHomeSections = ret.guildHomeSections?.filter(
        section => section.sectionType !== "QUESTS"
      );
    }));
  });
}

function hideExploreAndMonetization() {
  safePatch("hideExploreAndMonetization", () => {
    const TabBar = findByProps("TabBarItem");
    if (!TabBar) return;
    patches.push(after("TabBarItem", TabBar, ([args], ret) => {
      if (["Explore", "Monetization"].includes(args.title)) return null;
      return ret;
    }));
  });
}

// Apply patches based on storage toggles
function applyPatches() {
  if (storage.hideNitro ?? true) hideNitroUpsell();
  if (storage.hideQuests ?? true) hideQuests();
  if (storage.hideTabs ?? true) hideExploreAndMonetization();
}

// Plugin export
module.exports = {
  onLoad() {
    applyPatches();
  },

  onUnload() {
    patches.forEach(unpatch => unpatch());
    patches = [];
  },

  settings() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <FormSwitchRow
          label="Hide Nitro upsell banners"
          value={storage.hideNitro ?? true}
          onValueChange={(value) => {
            storage.hideNitro = value;
          }}
        />
        <FormSwitchRow
          label="Hide Server Quests"
          value={storage.hideQuests ?? true}
          onValueChange={(value) => {
            storage.hideQuests = value;
          }}
        />
        <FormSwitchRow
          label="Hide Explore/Monetization Tabs"
          value={storage.hideTabs ?? true}
          onValueChange={(value) => {
            storage.hideTabs = value;
          }}
        />
      </ScrollView>
    );
  }
};
