"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle2, Loader2, Copy, ShieldCheck } from "lucide-react";
import { clientApi } from "@/services/api";

interface TwoFactorModalProps {
  isOpen: boolean;
  mode: "enable" | "disable";
  onClose: () => void;
  onChanged: (enabled: boolean) => void;
}

export function TwoFactorModal({ isOpen, mode, onClose, onChanged }: TwoFactorModalProps) {
  const [step, setStep] = useState<"loading" | "scan" | "backup-codes" | "disable">("loading");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setCode("");
    setPassword("");

    if (mode === "disable") {
      setStep("disable");
      return;
    }

    setStep("loading");
    clientApi.security.setupTwoFactor()
      .then((data: any) => {
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setSecret(data.secret);
        setStep("scan");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to start 2FA setup.");
        setStep("scan");
      });
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await clientApi.security.enableTwoFactor(code);
      setBackupCodes(result.backupCodes || []);
      setStep("backup-codes");
      onChanged(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await clientApi.security.disableTwoFactor(password);
      onChanged(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface/90 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {mode === "enable" ? "Enable Two-Factor Authentication" : "Disable Two-Factor Authentication"}
          </h2>
          <button onClick={handleClose} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center py-8 gap-3 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              Preparing your authenticator setup...
            </div>
          )}

          {step === "scan" && (
            <form onSubmit={handleEnable} className="space-y-4">
              <p className="text-sm text-gray-400">
                Scan this QR code with Google Authenticator, Authy, or any TOTP app, then enter the 6-digit code it shows.
              </p>
              {qrCodeDataUrl && (
                <div className="flex justify-center">
                  <img src={qrCodeDataUrl} alt="2FA QR Code" className="rounded-lg border border-white/10 bg-white p-2 w-48 h-48" />
                </div>
              )}
              {secret && (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-black/20 border border-white/10 p-3">
                  <code className="text-xs text-gray-300 break-all">{secret}</code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(secret)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors shrink-0"
                    title="Copy secret"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">6-Digit Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-center text-lg tracking-[0.5em] text-white focus:border-primary focus:outline-none"
                  placeholder="000000"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-5 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || code.length !== 6} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify & Enable
                </button>
              </div>
            </form>
          )}

          {step === "backup-codes" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Two-factor authentication is now enabled.</span>
              </div>
              <p className="text-sm text-gray-400">
                Save these backup codes somewhere safe. Each one can be used once to sign in if you lose access to your authenticator app. They won't be shown again.
              </p>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-black/20 border border-white/10 p-4">
                {backupCodes.map((c) => (
                  <code key={c} className="text-sm text-gray-200 text-center">{c}</code>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(backupCodes.join("\n"))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors mr-auto"
                >
                  <Copy className="w-4 h-4" /> Copy Codes
                </button>
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors">
                  Done
                </button>
              </div>
            </div>
          )}

          {step === "disable" && (
            <form onSubmit={handleDisable} className="space-y-4">
              <p className="text-sm text-gray-400">Enter your current password to turn off two-factor authentication.</p>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Current Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-5 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Disable 2FA
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
