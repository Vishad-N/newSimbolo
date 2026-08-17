"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/api";
import { User, Save, Building, Mail, Phone, MapPin, Hash, Map } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { sanitizeStateCodeInput, validateOptionalGstNumber, validatePhone } from "@/utils/validation";

interface ClientProfileForm {
  id?: string;
  clientId?: string;
  firstName: string;
  lastName: string;
  companyName: string;
  legalName: string;
  gst: string;
  email: string;
  countryCode: string;
  phone: string;
  address: string;
  state: string;
  stateCode: string;
  logo: string;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ClientProfileForm | null>(null);
  const [formData, setFormData] = useState<ClientProfileForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [gstError, setGstError] = useState("");

  useEffect(() => {
    mockApi.profile.get().then(data => {
      setProfile(data);
      setFormData(data);
    });
  }, []);

  if (!profile || !formData) return <div className="text-white animate-pulse p-4">Loading profile...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }
    if (name === 'countryCode') {
      const digits = value.replace(/\D/g, "").slice(0, 3);
      newValue = digits ? `+${digits}` : "";
    }
    if (name === 'gst') {
      newValue = value.toUpperCase().slice(0, 15);
      if (gstError) setGstError("");
    }
    if (name === 'stateCode') {
      newValue = sanitizeStateCodeInput(value);
    }
    
    setFormData((previous) => {
      if (!previous) return previous;
      const nextData = { ...previous, [name]: newValue };
      if (name === 'gst' && newValue.length >= 2) {
        const statePrefix = newValue.substring(0, 2);
        if (!isNaN(Number(statePrefix))) {
          nextData.stateCode = statePrefix;
        }
      }
      return nextData;
    });
  };

  const handleSave = async () => {
    const phoneError = validatePhone(formData.countryCode, formData.phone);
    const gstValidationError = validateOptionalGstNumber(formData.gst);
    if (phoneError || gstValidationError) {
      setSaveMessage(`Failed to update profile: ${phoneError || gstValidationError}`);
      return;
    }
    setIsSaving(true);
    setSaveMessage("");
    try {
      // Assuming mockApi maps formData back to the backend
      // Backend clientProfile DTO might need structured data, 
      // but for frontend we pass the updated properties.
      await mockApi.profile.update({
        gstNumber: formData.gst,
        countryCode: formData.phone ? formData.countryCode : undefined,
        phone: formData.phone || undefined,
        billingAddress: formData.address,
        stateCode: formData.stateCode || undefined,
      });
      setSaveMessage("Profile updated successfully");
    } catch (error) {
      setSaveMessage("Failed to update profile: " + getErrorMessage(error));
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Company Profile
          </h1>
          <p className="text-sm text-gray-400">Manage your company information, contact details, and tax settings.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && <span className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{saveMessage}</span>}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
              {profile.logo && <Image src={profile.logo} alt="Company Logo" width={128} height={128} className="w-full h-full object-cover" />}
            </div>
            <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Change Logo
            </button>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Building className="w-4 h-4" /> Brand Name</label>
                <input name="companyName" type="text" value={formData.companyName} onChange={handleChange} disabled className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed outline-none" title="Contact support to change brand name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Building className="w-4 h-4" /> Legal Entity Name</label>
                <input name="legalName" type="text" value={formData.legalName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Primary Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} disabled className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</label>
                <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2">
                  <input name="countryCode" aria-label="Country code" type="tel" inputMode="tel" pattern="\+[1-9][0-9]{0,2}" maxLength={4} value={formData.countryCode || "+91"} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
                  <input name="phone" aria-label="10-digit phone number" type="tel" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} value={formData.phone} onChange={handleChange} placeholder="9876543210" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
                </div>
                <p className="text-xs text-gray-500">Enter exactly 10 digits; the country code is separate.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Billing Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none resize-none"></textarea>
              </div>

              {/* GST Specific fields */}
              <div className="space-y-2 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                <h3 className="text-lg font-heading font-medium text-white mb-2">Tax & GST Information</h3>
                <p className="text-xs text-gray-400 mb-4">Provide these details to receive valid B2B tax invoices.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">GST Number</label>
                <input 
                  name="gst" 
                  type="text" 
                  value={formData.gst || ""} 
                  onChange={handleChange} 
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)) {
                      setGstError("Please enter a valid 15-digit GST Number");
                    } else {
                      setGstError("");
                    }
                  }}
                  placeholder="e.g. 23XXXXX0000X1Z5" 
                  className={`w-full bg-black/40 border rounded-lg px-4 py-2.5 text-white outline-none uppercase transition-all ${gstError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'}`} 
                />
                {gstError && <p className="text-red-500 text-xs mt-1">{gstError}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Map className="w-4 h-4" /> State</label>
                <input name="state" type="text" value={formData.state} onChange={handleChange} placeholder="e.g. Madhya Pradesh" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Hash className="w-4 h-4" /> State Code</label>
                <input name="stateCode" type="text" inputMode="numeric" maxLength={2} value={formData.stateCode} onChange={handleChange} placeholder="e.g. 23" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
