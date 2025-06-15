
import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

/**
 * IMPORTANT: Replace this with your own Clerk key for production!
 * You can get it at https://dashboard.clerk.com, or set VITE_CLERK_PUBLISHABLE_KEY in Lovable/your host.
 * For a local test, you can use a fake key in dev, but real features need production Clerk.
 */
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "test_clerk_key_replace_me";
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Add it in your project settings.");
}

import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
