
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Book } from "lucide-react";

export default function DocsDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogTitle>Documentation & Quick Start</DialogTitle>
        <div className="mt-4 space-y-3 text-[15px]">
          <div className="font-semibold flex items-center gap-2">
            <Book size={18} className="text-blue-500" />
            Getting Started with BizScope
          </div>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the <b>Dashboard</b> to see your current KPIs at a glance.</li>
            <li>Visit <b>Analytics</b> for in-depth visualizations of your metrics.</li>
            <li>Manage or import your data under <b>Data Management</b>.</li>
            <li>Configure alerts and rules for important metric changes.</li>
            <li>Need help? Use the <b>Support</b> button for guidelines or to contact support.</li>
          </ul>
          <div>
            <span>
              Official Documentation:{" "}
              <a
                href="https://docs.lovable.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Lovable Documentation
              </a>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
