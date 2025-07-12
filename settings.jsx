import { storage } from "@vendetta/plugin";
import { Forms, General } from "@vendetta/ui/components";

const { ScrollView } = General;
const { FormSwitchRow, FormSection, FormInput } = Forms;

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
      
      <FormSwitchRow
        label="Debug Mode"
        subLabel="Enable WebSocket debugging (requires debug server)"
        value={storage.debugMode ?? false}
        onValueChange={(value) => {
          storage.debugMode = value;
          console.log(`[AntiBloat] Debug mode ${value ? 'enabled' : 'disabled'}`);
        }}
      />
      
      <FormInput
        title="Debug Server URL"
        placeholder="ws://192.168.56.1:8081"
        value={storage.debugServerUrl ?? "ws://192.168.56.1:8081"}
        onChange={(value) => {
          storage.debugServerUrl = value;
        }}
      />
    </FormSection>
  </ScrollView>
);
