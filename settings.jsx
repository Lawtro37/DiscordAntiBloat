import { storage } from "@vendetta/plugin";
import { Forms, General } from "@vendetta/ui/components";

const { ScrollView } = General;
const { FormSwitchRow, FormSection } = Forms;

export default () => (
  <ScrollView style={{ flex: 1 }}>
    <FormSection title="AntiBloat Settings">
      <FormSwitchRow
        label="Enable AntiBloat"
        subLabel="Hide Nitro, Shop, Quests, and other monetization elements"
        value={storage.enabled ?? true}
        onValueChange={(value) => {
          storage.enabled = value;
          // Trigger a reload message
          if (value) {
            console.log("[AntiBloat] Enabled - restart Discord or reload plugin for full effect");
          } else {
            console.log("[AntiBloat] Disabled");
          }
        }}
      />
    </FormSection>
  </ScrollView>
);
