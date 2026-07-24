"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { mockApi } from "@/services/api";
import { cn } from "@/utils/utils";

export function StickyRenewCard() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    mockApi.subscription.get().then(setSubscription);
  }, []);

  if (!subscription || !isVisible) return null;
  
  if (subscription.daysRemaining > 30 && subscription.billingStatus === "Active") {
    return null; // Don't show if more than 30 days remaining and active
  }

  const isExpired = subscription.daysRemaining <= 0 || subscription.billingStatus !== "Active";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-500 fade-in">
      <div className={cn(
        "bg-surface/90 backdrop-blur-xl border rounded-2xl shadow-2xl p-5 max-w-sm flex flex-col relative",
        isExpired ? "border-red-500/50" : "border-yellow-500/50"
      )}>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-3 pr-4">
          <div className={cn(
            "p-2 rounded-lg flex-shrink-0",
            isExpired ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
          )}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-white text-sm">
              {isExpired ? "Subscription Expired" : "Subscription Expiring Soon"}
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              {isExpired 
                ? "Your services have been paused. Renew now to continue receiving support."
                : `Your ${subscription.currentPlan} plan expires in ${subscription.daysRemaining} days. Renew now to avoid interruption.`
              }
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button 
            onClick={async () => {
              try {
                await mockApi.subscription.renew();
                alert("Renewed successfully! (Mock)");
                setIsVisible(false);
              } catch (error) {
                console.error("Renewal failed", error);
              }
            }}
            className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors shadow-lg",
            isExpired 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
              : "bg-yellow-500 hover:bg-yellow-600 text-black shadow-yellow-500/20"
          )}>
            <RefreshCw className="w-3 h-3" /> Renew Now
          </button>
          <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium rounded-lg transition-colors">
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
