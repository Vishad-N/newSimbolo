"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api, getDataArray } from "@/services/api";
import { FilePenLine, Plus, RefreshCw, Save, Trash, X } from "lucide-react";

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogAuthor {
  id: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

interface BlogRecord {
  id: string;
  title: string;
  excerpt?: string | null;
  status?: string;
  publishDate?: string | null;
  category?: BlogCategory | null;
  author?: BlogAuthor | null;
}

interface BlogRow {
  id: string;
  title: string;
  category: string;
  author: string;
  status: string;
  publishDate: string;
}

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  authorId: string;
  categoryId: string;
  tags: string;
}

interface DataResponse<T> {
  data: T[];
}

const defaultForm: BlogFormData = {
  title: "",
  excerpt: "",
  content: "",
  status: "DRAFT",
  authorId: "",
  categoryId: "",
  tags: "",
};

function getAuthorName(author?: BlogAuthor | null): string {
  const user = author?.user;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "Unknown Author";
}

function getRequestMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  if (error.message.includes("401")) {
    return "You are not authorized to make this change. Please sign in with an admin API account or ask the technical team to configure admin API access.";
  }
  return error.message || fallback;
}

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<BlogFormData>(defaultForm);

  const hasAuthors = authors.length > 0;

  const totalPublished = useMemo(
    () => blogs.filter((blog) => blog.status === "PUBLISHED").length,
    [blogs],
  );

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [blogResponse, categoryResponse, authorResponse] = await Promise.all([
        api.blogs.getAll() as Promise<BlogRecord[] | DataResponse<BlogRecord>>,
        api.blogs.getCategories() as Promise<BlogCategory[] | DataResponse<BlogCategory>>,
        api.blogs.getAuthors() as Promise<BlogAuthor[] | DataResponse<BlogAuthor>>,
      ]);

      const blogRows = getDataArray<BlogRecord>(blogResponse).map((blog): BlogRow => ({
        id: blog.id,
        title: blog.title,
        category: blog.category?.name || "Uncategorized",
        author: getAuthorName(blog.author),
        status: blog.status || "PUBLISHED",
        publishDate: blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : "Not published",
      }));

      setBlogs(blogRows);
      setCategories(getDataArray<BlogCategory>(categoryResponse));
      setAuthors(getDataArray<BlogAuthor>(authorResponse));
    } catch (requestError) {
      setError(getRequestMessage(requestError, "Failed to load blogs"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.blogs.delete(id);
      fetchData();
    } catch (requestError) {
      alert(getRequestMessage(requestError, "Failed to delete blog"));
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.blogs.create({
        title: form.title,
        excerpt: form.excerpt || undefined,
        content: form.content,
        status: form.status,
        authorId: form.authorId,
        categoryId: form.categoryId || undefined,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setIsModalOpen(false);
      setForm(defaultForm);
      fetchData();
    } catch (requestError) {
      alert(getRequestMessage(requestError, "Failed to create blog"));
    }
  };

  const columns = [
    {
      key: "title",
      header: "Blog",
      render: (item: BlogRow) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <FilePenLine className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{item.title}</div>
            <div className="text-xs text-gray-500">{item.author}</div>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category" },
    { key: "publishDate", header: "Publish Date" },
    {
      key: "status",
      header: "Status",
      render: (item: BlogRow) => (
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${
          item.status === "PUBLISHED"
            ? "border-green-500/20 bg-green-500/10 text-green-400"
            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: BlogRow) => (
        <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10">
          <Trash className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-heading font-bold text-white">
            <FilePenLine className="h-6 w-6 text-primary" />
            Blogs
          </h1>
          <p className="text-sm text-gray-400">Manage public blog articles and publishing status.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_var(--primary-glow)] transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add Blog
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="glass-card rounded-xl p-4">
          <span className="text-sm text-gray-400">Total Blogs</span>
          <div className="mt-1 text-2xl font-bold text-white">{blogs.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <span className="text-sm text-gray-400">Published</span>
          <div className="mt-1 text-2xl font-bold text-green-400">{totalPublished}</div>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center p-12 text-gray-400">Loading blogs...</div>
      ) : (
        <DataTable columns={columns} data={blogs} emptyMessage="No blogs found." />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add Blog</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!hasAuthors && (
              <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                No blog authors are available. Create or connect a blog author before publishing new posts.
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Title</label>
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Content</label>
                <textarea required rows={6} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Author</label>
                  <select required value={form.authorId} onChange={(event) => setForm({ ...form, authorId: event.target.value })} className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1F2E] px-4 py-2 text-white">
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>{getAuthorName(author)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Category</label>
                  <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1F2E] px-4 py-2 text-white">
                    <option value="">Uncategorized</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Status</label>
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BlogFormData["status"] })} className="w-full appearance-none rounded-lg border border-white/10 bg-[#1A1F2E] px-4 py-2 text-white">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Tags</label>
                  <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="SEO, Marketing" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white">Cancel</button>
                <button disabled={!hasAuthors} type="submit" className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
