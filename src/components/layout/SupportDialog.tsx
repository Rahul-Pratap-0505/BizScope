
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Contact } from "lucide-react";

export default function SupportDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogTitle>Support & Guidelines</DialogTitle>
        <div className="mt-4 space-y-3 text-[15px]">
          <div className="font-semibold">Usage Guidelines</div>
          <ul className="list-disc pl-6 space-y-1">
            <li>Keep your information accurate and up to date.</li>
            <li>Use the supported features responsibly (dashboard, analytics, data management).</li>
            <li>For sensitive data, ensure you have the proper permissions and privacy settings.</li>
            <li>Contact support promptly if you encounter issues with your account, metrics, or connections.</li>
            <li>Your data privacy and security is important to us; please don’t share your login credentials.</li>
          </ul>
          <div>
            <span className="inline-flex items-center gap-2">
              <Contact size={18} className="text-blue-500" />
              <span>
                Contact:{" "}
                <a
                  href="mailto:rahulsingh5may@gmail.com"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  rahulsingh5may@gmail.com
                </a>
              </span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
