"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { api, ManualClientPayload } from "@/services/api";
import { RefreshCw, UserPlus, Users } from "lucide-react";
import {
  normalizeEmail,
  sanitizeNameInput,
  validateOptionalGstNumber,
  validateOptionalPhone,
  validatePersonName,
} from "@/utils/validation";

interface PackageRecord {
  id: string;
  name: string;
  basePrice?: number;
  type?: string;
  service?: {
    name?: string;
  };
}

interface ClientRecord {
  id: string;
  status?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  subscriptions?: Array<{
    package?: {
      name?: string;
    };
  }>;
}

interface PaginatedResponse<T> {
  data: T[];
}

interface ManualClientResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  client: {
    id: string;
  };
  subscription: {
    id: string;
    subscriptionNumber: string;
  } | null;
}

const defaultForm: ManualClientPayload = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  countryCode: "+91",
  phone: "",
  packageId: "",
  interval: "MONTHLY",
  price: undefined,
  currency: "INR",
  billingAddress: "",
  gstNumber: "",
  timezone: "Asia/Kolkata",
  notes: "",
};

function getDataArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response;
  const envelope = response as { data?: T[]; items?: T[] } | null | undefined;
  if (Array.isArray(envelope?.data)) return envelope.data;
  if (Array.isArray(envelope?.items)) return envelope.items;
  return [];
}

function getRequestMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  if (error.message.includes("401")) {
    return "You are not authorized to view or manage client accounts. Please sign in with an admin API account or ask the technical team to configure admin API access.";
  }
  return error.message || fallback;
}

export default function UsersPage() {
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [form, setForm] = useState<ManualClientPayload>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);
  const [clientAccessMessage, setClientAccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === form.packageId),
    [form.packageId, packages],
  );

  const fetchData = async () => {
    setIsLoading(true);
    setPackageError(null);
    setClientAccessMessage(null);
    setSubmitError(null);

    // Neither call depends on the other's result — run them concurrently instead
    // of one round trip after the other, keeping each error isolated via
    // allSettled so one failing fetch doesn't block the other from rendering.
    const [packagesResult, clientsResult] = await Promise.allSettled([
      api.packages.getAll() as Promise<PackageRecord[] | PaginatedResponse<PackageRecord>>,
      api.clients.getAll() as Promise<ClientRecord[] | PaginatedResponse<ClientRecord>>,
    ]);

    if (packagesResult.status === "fulfilled") {
      setPackages(getDataArray(packagesResult.value));
    } else {
      setPackages([]);
      setPackageError(getRequestMessage(packagesResult.reason, "Failed to load packages"));
    }

    if (clientsResult.status === "fulfilled") {
      setClients(getDataArray(clientsResult.value));
    } else {
      setClients([]);
      setClientAccessMessage(getRequestMessage(clientsResult.reason, "Failed to load clients"));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateForm = <Key extends keyof ManualClientPayload>(key: Key, value: ManualClientPayload[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handlePackageChange = (packageId: string) => {
    const nextPackage = packages.find((item) => item.id === packageId);
    setForm((current) => ({
      ...current,
      packageId,
      price: nextPackage?.basePrice ?? undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    const validationError =
      validatePersonName(form.firstName, "First name") ||
      validatePersonName(form.lastName, "Last name") ||
      validateOptionalPhone(form.countryCode, form.phone) ||
      validateOptionalGstNumber(form.gstNumber);

    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    const payload: ManualClientPayload = {
      ...form,
      email: normalizeEmail(form.email),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      countryCode: form.phone ? form.countryCode : undefined,
      phone: form.phone || undefined,
      packageId: form.packageId || undefined,
      price: form.packageId ? Number(form.price) : undefined,
      billingAddress: form.billingAddress || undefined,
      gstNumber: form.gstNumber || undefined,
      notes: form.notes || undefined,
    };

    try {
      const created = (await api.clients.createManual(payload)) as ManualClientResponse;
      setSuccessMessage(
        created.subscription
          ? `Created ${created.user.email} and assigned ${selectedPackage?.name ?? "selected plan"}.`
          : `Created ${created.user.email} without a plan.`,
      );
      setForm(defaultForm);
      await fetchData();
    } catch (requestError) {
      setSubmitError(getRequestMessage(requestError, "Failed to create client"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400">Create client accounts manually and assign plans.</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass-card rounded-xl p-4">
          <span className="text-sm text-gray-400">Total Clients</span>
          <div className="mt-1 text-2xl font-bold text-white">{clients.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <span className="text-sm text-gray-400">Available Packages</span>
          <div className="mt-1 text-2xl font-bold text-primary">{packages.length}</div>
        </div>
      </div>

      {packageError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {packageError}
        </div>
      )}

      {clientAccessMessage && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          {clientAccessMessage}
        </div>
      )}

      {submitError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manual Client Creation</h2>
              <p className="text-sm text-gray-400">Creates an active client login and optional subscription.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">First Name</label>
              <input
                required
                value={form.firstName}
                onChange={(event) => updateForm("firstName", sanitizeNameInput(event.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Last Name</label>
              <input
                required
                value={form.lastName}
                onChange={(event) => updateForm("lastName", sanitizeNameInput(event.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value.trim())}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Phone</label>
              <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2">
                <input
                  aria-label="Country code"
                  type="tel"
                  inputMode="tel"
                  pattern="\+[1-9][0-9]{0,2}"
                  maxLength={4}
                  value={form.countryCode}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
                    updateForm("countryCode", digits ? `+${digits}` : "");
                  }}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
                  placeholder="+91"
                />
                <input
                  aria-label="10-digit phone number"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  minLength={10}
                  maxLength={10}
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                  placeholder="9876543210"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Temporary Password</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                placeholder="StrongPass@123"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Timezone</label>
              <input
                value={form.timezone}
                onChange={(event) => updateForm("timezone", event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-gray-400">Assign Package</label>
              <select
                value={form.packageId}
                onChange={(event) => handlePackageChange(event.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1F2E] px-4 py-2 text-white"
              >
                <option value="">No plan yet</option>
                {packages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.service?.name ? `- ${item.service.name}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Interval</label>
              <select
                value={form.interval}
                onChange={(event) =>
                  updateForm("interval", event.target.value as ManualClientPayload["interval"])
                }
                className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1F2E] px-4 py-2 text-white"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Price</label>
              <input
                disabled={!form.packageId}
                required={Boolean(form.packageId)}
                type="number"
                min="1"
                value={form.price ?? ""}
                onChange={(event) => updateForm("price", Number(event.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Currency</label>
              <input
                value={form.currency}
                onChange={(event) => updateForm("currency", event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">GST Number</label>
              <input
                value={form.gstNumber}
                onChange={(event) => updateForm("gstNumber", event.target.value.toUpperCase().slice(0, 15))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Billing Address</label>
              <textarea
                value={form.billingAddress}
                onChange={(event) => updateForm("billingAddress", event.target.value)}
                className="min-h-24 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Internal Notes</label>
              <textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                className="min-h-24 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>

        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-gray-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Recent Clients</h2>
              <p className="text-sm text-gray-400">Latest client profiles.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-sm text-gray-400">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="py-8 text-sm text-gray-400">No clients found.</div>
          ) : (
            <div className="space-y-3">
              {clients.slice(0, 8).map((client) => (
                <div key={client.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="font-medium text-white">
                    {client.user?.firstName} {client.user?.lastName}
                  </div>
                  <div className="text-xs text-gray-400">{client.user?.email}</div>
                  <div className="mt-2 text-xs text-primary">{client.status ?? "ACTIVE"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
