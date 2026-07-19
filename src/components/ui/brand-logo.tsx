import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <Image src="/assets/logo1.png" alt="The Simbolo mascot" fill sizes="56px" className="object-cover" priority />
      </div>
      {!compact && (
        <div className="leading-none">
          <p className="text-[1.55rem] font-extrabold tracking-[-0.02em] text-white">
            The <span className="text-[#F8FAFC]">Simbolo</span>
          </p>
          <p className="mt-1 text-[0.67rem] font-semibold uppercase tracking-[0.03em] text-white">
            Digital Marketing Agency
          </p>
        </div>
      )}
    </div>
  );
}
