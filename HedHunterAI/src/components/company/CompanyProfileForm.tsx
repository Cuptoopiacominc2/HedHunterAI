"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MeritPledgeCheckbox } from "./MeritPledgeCheckbox";
import { useRouter } from "next/navigation";

const INDUSTRIES = [
  "Accounting & Tax Services",
  "Aerospace & Defense",
  "Aerospace Engineering",
  "Agriculture",
  "Architecture & Engineering",
  "Artificial Intelligence & Machine Learning",
  "Automotive",
  "Biotechnology",
  "Childcare & Elder Care Services",
  "Cloud Computing",
  "Construction",
  "Cybersecurity",
  "Data Analytics & Business Intelligence",
  "E-Commerce",
  "Education & Training",
  "Electric Vehicles (EVs)",
  "Energy & Utilities",
  "Environmental Services",
  "Film & Television Production",
  "Financial Services & Banking",
  "Fishing & Aquaculture",
  "Forestry & Logging",
  "Gaming & Esports",
  "Government & Public Administration",
  "Healthcare & Hospitals",
  "Healthcare Specialists",
  "Healthcare Technology",
  "Hospitality & Food Services",
  "Hospitality & Tourism",
  "Human Resources & Staffing",
  "Information Technology (IT)",
  "Insurance",
  "Investment Banking",
  "Legal Services",
  "Manufacturing",
  "Marketing & Advertising",
  "Media & Entertainment",
  "Medical Devices",
  "Mining & Extraction",
  "Music & Recording Industry",
  "Nonprofit Organizations",
  "Oil & Gas",
  "Pharmaceuticals",
  "Private Equity",
  "Professional & Business Services",
  "Public Relations",
  "Real Estate",
  "Renewable Energy",
  "Restaurants & Food Service",
  "Retail Trade",
  "Robotics & Automation",
  "Scientific Research & Development",
  "Security & Protective Services",
  "Social Services",
  "Software Development",
  "Sports & Recreation",
  "Telecommunications",
  "Transportation & Logistics",
  "Transportation & Warehousing",
  "Warehousing & Distribution",
  "Waste Management & Recycling",
];
const REVENUE     = ["<$1M","$1M–$10M","$10M–$100M",">$100M","Prefer not to say"];
const TITLES      = ["Owner","Manager","Supervisor","Human Resource Staff"];

const SELECT_CLS = "mt-1.5 w-full bg-[#f5f7fa] border border-black/[.08] rounded-[10px] px-3 py-2.5 text-sm text-[#0f172a] outline-none focus:border-[#3ce8ff]/50";

interface CompanyProfileFormProps {
  initialData?: {
    name?: string; industry?: string; website?: string;
    contactPerson?: string; contactTitle?: string;
    phone?: string;
    city?: string; state?: string; county?: string; zipCode?: string;
    annualRevenue?: string; meritPledgeSigned?: boolean;
  };
}

export function CompanyProfileForm({ initialData }: CompanyProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:             initialData?.name             ?? "",
    industry:         initialData?.industry         ?? "",
    website:          initialData?.website          ?? "",
    contactPerson:    initialData?.contactPerson    ?? "",
    contactTitle:     initialData?.contactTitle     ?? "",
    phone:            initialData?.phone            ?? "",
    city:             initialData?.city             ?? "",
    state:            initialData?.state            ?? "",
    county:           initialData?.county           ?? "",
    zipCode:          initialData?.zipCode          ?? "",
    annualRevenue:    initialData?.annualRevenue    ?? "",
    meritPledgeSigned: initialData?.meritPledgeSigned ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);
  const [saved,  setSaved]  = useState(false);

  const set = (k: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSave() {
    if (!form.meritPledgeSigned) {
      setError("You must sign the Merit Based Hiring Pledge to save your profile.");
      return;
    }
    setSaving(true); setError(null); setSaved(false);
    try {
      const res = await fetch("/api/company/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-lg">
      <Input label="Company name" value={form.name} onChange={set("name")} required />

      {/* Industry */}
      <div>
        <label className="font-mono text-[10.5px] tracking-[.16em] uppercase" style={{ color: "#64748b" }}>Industry</label>
        <select value={form.industry} onChange={set("industry")} className={SELECT_CLS}>
          <option value="">Select industry</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      <Input label="Website (optional)" type="url" value={form.website} onChange={set("website")} placeholder="https://" />

      {/* Contact person + title */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Contact name" value={form.contactPerson} onChange={set("contactPerson")} required />
        <div>
          <label className="font-mono text-[10.5px] tracking-[.16em] uppercase" style={{ color: "#64748b" }}>Title</label>
          <select value={form.contactTitle} onChange={set("contactTitle")} className={SELECT_CLS}>
            <option value="">Select title</option>
            {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <Input label="Phone" type="tel" value={form.phone} onChange={set("phone")} required />

      {/* Address — separate fields */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[.16em] uppercase mb-3" style={{ color: "#64748b" }}>Address</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={set("city")} required />
            <Input label="State / Province" value={form.state} onChange={set("state")} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="County" value={form.county} onChange={set("county")} />
            <Input label="Zip / Postal code" value={form.zipCode} onChange={set("zipCode")} required />
          </div>
        </div>
      </div>

      {/* Annual revenue */}
      <div>
        <label className="font-mono text-[10.5px] tracking-[.16em] uppercase" style={{ color: "#64748b" }}>Annual revenue</label>
        <select value={form.annualRevenue} onChange={set("annualRevenue")} className={SELECT_CLS}>
          <option value="">Select range</option>
          {REVENUE.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <MeritPledgeCheckbox
        checked={form.meritPledgeSigned}
        onChange={v => setForm(p => ({ ...p, meritPledgeSigned: v }))}
      />

      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}

      <Button variant="accent" loading={saving} onClick={handleSave} fullWidth>
        {saved ? "Saved ✓" : "Save profile"}
      </Button>
    </div>
  );
}
