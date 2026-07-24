import { Card } from "@/components/ui/Card";
import { ArrowUpCircle, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { mockApi } from "@/services/api";

interface UpgradeCardProps {
  subscription: any;
}

export function UpgradeCard({ subscription }: UpgradeCardProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!subscription || subscription.rank >= subscription.highestRank) {
    return null; // Do not show if already at highest plan
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await mockApi.subscription.upgrade();
      alert("Upgraded successfully! (Mock)");
    } catch (error) {
      console.error("Upgrade failed", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Card className="border-secondary/30 bg-gradient-to-tr from-surface to-secondary/10 relative overflow-hidden group">
      {/* Glow effect on hover */}
      <div className="absolute top-0 right-0 w-full h-full bg-secondary/0 group-hover:bg-secondary/10 transition-colors duration-500 blur-[50px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary/30 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-heading font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
            Upgrade Your Plan
          </h3>
          <p className="text-sm text-gray-300 mb-4 max-w-lg">
            Unlock additional services, priority support, advanced reports, a dedicated manager, and higher usage limits by upgrading to the <span className="font-semibold text-secondary">{subscription.highestPlan}</span> plan.
          </p>
        </div>

        <button 
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/80 text-black font-semibold rounded-xl transition-colors shadow-[0_0_15px_rgba(45,212,191,0.4)] flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpCircle className="w-5 h-5" />}
          {isUpgrading ? "Upgrading..." : "Upgrade Now"}
        </button>
      </div>
    </Card>
  );
}
