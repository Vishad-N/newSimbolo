import { brands } from "@/data/landing";

export function BrandSection() {
  return (
    <section className="mx-auto max-w-[1040px] px-4 py-5 text-center sm:px-8">
      <h2 className="mb-4 text-[1.05rem] font-extrabold text-white">Trusted by 1,000+ Businesses & Brands</h2>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {brands.map((brand) => (
          <span key={brand} className="text-[1.45rem] font-extrabold leading-none text-white/55 grayscale transition hover:text-white/80">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
