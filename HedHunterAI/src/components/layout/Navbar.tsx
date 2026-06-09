"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { Logo } from "@/components/ui/Logo";

const PUBLIC_LINKS = [
  {href:"/#how",        label:"How it works"},
  {href:"/#guardrails", label:"Guardrails"},
  {href:"/pricing",     label:"Pricing"},
  {href:"/merit-based-hiring", label:"Merit Pledge"},
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { role }         = useRole();
  const path             = usePathname();
  const isPublic         = !path.startsWith("/job-seeker") && !path.startsWith("/company") && !path.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50" style={{backdropFilter:"blur(18px)",background:"rgba(255,255,255,.92)",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-3.5">
        <Logo height={48} href="/" />

        {isPublic && (
          <nav className="hidden md:flex gap-7">
            {PUBLIC_LINKS.map(l=>(
              <Link key={l.href} href={l.href} className="text-sm transition-colors duration-200 hover:text-[#0f172a]" style={{color:"#475569"}}>{l.label}</Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href={role==="COMPANY"?"/company/dashboard":role==="ADMIN"?"/admin/dashboard":"/job-seeker/dashboard"}
                className="text-sm px-4 py-2 rounded-[10px] transition-all hover:bg-black/[.04]" style={{color:"#475569",border:"1px solid rgba(0,0,0,.07)"}}>
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm px-4 py-2 rounded-[10px] transition-all hover:bg-black/[.04]" style={{color:"#64748b",border:"1px solid rgba(0,0,0,.07)"}}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-4 py-2 rounded-[10px] transition-all hover:bg-black/[.04] hover:text-[#0f172a]" style={{color:"#475569",border:"1px solid rgba(0,0,0,.07)"}}>Sign in</Link>
              <Link href="/signup/job-seeker" className="text-sm px-4 py-2.5 rounded-[10px] font-semibold transition-all hover:bg-white hover:-translate-y-px" style={{background:"#0f172a",color:"#ffffff"}}>Apply anonymously →</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
