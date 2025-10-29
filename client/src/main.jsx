import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes/Router.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import CallProvider from "./providers/CallProvider.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CallProvider>
          <RouterProvider router={router}></RouterProvider>
        </CallProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
