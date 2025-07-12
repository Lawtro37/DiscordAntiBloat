import { storage } from "@vendetta/plugin";
import { Forms, General } from "@vendetta/ui/components";

const { FormSwitchRow } = Forms;
const { ScrollView } = General;

export default () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <FormSwitchRow
        label="Hide Nitro upsells"
        value={storage.hideNitro ?? true}
        onValueChange={(v) => (storage.hideNitro = v)}
      />
      <FormSwitchRow
        label="Hide Server Quests"
        value={storage.hideQuests ?? true}
        onValueChange={(v) => (storage.hideQuests = v)}
      />
      <FormSwitchRow
        label="Hide Explore/Monetization Tabs"
        value={storage.hideTabs ?? true}
        onValueChange={(v) => (storage.hideTabs = v)}
      />
    </ScrollView>
  );
};
