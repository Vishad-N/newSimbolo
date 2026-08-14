"use client";

import { EditableCollectionManager } from "./EditableCollectionManager";

export function TechnologiesManager() {
  return <EditableCollectionManager title="Technologies" addLabel="Add Technology" sectionKey="technologies" fields={[{ key: "name", label: "Name" }, { key: "icon", label: "Icon Reference" }]} initialItems={[{ id: "1", name: "React", icon: "FileCode2" }, { id: "2", name: "Node.js", icon: "Database" }]} />;
}
