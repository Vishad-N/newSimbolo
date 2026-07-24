"use client";

import { useState, useEffect } from "react";
import type { DesignCategory } from "@/types/graphic-design";
import { mockGraphicDesignCategories } from "@/data/services/graphicDesignCatalog";

const STORAGE_KEY = "simbolo_graphic_design_categories";

export function useGraphicDesignServices() {
  const [categories, setCategories] = useState<DesignCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage or Mock Data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        setCategories(mockGraphicDesignCategories);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGraphicDesignCategories));
      }
    } catch (error) {
      console.error("Error loading graphic design categories", error);
      setCategories(mockGraphicDesignCategories);
    } finally {
      setLoading(false);
    }

    // Listen for storage events (if changed from another tab/admin)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setCategories(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveCategories = (newCategories: DesignCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
    window.dispatchEvent(new Event("simbolo_graphic_categories_updated"));
  };

  useEffect(() => {
    const handleLocalUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCategories(JSON.parse(stored));
    };
    window.addEventListener("simbolo_graphic_categories_updated", handleLocalUpdate);
    return () => window.removeEventListener("simbolo_graphic_categories_updated", handleLocalUpdate);
  }, []);

  // CRUD Operations
  const addCategory = (category: Omit<DesignCategory, "id" | "displayOrder">) => {
    const newCategory: DesignCategory = {
      ...category,
      id: `gd-${Date.now()}`,
      displayOrder: categories.length + 1,
      createdAt: new Date().toISOString(),
    };
    saveCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<DesignCategory>) => {
    saveCategories(categories.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)));
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter((c) => c.id !== id));
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
