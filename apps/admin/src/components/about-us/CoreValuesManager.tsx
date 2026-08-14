"use client";

import { EditableCollectionManager } from "./EditableCollectionManager";

export function CoreValuesManager() {
  return <EditableCollectionManager title="Core Values" addLabel="Add Value" sectionKey="values" fields={[{ key: "title", label: "Title" }, { key: "accent", label: "Accent Color" }]} initialItems={[{ id: "1", title: "Innovation", accent: "blue" }, { id: "2", title: "Transparency", accent: "green" }]} />;
}
