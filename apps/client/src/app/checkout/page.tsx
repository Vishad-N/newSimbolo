"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { RazorpayCheckout } from "@/components/checkout/RazorpayCheckout";
import { mockApi } from "@/services/api";

// This is mock data for the packages. In a real app, this would come from a backend GET /packages API.
const packageData: Record<string, any> = {
  "seo-monthly": { name: "SEO Monthly Growth", price: 7999, description: "Ongoing monthly SEO strategy and execution." },
  "seo-basic": { name: "SEO Basic Plan", price: 5000, description: "Basic SEO package." },
  "seo-standard": { name: "SEO Standard Plan", price: 10000, description: "Standard SEO package." },
  "seo-premium": { name: "SEO Premium Plan", price: 20000, description: "Premium SEO package." },
  "seo-enterprise": { name: "SEO Enterprise Plan", price: 50000, description: "Enterprise SEO package." },
  "ads-starter": { name: "Google Ads Starter", price: 8000, description: "Google Ads setup and management." },
  "ads-growth": { name: "Google Ads Growth", price: 15000, description: "Advanced Google Ads management." },
  "ads-scale": { name: "Google Ads Scale", price: 30000, description: "High-budget Google Ads management." },
  "ads-premium": { name: "Google Ads Premium", price: 60000, description: "Enterprise Google Ads management." },
  "website-starter": { name: "Website Starter", price: 14999, description: "Up to 5 pages, mobile responsive, basic SEO." },
  "website-professional": { name: "Website Professional", price: 24999, description: "Up to 10 pages, custom UI/UX, advanced SEO." },
  "website-ecommerce": { name: "Website E-Commerce", price: 39999, description: "Unlimited products, payment gateway integration." },
  "ecommerce-starter": { name: "E-Commerce Starter", price: 19999, description: "Basic Shopify/WooCommerce setup." },
  "ecommerce-growth": { name: "E-Commerce Growth", price: 39999, description: "Custom theme modification, advanced SEO." },
  "ecommerce-premium": { name: "E-Commerce Premium", price: 79999, description: "Fully custom design, unlimited products." },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("package") || "custom";
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string; email: string; phone?: string; companyName?: string; billingAddress?: string; gstNumber?: string; stateCode?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gstError, setGstError] = useState("");

  useEffect(() => {
    // Fetch package details
    const pkg = packageData[packageId] || { 
      name: "Custom Service Package", 
      price: 15000, 
      description: "Customized digital marketing service plan." 
    };
    setSelectedPackage(pkg);

    // Fetch user profile from backend
    const fetchProfile = async () => {
      try {
        const data = await mockApi.profile.get();
        setUserProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          companyName: data.companyName || data.legalName || "",
          billingAddress: data.address || "",
          gstNumber: data.gst || "",
          stateCode: data.stateCode || ""
        });
      } catch (err: any) {
        if (err?.message?.includes("401")) {
          console.warn("Guest user: No profile found.");
        } else {
          console.error("Failed to fetch user profile", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [packageId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl text-center mt-12">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-heading font-bold text-white">Payment Successful!</h1>
        <p className="mb-8 text-gray-400">
          Thank you for your purchase. Your order for <strong>{selectedPackage.name}</strong> has been confirmed. 
          Our team will reach out to you shortly to begin onboarding.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-8 font-bold text-white transition hover:bg-[var(--primary-hover)]"
        >
          Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    );
  }

  const subtotal = selectedPackage.price;
  const gst = subtotal * 0.18; // 18% GST in India
  const total = subtotal + gst;

  const handleSaveProfileBeforeCheckout = async () => {
    try {
      if (userProfile) {
        await mockApi.profile.update({
          legalName: userProfile.companyName,
          gstNumber: userProfile.gstNumber,
          billingAddress: userProfile.billingAddress,
          stateCode: userProfile.stateCode
        });
      }
    } catch (err: any) {
      if (err?.message?.includes("401")) {
        console.warn("Guest user: Cannot update backend profile.");
      } else {
        console.error("Failed to update profile before checkout", err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
          <CreditCard className="text-[var(--primary)] h-8 w-8" />
          Secure Checkout
        </h1>
        <p className="text-gray-400 mt-2">Complete your purchase for {selectedPackage.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Payment Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              Billing Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">First Name</label>
                  <input 
                    type="text" 
                    value={userProfile?.firstName || ""} 
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, firstName: e.target.value } : { firstName: e.target.value, lastName: "", email: "" })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">Last Name</label>
                  <input 
                    type="text" 
                    value={userProfile?.lastName || ""} 
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, lastName: e.target.value } : { firstName: "", lastName: e.target.value, email: "" })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">Company Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Acme Inc." 
                    value={userProfile?.companyName || ""}
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, companyName: e.target.value } : { firstName: "", lastName: "", email: "", companyName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">GST Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="23XXXXX0000X1Z5" 
                    value={userProfile?.gstNumber || ""}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setUserProfile(prev => {
                        const newProfile = prev ? { ...prev, gstNumber: val } : { firstName: "", lastName: "", email: "", gstNumber: val };
                        if (val.length >= 2) {
                          const statePrefix = val.substring(0, 2);
                          if (!isNaN(Number(statePrefix))) {
                            newProfile.stateCode = statePrefix;
                          }
                        }
                        return newProfile;
                      });
                      if (gstError) setGstError("");
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)) {
                        setGstError("Please enter a valid 15-digit GST Number");
                      } else {
                        setGstError("");
                      }
                    }}
                    className={`w-full rounded-xl border bg-black/20 p-3 text-sm text-white focus:outline-none uppercase transition-colors ${gstError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[var(--primary)]'}`} 
                  />
                  {gstError && <p className="text-red-500 text-xs mt-1">{gstError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_100px] gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">Billing Address</label>
                  <textarea 
                    rows={2} 
                    value={userProfile?.billingAddress || ""}
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, billingAddress: e.target.value } : { firstName: "", lastName: "", email: "", billingAddress: e.target.value })}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">State Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 23" 
                    value={userProfile?.stateCode || ""}
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, stateCode: e.target.value } : { firstName: "", lastName: "", email: "", stateCode: e.target.value })}
                    className="w-full h-[62px] rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
             <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              Payment Method
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              All transactions are secure and encrypted. We use Razorpay to process your payments safely.
            </p>

            <RazorpayCheckout 
              amount={total} 
              packageName={selectedPackage.name} 
              packageId={packageId}
              profile={userProfile}
              onBeforePayment={handleSaveProfileBeforeCheckout}
              onSuccess={() => setIsSuccess(true)} 
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-6 backdrop-blur-md">
            <h3 className="mb-6 text-lg font-bold text-white">Order Summary</h3>
            
            <div className="mb-6 flex items-start gap-4 rounded-xl bg-black/20 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/20 text-[var(--primary)]">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white">{selectedPackage.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{selectedPackage.description}</p>
              </div>
            </div>

            <div className="space-y-3 border-b border-white/10 pb-6 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-medium text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>GST (18%)</span>
                <span className="font-medium text-white">₹{gst.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <span className="text-lg font-bold text-white">Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-[var(--primary)]">₹{total.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-gray-400 mt-1">Includes all applicable taxes</p>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs leading-relaxed">
                By completing this purchase, you agree to our Terms of Service and Billing Agreement. You can cancel your subscription at any time from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
