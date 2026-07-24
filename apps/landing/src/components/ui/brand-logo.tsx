import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <Image src="/assets/logo1.png" alt="The Simbolo mascot" fill sizes="56px" className="object-cover" priority />
      </div>
      {!compact && (
        <div className="flex flex-col justify-center">
          <p className="whitespace-nowrap text-[1.55rem] font-extrabold leading-none tracking-[-0.02em] text-[var(--text-primary)]">
            The <span className="text-[var(--primary)]">Simbolo</span>
          </p>
        </div>
      )}
    </div>
  );
}
