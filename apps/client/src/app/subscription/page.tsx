"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/api";
import { SubscriptionCard } from "@/components/ui/SubscriptionCard";
import { UpgradeCard } from "@/components/ui/UpgradeCard";
import { Card } from "@/components/ui/Card";
import { Crown, Download, CreditCard, ShieldCheck } from "lucide-react";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    mockApi.subscription.get().then(setSubscription);
  }, []);

  if (!subscription) return <div className="text-white animate-pulse p-4">Loading subscription...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            My Subscription
          </h1>
          <p className="text-sm text-gray-400">Manage your active plans, usage limits, and billing.</p>
        </div>
      </div>

      <UpgradeCard subscription={subscription} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SubscriptionCard subscription={subscription} compact={false} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4">Billing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Purchase Date</div>
                <div className="text-sm font-medium text-white">{subscription.purchaseDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Next Billing Date</div>
                <div className="text-sm font-medium text-white">{subscription.renewalDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Payment Status</div>
                <div className="text-sm font-medium text-green-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> {subscription.paymentStatus}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Auto Renewal</div>
                <div className="text-sm font-medium text-white">
                  {subscription.autoRenew ? "Enabled" : "Disabled"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <button 
                onClick={async () => {
                  try {
                    await mockApi.subscription.renew();
                    alert("Renewed successfully! (Mock)");
                  } catch (error) {
                    console.error("Renewal failed", error);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
              >
                Renew Plan
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                <CreditCard className="w-4 h-4" /> Update Payment Method
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                <Download className="w-4 h-4" /> Download Latest Invoice
              </button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4">Account Support</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-black/40 border border-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">{subscription.supportLevel}</div>
                <div className="text-sm text-gray-400">Dedicated Account Manager: {subscription.accountManager}</div>
              </div>
              <button className="mt-3 sm:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                Contact Manager
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
