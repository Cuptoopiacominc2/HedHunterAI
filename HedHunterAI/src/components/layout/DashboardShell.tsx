"use client";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import type { UserRole } from "@/types/user";

interface DashboardShellProps {
  children:      React.ReactNode;
  role:          UserRole;
  title?:        string;
  subtitle?:     string;
  action?:       React.ReactNode;
  headerAction?: React.ReactNode;
}

export function DashboardShell({children,role,title,subtitle,action,headerAction}:DashboardShellProps) {
  const actionNode = action ?? headerAction;
  return (
    <div className="min-h-screen flex flex-col" style={{background:"#ffffff"}}>
      <Navbar/>
      <div className="flex flex-1">
        <Sidebar role={role}/>
        <main className="flex-1 overflow-hidden relative z-10">
          {(title||actionNode)&&(
            <div className="flex items-center justify-between px-8 py-6" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              <div>
                {title&&<h1 style={{fontFamily:"Instrument Serif,serif",fontSize:"clamp(26px,3vw,38px)",fontWeight:400,letterSpacing:"-.015em",color:"#0f172a"}}>{title}</h1>}
                {subtitle&&<p className="mt-1 text-sm" style={{color:"#64748b"}}>{subtitle}</p>}
              </div>
              {actionNode&&<div>{actionNode}</div>}
            </div>
          )}
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
