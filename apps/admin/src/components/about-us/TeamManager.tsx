"use client";

import { EditableCollectionManager } from "./EditableCollectionManager";

export function TeamManager() {
  return <EditableCollectionManager title="Team Members" addLabel="Add Member" sectionKey="team" fields={[{ key: "name", label: "Name" }, { key: "role", label: "Role" }]} initialItems={[{ id: "1", name: "Vishad", role: "Founder & CEO" }, { id: "2", name: "Alex", role: "Lead Developer" }, { id: "3", name: "Sarah", role: "Head of Design" }]} />;
}
