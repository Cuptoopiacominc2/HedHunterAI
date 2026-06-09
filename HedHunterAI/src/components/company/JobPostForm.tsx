"use client";
import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const SELECT_CLS = "mt-1.5 w-full bg-[#f5f7fa] border border-black/[.08] rounded-[10px] px-3 py-2.5 text-sm text-[#0f172a] outline-none focus:border-[#3ce8ff]/50";

const COUNTRIES = ["United States","Canada","United Kingdom","Australia","Nigeria","India","Germany","France","Other"];

function formatSalary(raw: string): string {
  const n = raw.replace(/,/g, "").replace(/[^0-9]/g, "");
  if (!n) return "";
  return Number(n).toLocaleString("en-US");
}

function parseSalary(formatted: string): number | undefined {
  const n = parseInt(formatted.replace(/,/g, ""), 10);
  return isNaN(n) ? undefined : n;
}

interface JobPostFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function JobPostForm({ initialData, onSubmit, submitLabel = "Create job post" }: JobPostFormProps) {
  const [form, setForm] = useState({
    title:                    (initialData?.title                    as string)  ?? "",
    description:              (initialData?.description              as string)  ?? "",
    requiredQualifications:   (initialData?.requiredQualifications   as string)  ?? "",
    preferredQualifications:  (initialData?.preferredQualifications  as string)  ?? "",
    country:                  (initialData?.country                  as string)  ?? "",
    state:                    (initialData?.state                    as string)  ?? "",
    county:                   (initialData?.county                   as string)  ?? "",
    city:                     (initialData?.city                     as string)  ?? "",
    zipCode:                  (initialData?.zipCode                  as string)  ?? "",
    isRemote:                 (initialData?.isRemote                 as boolean) ?? false,
    isHybrid:                 (initialData?.isHybrid                 as boolean) ?? false,
    isOffice:                 (initialData?.isOffice                 as boolean) ?? false,
    isOnLocation:             (initialData?.isOnLocation             as boolean) ?? false,
    salaryMin:                (initialData?.salaryMin  != null ? String(initialData.salaryMin)  : ""),
    salaryMax:                (initialData?.salaryMax  != null ? String(initialData.salaryMax)  : ""),
    openPositions:            (initialData?.openPositions            as number)  ?? 1,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const cost = form.openPositions * 50;
  const set  = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  function handleSalaryChange(field: "salaryMin" | "salaryMax") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(p => ({ ...p, [field]: formatSalary(e.target.value) }));
    };
  }

  async function handleSubmit() {
    setSaving(true); setError(null);
    try {
      await onSubmit({
        ...form,
        salaryMin: parseSalary(form.salaryMin),
        salaryMax: parseSalary(form.salaryMax),
        openPositions: Number(form.openPositions),
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <Input label="Job title" value={form.title} onChange={set("title")} required />
      <Textarea label="Job description" value={form.description} onChange={set("description")} rows={5} required />
      <Textarea label="Required qualifications" value={form.requiredQualifications} onChange={set("requiredQualifications")} rows={4} required />
      <Textarea label="Preferred qualifications (optional)" value={form.preferredQualifications} onChange={set("preferredQualifications")} rows={3} />

      {/* Structured location */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[.16em] uppercase mb-3" style={{ color: "#64748b" }}>Job location</p>
        <div className="space-y-3">
          <div>
            <label className="font-mono text-[10.5px] tracking-[.16em] uppercase" style={{ color: "#64748b" }}>Country</label>
            <select value={form.country} onChange={set("country")} className={SELECT_CLS}>
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="State / Province" value={form.state} onChange={set("state")} />
            <Input label="County" value={form.county} onChange={set("county")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={set("city")} />
            <Input label="Zip / Postal code" value={form.zipCode} onChange={set("zipCode")} />
          </div>
        </div>
      </div>

      {/* Work type */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[.16em] uppercase mb-2" style={{ color: "#64748b" }}>Work type</p>
        <div className="flex gap-6">
          {(["isRemote","isHybrid","isOffice","isOnLocation"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#475569" }}>
              <input type="checkbox" checked={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                className="accent-[#3ce8ff]" />
              {key === "isRemote" ? "Remote" : key === "isHybrid" ? "Hybrid" : key === "isOffice" ? "Office" : "On Location"}
            </label>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Salary min (optional)" value={form.salaryMin} onChange={handleSalaryChange("salaryMin")} placeholder="50,000" />
        <Input label="Salary max (optional)" value={form.salaryMax} onChange={handleSalaryChange("salaryMax")} placeholder="100,000" />
      </div>

      {/* Open positions */}
      <div>
        <Input label="Number of open positions (1–50)" type="number" min="1" max="50" value={String(form.openPositions)}
          onChange={e => setForm(p => ({ ...p, openPositions: Math.min(50, Math.max(1, parseInt(e.target.value) || 1)) }))} />
        <div className="mt-2 p-3 rounded-lg" style={{ background: "rgba(91,141,239,.07)", border: "1px solid rgba(91,141,239,.2)" }}>
          <p className="text-sm" style={{ color: "#475569" }}>
            Job post cost: <strong style={{ color: "#0f172a" }}>${cost.toLocaleString()}</strong>
            <span className="ml-2 text-xs font-mono" style={{ color: "#64748b" }}>({form.openPositions} × $50)</span>
          </p>
        </div>
      </div>

      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
      <Button variant="accent" loading={saving} onClick={handleSubmit} fullWidth>{submitLabel}</Button>
    </div>
  );
}
