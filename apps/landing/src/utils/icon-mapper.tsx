import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

export const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
};
