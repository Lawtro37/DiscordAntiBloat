let patches = [];

const { findByProps } = vendetta.metro;
const { after } = vendetta.patcher;

function hideNitroUpsell() {
  const Upsell = findByProps("tryItOutCtaText");
  if (!Upsell) return;
  patches.push(after("default", Upsell, (_, ret) => null));
}

function hideQuests() {
  const GuildHome = findByProps("useGuildHome");
  if (!GuildHome) return;
  patches.push(after("useGuildHome", GuildHome, (_, ret) => {
    ret.shouldShowQuests = false;
    ret.guildHomeSections = ret.guildHomeSections?.filter(
      section => section.sectionType !== "QUESTS"
    );
  }));
}

function hideExploreAndMonetization() {
  const TabBar = findByProps("TabBarItem");
  if (!TabBar) return;
  patches.push(after("TabBarItem", TabBar, ([args], ret) => {
    if (["Explore", "Monetization"].includes(args.title)) return null;
    return ret;
  }));
}

module.exports = {
  onLoad() {
    hideNitroUpsell();
    hideQuests();
    hideExploreAndMonetization();
  },
  onUnload() {
    patches.forEach(unpatch => unpatch());
    patches = [];
  }
};
