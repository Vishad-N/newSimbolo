import { Card } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { UsageMeter } from "@/components/ui/UsageMeter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SubscriptionCardProps {
  subscription: any;
  compact?: boolean;
}

export function SubscriptionCard({ subscription, compact = false }: SubscriptionCardProps) {
  if (!subscription) return null;

  return (
    <Card className="flex flex-col h-full border-primary/20 bg-gradient-to-b from-surface/60 to-surface/90 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Current Plan</div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-heading font-bold text-white">{subscription.currentPlan}</h2>
            <PlanBadge planName={subscription.currentPlan} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-1">Valid Until</div>
          <div className="text-sm font-medium text-white">{subscription.renewalDate}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">Days Remaining</div>
          <div className={`text-lg font-bold ${subscription.daysRemaining <= 30 ? 'text-red-400' : 'text-primary'}`}>
            {subscription.daysRemaining} Days
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <h3 className="text-sm font-semibold text-white">Resource Usage</h3>
        <div className="space-y-4">
          {Object.values(subscription.limits).map((limit: any, i: number) => (
            <UsageMeter key={i} name={limit.name} used={limit.used} max={limit.max} />
          ))}
        </div>
      </div>

      {!compact && (
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold text-white">Included Features</h3>
          <ul className="space-y-2">
            {subscription.features.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-white/10 flex gap-3">
        <Link 
          href="/subscription" 
          className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
        >
          View Full Plan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
}
