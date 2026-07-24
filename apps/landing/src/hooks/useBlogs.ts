"use client";

import { useState, useEffect } from "react";
import type { BlogPost, BlogCategory, BlogAuthor, BlogTag } from "@/types/blog";
import { mockBlogs, mockCategories, mockAuthors, mockTags } from "@/mock/blog";

const STORAGE_KEYS = {
  BLOGS: "simbolo_blogs",
  CATEGORIES: "simbolo_blog_categories",
  AUTHORS: "simbolo_blog_authors",
  TAGS: "simbolo_blog_tags"
};

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load or initialize Blogs
      const storedBlogs = localStorage.getItem(STORAGE_KEYS.BLOGS);
      if (storedBlogs) setBlogs(JSON.parse(storedBlogs));
      else {
        setBlogs(mockBlogs);
        localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(mockBlogs));
      }

      // Load or initialize Categories
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      else {
        setCategories(mockCategories);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
      }

      // Load or initialize Authors
      const storedAuthors = localStorage.getItem(STORAGE_KEYS.AUTHORS);
      if (storedAuthors) setAuthors(JSON.parse(storedAuthors));
      else {
        setAuthors(mockAuthors);
        localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(mockAuthors));
      }

      // Load or initialize Tags
      const storedTags = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (storedTags) setTags(JSON.parse(storedTags));
      else {
        setTags(mockTags);
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(mockTags));
      }

    } catch (error) {
      console.error("Failed to load blog data from storage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Blog Methods ---
  const saveBlogs = (updated: BlogPost[]) => {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
    setBlogs(updated);
  };

  const addBlog = (post: BlogPost) => saveBlogs([post, ...blogs]);
  
  const updateBlog = (id: string, updates: Partial<BlogPost>) => {
    saveBlogs(blogs.map(b => b.id === id ? { ...b, ...updates } : b));
  };
  
  const deleteBlog = (id: string) => saveBlogs(blogs.filter(b => b.id !== id));

  const getBlogBySlug = (slug: string) => blogs.find(b => b.slug === slug);

  // --- Category Methods ---
  const saveCategories = (updated: BlogCategory[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    setCategories(updated);
  };
  const addCategory = (cat: BlogCategory) => saveCategories([...categories, cat]);
  const updateCategory = (id: string, updates: Partial<BlogCategory>) => saveCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteCategory = (id: string) => saveCategories(categories.filter(c => c.id !== id));

  // --- Author Methods ---
  const saveAuthors = (updated: BlogAuthor[]) => {
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(updated));
    setAuthors(updated);
  };
  const addAuthor = (auth: BlogAuthor) => saveAuthors([...authors, auth]);
  const updateAuthor = (id: string, updates: Partial<BlogAuthor>) => saveAuthors(authors.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteAuthor = (id: string) => saveAuthors(authors.filter(a => a.id !== id));

  return {
    blogs,
    categories,
    authors,
    tags,
    loading,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogBySlug,
    addCategory,
    updateCategory,
    deleteCategory,
    addAuthor,
    updateAuthor,
    deleteAuthor
  };
}
