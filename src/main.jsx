import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables");
}

console.log("Using Clerk key:", clerkPubKey); // This will help us verify the key is loaded correctly

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
  </React.StrictMode>
);
