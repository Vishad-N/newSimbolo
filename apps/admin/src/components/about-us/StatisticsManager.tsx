"use client";

import { EditableCollectionManager } from "./EditableCollectionManager";

export function StatisticsManager() {
  return <EditableCollectionManager title="Statistics" addLabel="Add Stat" sectionKey="statistics" fields={[{ key: "value", label: "Value" }, { key: "suffix", label: "Suffix" }, { key: "label", label: "Label" }]} initialItems={[{ id: "1", value: "250", suffix: "+", label: "Projects Delivered" }, { id: "2", value: "100", suffix: "+", label: "Happy Clients" }]} />;
}
