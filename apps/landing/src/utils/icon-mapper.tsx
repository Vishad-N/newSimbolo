"use client";

import React from "react";
import { DynamicIcon as LucideDynamicIcon, iconNames } from "lucide-react/dynamic";
import { HelpCircle } from "lucide-react";

export type IconName = string;

/**
 * CMS/mock data stores icon names in Lucide's PascalCase component name
 * (e.g. "CheckCircle2", "ArrowRight") — lucide-react's own DynamicIcon takes
 * kebab-case names instead ("check-circle-2"), so convert before delegating.
 * Using the `lucide-react/dynamic` entry point (rather than importing the
 * full `lucide-react` barrel and indexing into it by name) lazy-loads only
 * the one icon actually rendered, instead of bundling all ~1000 icons on
 * every page that uses a CMS-driven icon.
 */
function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .toLowerCase();
}

const iconNameSet = new Set(iconNames);

export const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const kebabName = toKebabCase(name);
  if (!iconNameSet.has(kebabName as (typeof iconNames)[number])) {
    return <HelpCircle className={className} />;
  }
  return (
    <LucideDynamicIcon
      name={kebabName as (typeof iconNames)[number]}
      className={className}
      fallback={() => <HelpCircle className={className} />}
    />
  );
};
