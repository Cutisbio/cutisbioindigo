import React from 'react';

type Column = {
  key: string;
  label: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = Record<string, any>;

interface DataTableProps {
  columns: Column[];
  data: DataRow[];
  caption?: string;
}

export default function DataTable({ columns, data, caption }: DataTableProps) {
  return (
    <div className="overflow-x-auto w-full border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={`${rowIndex}-${col.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
