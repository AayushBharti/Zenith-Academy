"use client";

import { AlertTriangle, Server, Wifi } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { apiConnector } from "@/utils/api-connector";
import { categories } from "@/utils/apis";

export default function BackendListener() {
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkServerHealth = async () => {
      const toastId = "server-wakeup-toast";
      let isSlow = false;

      // 1. Start the timer for "Cold Start" detection
      const timer = setTimeout(() => {
        isSlow = true;
        toast.loading(
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-bold">
              <Server className="h-4 w-4" /> Waking up backend...
            </span>
            <span className="text-muted-foreground text-xs">
              Render free tier spins down after inactivity. Please wait ~30s.
            </span>
          </div>,
          {
            id: toastId,
            duration: 100_000,
          }
        );
      }, 1500);

      try {
        await apiConnector("GET", categories.CATEGORIES_API);
        clearTimeout(timer);

        // Only show success if we previously showed the "Loading" toast
        if (isSlow) {
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 font-bold">
                <Wifi className="h-4 w-4" /> Server Connected
              </span>
              <span className="text-muted-foreground text-xs">
                You can now browse courses seamlessly.
              </span>
            </div>,
            { id: toastId, duration: 4000, icon: null }
          );
        }
      } catch (error) {
        clearTimeout(timer);

        // FIX: Show error toast even if it failed instantly (Backend Offline)
        // This helps you locally when you forget to start the server
        toast.error(
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4" /> Backend Offline
            </span>
            <span className="text-muted-foreground text-xs">
              Could not connect to the server.
            </span>
          </div>,
          {
            id: toastId, // Replaces loading toast if it exists
            duration: 5000,
            icon: null,
          }
        );
      }
    };

    checkServerHealth();
  }, []);

  return null;
}
