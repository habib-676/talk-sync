<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes/Router.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();
>>>>>>> 9f5706f249400c7bd8f61cc423cb1b4fd2c1226f

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <App />
  </StrictMode>,
)
=======
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
       
        
        <RouterProvider router={router}></RouterProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
>>>>>>> 9f5706f249400c7bd8f61cc423cb1b4fd2c1226f
