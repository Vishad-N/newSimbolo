"use client";

import { EditableCollectionManager } from "./EditableCollectionManager";

export function TimelineManager() {
  return <EditableCollectionManager title="Company Timeline" addLabel="Add Event" sectionKey="timeline" fields={[{ key: "year", label: "Year" }, { key: "title", label: "Title" }]} initialItems={[{ id: "1", year: "2022", title: "Founded" }, { id: "2", year: "2023", title: "50 Clients Milestone" }, { id: "3", year: "2024", title: "Platform Expansion" }]} />;
}
