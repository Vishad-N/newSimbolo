"use client";

import { useEffect, useState } from "react";
import { Settings, Shield, Bell } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { clientApi } from "@/services/api";
import { cn } from "@/utils/utils";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";
import { TwoFactorModal } from "@/components/settings/TwoFactorModal";

function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "w-12 h-6 rounded-full relative transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        checked ? "bg-primary" : "bg-white/10"
      )}
    >
      <div className={cn(
        "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
        checked ? "right-1" : "left-1"
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const [emailOrderUpdates, setEmailOrderUpdates] = useState(true);
  const [smsUrgentAlerts, setSmsUrgentAlerts] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savingField, setSavingField] = useState<"email" | "sms" | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [twoFactorModalMode, setTwoFactorModalMode] = useState<"enable" | "disable" | null>(null);

  useEffect(() => {
    clientApi.notifications.getPreferences()
      .then((prefs: any) => {
        setEmailOrderUpdates(prefs?.emailOrderUpdates ?? true);
        setSmsUrgentAlerts(prefs?.smsUrgentAlerts ?? false);
      })
      .catch(console.error)
      .finally(() => setIsLoaded(true));

    clientApi.profile.get()
      .then((profile: any) => setTwoFactorEnabled(!!profile?.twoFactorEnabled))
      .catch(console.error);
  }, []);

  const toggleEmail = async () => {
    const next = !emailOrderUpdates;
    setEmailOrderUpdates(next);
    setSavingField("email");
    try {
      await clientApi.notifications.updatePreferences({ emailOrderUpdates: next });
    } catch (error) {
      console.error("Failed to update email preference:", error);
      setEmailOrderUpdates(!next);
    } finally {
      setSavingField(null);
    }
  };

  const toggleSms = async () => {
    const next = !smsUrgentAlerts;
    setSmsUrgentAlerts(next);
    setSavingField("sms");
    try {
      await clientApi.notifications.updatePreferences({ smsUrgentAlerts: next });
    } catch (error) {
      console.error("Failed to update SMS preference:", error);
      setSmsUrgentAlerts(!next);
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Workspace Settings
        </h1>
        <p className="text-sm text-gray-400">Configure your preferences and security settings.</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" /> Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">Email Notifications</div>
                <div className="text-sm text-gray-400">Receive an email when an invoice or report is generated.</div>
              </div>
              <Toggle checked={emailOrderUpdates} disabled={!isLoaded || savingField === "email"} onChange={toggleEmail} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">SMS Alerts</div>
                <div className="text-sm text-gray-400">Receive critical alerts (like payment failures) via SMS.</div>
              </div>
              <Toggle checked={smsUrgentAlerts} disabled={!isLoaded || savingField === "sms"} onChange={toggleSms} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" /> Security
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">Password</div>
                <div className="text-sm text-gray-400">Change the password used to sign in.</div>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
              >
                Change Password
              </button>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div>
                <div className="font-medium text-white">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400">
                  {twoFactorEnabled ? "Enabled — an authenticator code is required at sign-in." : "Add an extra layer of security to your account."}
                </div>
              </div>
              {twoFactorEnabled ? (
                <button
                  onClick={() => setTwoFactorModalMode("disable")}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-medium rounded-lg transition-colors border border-red-500/20"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  onClick={() => setTwoFactorModalMode("enable")}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors border border-primary/20"
                >
                  Enable 2FA
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
      <TwoFactorModal
        isOpen={twoFactorModalMode !== null}
        mode={twoFactorModalMode || "enable"}
        onClose={() => setTwoFactorModalMode(null)}
        onChanged={setTwoFactorEnabled}
      />
    </div>
  );
}
