"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { mockApi } from "@/services/api";

interface RazorpayCheckoutProps {
  amount: number;
  packageName: string;
  packageId: string;
  profile?: { firstName: string; lastName: string; email: string; phone?: string; companyName?: string; billingAddress?: string; gstNumber?: string; stateCode?: string } | null;
  onBeforePayment?: () => Promise<void>;
  onSuccess: () => void;
}

export function RazorpayCheckout({ amount, packageName, packageId, profile, onBeforePayment, onSuccess }: RazorpayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    const mockKey = "rzp_test_mock_key_12345";
    const actualKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || mockKey;

    try {
      if (onBeforePayment) {
        await onBeforePayment();
      }

      // If we are using the mock key, don't even try to load Razorpay because it will fail with "Invalid Key"
      if (actualKey === mockKey) {
        setTimeout(() => {
          console.log("Simulating mock payment success because no real Razorpay key was provided");
          onSuccess();
        }, 1500);
        return;
      }

      const res = await loadRazorpayScript();
      
      if (!res) {
        setError("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // Initialize Razorpay options
      const options = {
        key: actualKey, 
        amount: amount * 100, // Amount is in currency subunits (paise)
        currency: "INR",
        name: "The Simbolo",
        description: `Payment for ${packageName}`,
        image: "https://thesimbolo.com/logo.png",
        // Removed fake order_id to prevent Razorpay SDK from throwing an error. 
        // In production, fetch a real order_id from POST /payments/create-order
        handler: async function (response: any) {
          // Success handler
          try {
            // In a real implementation, you would:
            // Call POST /payments/verify with response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
            
            // Log for debugging
            console.log("Payment Successful", response);
            
            onSuccess();
          } catch (err) {
            console.error("Payment verification failed", err);
            setError("Payment verification failed on the server.");
          }
        },
        prefill: {
          name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : "",
          email: profile?.email || "",
          contact: profile?.phone || "",
        },
        theme: {
          color: "#2DD4BF", // var(--primary)
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on("payment.failed", function (response: any) {
        console.error("Payment failed", response.error);
        setError(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      
      paymentObject.open();
      
      // Reset processing state after modal opens
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred during payment initialization.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--primary)] p-4 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_8px_20px_var(--primary-glow)] hover:shadow-[0_12px_24px_var(--primary-glow)]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Initializing Secure Checkout...
          </>
        ) : (
          <>
            Pay ₹{amount.toLocaleString('en-IN')} with Razorpay
          </>
        )}
      </button>
      
      <div className="flex items-center justify-center gap-2 mt-2 opacity-50">
        <span className="text-[10px] font-medium text-white uppercase tracking-wider">Secured By Razorpay</span>
      </div>
    </div>
  );
}
