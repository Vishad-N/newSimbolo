interface DataTableProps<T> {
  columns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col, i) => (
              <th 
                key={i}
                className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, rowIndex) => (
            <tr 
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={`group hover:bg-white/[0.02] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex}
                  className="py-4 px-4 text-sm text-gray-300"
                >
                  {col.render ? col.render(item) : String(item[col.key as keyof T] || "")}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-sm text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
