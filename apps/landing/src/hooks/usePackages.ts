"use client";

import { useState, useEffect } from "react";
import type { MarketingPackage } from "@/types/packages";
import { packages as mockPackages } from "@/mock/packages";

const STORAGE_KEY = "simbolo_packages";

export function usePackages() {
  const [packages, setPackages] = useState<MarketingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage or fallback to Mock Data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPackages(JSON.parse(stored));
      } else {
        setPackages(mockPackages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPackages));
      }
    } catch (error) {
      console.error("Failed to load packages from storage:", error);
      setPackages(mockPackages);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (updatedPackages: MarketingPackage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
      setPackages(updatedPackages);
    } catch (error) {
      console.error("Failed to save packages to storage:", error);
    }
  };

  const addPackage = (newPkg: MarketingPackage) => {
    const updated = [...packages, newPkg];
    saveToStorage(updated);
  };

  const updatePackage = (id: string, updates: Partial<MarketingPackage>) => {
    const updated = packages.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg));
    saveToStorage(updated);
  };

  const deletePackage = (id: string) => {
    const updated = packages.filter((pkg) => pkg.id !== id);
    saveToStorage(updated);
  };

  return {
    packages,
    loading,
    addPackage,
    updatePackage,
    deletePackage,
  };
}
