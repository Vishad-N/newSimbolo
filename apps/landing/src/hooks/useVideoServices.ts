"use client";

import { useState, useEffect } from "react";
import type { VideoEditingService, VideoServiceCategory } from "@/types/video-editing";
import { mockVideoServices, mockVideoCategories } from "@/data/services/videoEditingCatalog";

const STORAGE_KEY = "simbolo_video_services";

export function useVideoServices() {
  const [services, setServices] = useState<VideoEditingService[]>([]);
  const [categories, setCategories] = useState<VideoServiceCategory[]>(mockVideoCategories);
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage or Mock Data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setServices(JSON.parse(stored));
      } else {
        setServices(mockVideoServices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockVideoServices));
      }
    } catch (error) {
      console.error("Error loading services", error);
      setServices(mockVideoServices);
    } finally {
      setLoading(false);
    }

    // Listen for storage events (if changed from another tab/admin)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setServices(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveServices = (newServices: VideoEditingService[]) => {
    setServices(newServices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newServices));
    // Dispatch custom event to notify same-tab components
    window.dispatchEvent(new Event("simbolo_services_updated"));
  };

  useEffect(() => {
    const handleLocalUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setServices(JSON.parse(stored));
    };
    window.addEventListener("simbolo_services_updated", handleLocalUpdate);
    return () => window.removeEventListener("simbolo_services_updated", handleLocalUpdate);
  }, []);

  // CRUD Operations
  const addService = (service: Omit<VideoEditingService, "id" | "displayOrder">) => {
    const newService: VideoEditingService = {
      ...service,
      id: `vs-${Date.now()}`,
      displayOrder: services.length + 1,
      createdAt: new Date().toISOString(),
    };
    saveServices([...services, newService]);
  };

  const updateService = (id: string, updates: Partial<VideoEditingService>) => {
    saveServices(services.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)));
  };

  const deleteService = (id: string) => {
    saveServices(services.filter((s) => s.id !== id));
  };

  const reorderServices = (reordered: VideoEditingService[]) => {
    // Update displayOrder based on new array index
    const updated = reordered.map((s, index) => ({ ...s, displayOrder: index + 1 }));
    saveServices(updated);
  };

  return {
    services,
    categories,
    loading,
    addService,
    updateService,
    deleteService,
    reorderServices,
  };
}
