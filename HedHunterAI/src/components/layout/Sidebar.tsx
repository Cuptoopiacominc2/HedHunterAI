"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard,Briefcase,FileText,Mic,CheckSquare,Gift,Star,Users,Building2,Settings,DollarSign,ShieldAlert,Flag,ScrollText,Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { UserRole } from "@/types/user";

type NavItem = { href:string; label:string; icon:React.ReactNode; count?:number };

const JS_NAV: NavItem[] = [
  {href:"/job-seeker/dashboard",     label:"Dashboard",      icon:<LayoutDashboard size={16}/>},
  {href:"/job-seeker/jobs",          label:"Browse Jobs",    icon:<Search size={16}/>},
  {href:"/job-seeker/applications",  label:"Applications",   icon:<FileText size={16}/>},
  {href:"/job-seeker/resume-upload", label:"Resume",         icon:<Briefcase size={16}/>},
  {href:"/job-seeker/offers",        label:"Offers",         icon:<Gift size={16}/>},
];

const CO_NAV: NavItem[] = [
  {href:"/company/dashboard",     label:"Dashboard",     icon:<LayoutDashboard size={16}/>},
  {href:"/company/jobs",          label:"Job Posts",     icon:<Briefcase size={16}/>},
  {href:"/company/jobs/create",   label:"Post a Job",    icon:<FileText size={16}/>},
  {href:"/company/profile",       label:"Profile",       icon:<Building2 size={16}/>},
  {href:"/company/ratings",       label:"Ratings",       icon:<Star size={16}/>},
];

const AD_NAV: NavItem[] = [
  {href:"/admin/dashboard",              label:"Dashboard",      icon:<LayoutDashboard size={16}/>},
  {href:"/admin/users",                  label:"Users",          icon:<Users size={16}/>},
  {href:"/admin/companies",              label:"Companies",      icon:<Building2 size={16}/>},
  {href:"/admin/jobs",                   label:"Jobs",           icon:<Briefcase size={16}/>},
  {href:"/admin/payments",               label:"Payments",       icon:<DollarSign size={16}/>},
  {href:"/admin/anonymization-review",   label:"Anon Review",    icon:<ShieldAlert size={16}/>},
  {href:"/admin/flagged-questions",      label:"Flagged Qs",     icon:<Flag size={16}/>},
  {href:"/admin/appeals",                label:"Appeals",        icon:<CheckSquare size={16}/>},
  {href:"/admin/audit-logs",             label:"Audit Logs",     icon:<ScrollText size={16}/>},
  {href:"/admin/settings",               label:"Settings",       icon:<Settings size={16}/>},
];

export function Sidebar({role}:{role:UserRole}) {
  const path = usePathname();
  const nav  = role==="ADMIN"?AD_NAV:role==="COMPANY"?CO_NAV:JS_NAV;

  return (
    <aside className="w-56 flex-none flex flex-col gap-1 py-6 px-4" style={{borderRight:"1px solid rgba(0,0,0,.07)",background:"rgba(255,255,255,.01)"}}>
      <div className="flex justify-center mb-4 pb-4" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
        <Logo height={44} href="/" />
      </div>
      {nav.map(item=>{
        const active = path===item.href || (item.href!=="/" && path.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href}
            className={clsx(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              active
                ? "text-[#0f172a] bg-gradient-to-r from-[rgba(91,141,239,.14)] to-transparent border-l-2 border-[#3ce8ff] pl-2.5"
                : "text-[#475569] hover:text-[#0f172a] hover:bg-black/[.04]"
            )}>
            <span className={active?"text-[#3ce8ff]":"text-[#64748b]"}>{item.icon}</span>
            {item.label}
            {item.count!==undefined&&(
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded" style={{background:active?"rgba(60,232,255,.14)":"rgba(0,0,0,.04)",color:active?"#3ce8ff":"#64748b"}}>{item.count}</span>
            )}
          </Link>
        );
      })}
    </aside>
  );
}
