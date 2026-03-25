import React from "react";

interface PageShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function PageShell({
  title,
  subtitle,
  children,
  maxWidthClass = "max-w-[1600px]",
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50 to-emerald-50/60 relative overflow-x-hidden">
      <div className="absolute -top-32 -left-16 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

      <div className={`relative ${maxWidthClass} mx-auto px-4 md:px-8 py-6 space-y-6`}>
        <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#003087] via-[#0a4aa3] to-[#026c7c] text-white shadow-2xl shadow-blue-900/20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-100">DHSUD NIR</p>
              <h1 className="text-2xl md:text-3xl font-black leading-tight mt-2">{title}</h1>
              <p className="text-sm md:text-base text-blue-100 mt-1">{subtitle}</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-blue-100 font-bold">Data Snapshot</p>
              <p className="font-black text-lg">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
