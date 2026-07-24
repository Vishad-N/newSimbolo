"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/utils";
import { ChevronLeft, ChevronRight, MoreVertical, Edit2, Trash2, Copy } from "lucide-react";
import { useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onDuplicate,
  emptyMessage = "No items found."
}: DataTableProps<T>) {
  const [openActionMenuId, setOpenActionMenuId] = useState<string | number | null>(null);

  const toggleMenu = (id: string | number) => {
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col w-full relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-sm font-semibold text-gray-300">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onDuplicate) && (
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors relative"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-200">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onDuplicate) && (
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleMenu(item.id)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === item.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenActionMenuId(null)} 
                          />
                          <div className="absolute right-8 top-10 mt-1 w-36 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                            {onEdit && (
                              <button 
                                onClick={() => { onEdit(item); setOpenActionMenuId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" /> Edit
                              </button>
                            )}
                            {onDuplicate && (
                              <button 
                                onClick={() => { onDuplicate(item); setOpenActionMenuId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" /> Duplicate
                              </button>
                            )}
                            {onDelete && (
                              <button 
                                onClick={() => { onDelete(item); setOpenActionMenuId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Basic Pagination Footer */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400 bg-white/[0.01]">
        <span>Showing {data.length > 0 ? 1 : 0} to {data.length} of {data.length} entries</span>
        <div className="flex gap-2">
          <button className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
