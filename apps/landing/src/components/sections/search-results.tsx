"use client";

import { motion } from "framer-motion";
import { Search, Loader2, Sparkles, Star, ChevronRight, Briefcase, PlayCircle, ExternalLink, X, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ExpertModal } from "@/components/ui/expert-modal";
import { Expert, SearchResponse } from "@/types/search";

interface SearchResultsProps {
  query: string;
  onClear: () => void;
  onSearch: (query: string) => void;
}

export function SearchResults({ query, onClear, onSearch }: SearchResultsProps) {
  const [inputValue, setInputValue] = useState(query);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setIsSearching(true);
      setError(null);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const response = await fetch(`${API_BASE_URL}/ai/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        if (response.ok) {
          const json = await response.json();
          // The backend's global TransformInterceptor wraps every response in
          // { success, message, data } — unwrap it to get the actual SearchResponse.
          const data = json && typeof json === 'object' && 'success' in json && 'data' in json ? json.data : json;
          if (active) setSearchResponse(data);
        } else {
          console.error("Failed to fetch search results");
          if (active) setError("AI is currently unavailable. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        if (active) setError("AI is currently unavailable. Please try again later.");
      } finally {
        if (active) setIsSearching(false);
      }
    };
    
    if (query) {
      fetchResults();
    }
    
    return () => { active = false; };
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    } else if (e.key === "Escape") {
      onClear();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-6 sm:px-8 lg:px-10">
      <ExpertModal
        expert={selectedExpert}
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
      />

      <div className="mx-auto max-w-[1290px]">
        {/* Navigation & Search Header */}
        <div className="sticky top-[80px] z-10 mb-8 rounded-[20px] border border-white/[0.08] bg-[var(--surface)]/80 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
          <div className="mb-2 flex items-center gap-2 px-4 pt-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--muted)]">
            <button onClick={onClear} className="transition-colors hover:text-white">
              Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#4ADE80]">AI Search Results</span>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] bg-white/[0.035] px-4 transition duration-300 focus-within:bg-white/[0.055]">
            <Sparkles className="h-4 w-4 shrink-0 text-[#4ADE80]" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 w-full bg-transparent text-[0.9rem] font-medium text-[var(--text-primary)] outline-none placeholder:text-[#64748B]"
              placeholder="Refine your search..."
            />
            {inputValue && (
              <button onClick={onClear} className="rounded-full p-1 text-[#64748B] hover:bg-white/10 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onSearch(inputValue)}
              className="ml-2 flex h-8 items-center justify-center rounded-[10px] bg-[var(--primary)] px-4 text-xs font-bold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Search
            </button>
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6 h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-red-500/20" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-red-500 border-r-red-500" />
              <X className="absolute inset-0 m-auto h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Oops! Something went wrong</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{error}</p>
            <button onClick={() => onSearch(inputValue)} className="mt-6 rounded-full bg-[var(--primary)] px-6 py-2 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)]">
              Try Again
            </button>
          </div>
        ) : isSearching || !searchResponse ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6 h-20 w-20">
              <div className="absolute inset-0 animate-ping rounded-full bg-[var(--primary)]/20" />
              <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-[var(--primary)] border-r-[var(--primary)]" />
              <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-[var(--primary)] animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white">AI is analyzing your request...</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Matching you with the perfect experts and packages.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 lg:grid-cols-12"
          >
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* AI Summary */}
              <div className="relative overflow-hidden rounded-[24px] border border-[var(--primary)]/30 bg-[var(--surface)]/50 p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-md">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-[50px]" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4ADE80]">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Search Summary
                    </div>
                    <div className="text-sm font-bold text-[#4ADE80]">{searchResponse.matchPercentage}% Match</div>
                  </div>
                  <p className="mb-6 text-lg font-medium leading-relaxed text-white">
                    "{searchResponse.summary}"
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/packages">
                      <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[var(--primary)] px-6 text-sm font-bold text-white transition hover:scale-105 hover:shadow-[0_8px_16px_var(--primary-glow)]">
                        Hire Expert
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link href="/packages">
                      <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10">
                        View Package: {searchResponse.recommendedPackage}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Top Experts */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Top Recommended Experts</h3>
                  <span className="text-xs text-[var(--muted)]">Curated for your goals</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResponse.experts?.map((expert, idx) => (
                    <motion.div
                      key={expert.id || idx}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedExpert(expert)}
                      className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 transition-all ${
                        expert.isSimboloExpert
                          ? "border-[var(--primary)]/40 bg-[var(--primary)]/5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)]"
                          : "border-white/[0.08] bg-[var(--surface)]/50 hover:border-white/20 hover:bg-[var(--surface)]"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                          <Image src={expert.imageUrl} alt={expert.name} fill className="object-cover" />
                        </div>
                        {expert.isSimboloExpert && (
                          <div className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-[var(--primary)]">
                            Official
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-white">{expert.name}</h4>
                      <p className="mb-3 truncate text-xs text-[var(--muted)]">{expert.title}</p>
                      
                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          {expert.rating}
                        </div>
                        <div className="text-xs font-semibold text-white">${expert.hourlyPrice}/hr</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recommended Packages */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">Recommended Packages</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {["Growth", "Premium", "Enterprise"].map((pkg) => (
                    <div key={pkg} className="rounded-[20px] border border-white/[0.08] bg-[var(--surface)]/50 p-5 transition hover:border-[var(--primary)]/50">
                      <h4 className="mb-1 font-bold text-white">{pkg} Package</h4>
                      <p className="mb-4 text-xs text-[var(--muted)]">Perfect for scaling your business.</p>
                      <Link href="/packages">
                        <button className="w-full rounded-[10px] bg-white/5 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary)]">
                          View Details
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Suggestions */}
              <div className="rounded-[20px] border border-white/[0.08] bg-[var(--surface)]/50 p-5">
                <h3 className="mb-3 text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  AI Suggestions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchResponse.suggestions?.map((suggestion, idx) => (
                    <button
                      key={suggestion.id || idx}
                      onClick={() => {
                        setInputValue(suggestion.label);
                        onSearch(suggestion.label);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--primary)]/50 hover:text-white"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="rounded-[20px] border border-white/[0.08] bg-[var(--surface)]/50 p-5">
                <h3 className="mb-4 text-sm font-bold text-white">Relevant Reviews</h3>
                <div className="space-y-4">
                  {searchResponse.reviews?.map((review, idx) => (
                    <div key={review.id || idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image src={review.avatarUrl} alt={review.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{review.name}</div>
                          <div className="flex text-amber-400">
                            {[...Array(review.rating || 5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs italic text-[var(--muted)]">"{review.content}"</p>
                      <div className="mt-2 flex justify-between text-[0.65rem] text-white/40">
                        <span>{review.servicePurchased}</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
