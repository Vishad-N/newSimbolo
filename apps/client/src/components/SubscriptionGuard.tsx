"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { mockApi } from "@/services/api";
import { Lock, CreditCard, ArrowRight, PackageOpen } from "lucide-react";

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Don't enforce lockdown on the checkout page itself
  const isCheckout = pathname?.includes("/checkout");
  
  useEffect(() => {
    if (isCheckout) {
      setIsLoading(false);
      return;
    }
    
    const checkSubscription = async () => {
      try {
        const profile = await mockApi.profile.get();
        if (profile?.clientId) {
          const sub = await mockApi.subscription.get(profile.clientId);
          
          if (!sub || sub.daysRemaining <= 0 || sub.billingStatus === 'PAST_DUE' || sub.billingStatus === 'CANCELED') {
            setIsLocked(true);
            setSubscription(sub);
          } else {
            setIsLocked(false);
          }
        } else {
          // No client profile, probably not setup yet, should lock
          setIsLocked(true);
        }
      } catch (err) {
        console.error("Failed to check subscription state", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSubscription();
  }, [isCheckout]);
  
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }
  
  if (isLocked && !isCheckout) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050816]/95 backdrop-blur-xl">
        <div className="relative mx-4 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-red-500/20 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <Lock className="h-10 w-10 text-red-500" />
            </div>
            
            <h2 className="mb-2 text-2xl font-heading font-bold text-white">Dashboard Locked</h2>
            <p className="mb-8 text-gray-400">
              {subscription 
                ? "Your previous subscription has expired. Renew your plan to regain access to all features, active projects, and reports."
                : "You don't have an active subscription yet. Purchase a plan to unlock the client dashboard."}
            </p>
            
            <div className="flex flex-col gap-4">
              {subscription?.packageId && (
                <button
                  onClick={() => router.push(`/checkout?package=${subscription.packageId}&repeat=true`)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-4 font-bold text-white transition-all hover:bg-[var(--primary-hover)] shadow-[0_0_20px_var(--primary-glow)] hover:scale-[1.02] active:scale-95"
                >
                  <CreditCard className="h-5 w-5" />
                  Renew {subscription.currentPlan}
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
              
              <button
                onClick={() => {
                  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'https://simbolo.co';
                  window.location.href = `${landingUrl}/packages`;
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10 ${!subscription?.packageId ? 'bg-[var(--primary)] border-transparent hover:bg-[var(--primary-hover)] shadow-[0_0_20px_var(--primary-glow)] hover:scale-[1.02] active:scale-95' : ''}`}
              >
                <PackageOpen className="h-5 w-5" />
                Explore Other Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
