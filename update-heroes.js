const fs = require('fs');

const files = [
  'src/components/videoEditing/VideoEditingHero.tsx',
  'src/components/seo/SeoHero.tsx',
  'src/components/packages/PackageHero.tsx',
  'src/components/metaAds/MetaAdsHero.tsx',
  'src/components/graphicDesign/GraphicDesignHero.tsx',
  'src/components/googleAds/GoogleAdsHero.tsx',
  'src/components/affiliate/AffiliateHero.tsx'
];

files.forEach(file => {
  if(!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/<h1 className="([^"]*)font-black([^"]*tracking-normal)?([^"]*)">/g, '<h1 className="$1font-heading font-bold tracking-tight$3">');
  content = content.replace(/<h1 className="([^"]*)font-extrabold([^"]*tracking-normal)?([^"]*)">/g, '<h1 className="$1font-heading font-bold tracking-tight$3">');
  
  content = content.replace(/text-\[0\.84rem\] font-semibold text-white\/82/g, 'text-[0.84rem] font-medium text-white/82');
  
  content = content.replace(/bg-\[var\(--primary\)\] px-7 text-\[0\.92rem\] font-black text-white/g, 'bg-[var(--primary)] px-7 text-[0.92rem] font-heading font-semibold tracking-[0.2px] normal-case text-white');
  
  content = content.replace(/border-\[var\(--primary\)\]\/60 px-7 text-\[0\.92rem\] font-black text-white/g, 'border-[var(--primary)]/60 px-7 text-[0.92rem] font-heading font-medium text-white');
  
  content = content.replace(/bg-\[var\(--primary\)\] px-8 text-\[1rem\] font-extrabold/g, 'bg-[var(--primary)] px-8 text-[1rem] font-heading font-semibold tracking-[0.2px] normal-case');
  
  content = content.replace(/bg-\[var\(--primary\)\] px-8 text-\[0\.95rem\] font-black/g, 'bg-[var(--primary)] px-8 text-[0.95rem] font-heading font-semibold tracking-[0.2px] normal-case');
  
  content = content.replace(/border-\[var\(--primary\)\]\/60 px-8 text-\[0\.95rem\] font-black/g, 'border-[var(--primary)]/60 px-8 text-[0.95rem] font-heading font-medium');
  
  fs.writeFileSync(file, content);
});
console.log('Heroes updated successfully');
