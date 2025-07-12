import { storage } from "@vendetta/plugin";
import { Forms, General } from "@vendetta/ui/components";

const { ScrollView } = General;
const { FormSwitchRow } = Forms;

export default () => (
  <ScrollView style={{ flex: 1 }}>
    <FormSwitchRow
      label="Enable plugin feature"
      value={storage.enabled ?? true}
      onValueChange={(value) => {
        storage.enabled = value;
      }}
    />
  </ScrollView>
);
