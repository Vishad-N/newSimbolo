"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandSection } from "@/components/sections/brand-section";
import { FeaturedServices } from "@/components/sections/featured-services";
import { Hero } from "@/components/sections/hero";
import { InfoCards } from "@/components/sections/info-cards";
import { SearchResults } from "@/components/sections/search-results";

interface LandingPageProps {
  heroData?: { title?: string; highlightedText?: string; subtitle?: string };
  whyChooseUs?: { id: string; title: string; iconName: string }[];
  testimonial?: { quote: string; name: string; role: string; rating: number };
}

export function LandingPage({ heroData, whyChooseUs, testimonial }: LandingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");

  const [searchQuery, setSearchQuery] = useState(queryParam || "");
  const [hasSearched, setHasSearched] = useState(!!queryParam);

  useEffect(() => {
    if (queryParam) {
      if (queryParam !== searchQuery || !hasSearched) {
        setSearchQuery(queryParam);
        setHasSearched(true);
      }
    } else {
      setSearchQuery("");
      setHasSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      handleClearSearch();
      return;
    }
    router.push(`/?q=${encodeURIComponent(query)}`, { scroll: false });
  };

  const handleClearSearch = () => {
    router.push("/", { scroll: false });
  };

  return (
    <>
      {!hasSearched ? (
        <>
          <Hero onSearch={handleSearch} data={heroData} />
          <FeaturedServices />
          <InfoCards whyChooseUs={whyChooseUs} testimonial={testimonial} />
          <BrandSection />
        </>
      ) : (
        <SearchResults 
          query={searchQuery}
          onClear={handleClearSearch}
          onSearch={handleSearch}
        />
      )}
    </>
  );
}
