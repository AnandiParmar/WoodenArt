'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TableColumn, TableAction, DynamicTableProps } from './table-types';

export function DynamicTable<T extends Record<string, unknown>>({
  data,
  columns,
  filters = [],
  actions = [],
  searchable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  title,
  subtitle,
  onAdd,
  addButtonText = 'Add New',
  className = '',
}: DynamicTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Get nested value from object - moved before useMemo hooks
  const getNestedValue = (obj: unknown, path: string) => {
    return path.split('.').reduce((current: unknown, key: string) => 
      (current as Record<string, unknown>)?.[key], obj);
  };

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          if (column.searchable === false) return false;
          const value = getNestedValue(item, column.key as string);
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      const filterValue = filterValues[filter.key];
      if (filterValue && filterValue.trim()) {
        filtered = filtered.filter((item) => {
          const value = getNestedValue(item, filter.key);
          if (value === null || value === undefined) return false;
          
          // For select filters, use exact match
          if (filter.type === 'select') {
            return value.toString() === filterValue;
          }
          
          // For number filters, handle numeric comparison
          if (filter.type === 'number') {
            const numValue = parseFloat(value.toString());
            const numFilter = parseFloat(filterValue);
            return !isNaN(numValue) && !isNaN(numFilter) && numValue >= numFilter;
          }
          
          // For text filters, use partial match
          const filterLower = filterValue.toLowerCase().trim();
          return value.toString().toLowerCase().includes(filterLower);
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filterValues, columns, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      // Convert to comparable values
      const aComparable = aValue as string | number;
      const bComparable = bValue as string | number;

      if (aComparable < bComparable) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aComparable > bComparable) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Handle sort
  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterValues({});
    setSearchTerm('');
    setCurrentPage(1);
  };


  // Get total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${title || subtitle || onAdd ? 'space-y-6' : 'space-y-0'} ${className}`}>
      {/* Header */}
      {(title || subtitle || onAdd) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {addButtonText}
            </button>
          )}
        </div>
      )}

      {/* Filters */}
      {(searchable || filters.length > 0) && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search {searchTerm && <span className="text-accent-600">({filteredData.length} results)</span>}
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white shadow-sm focus:shadow-md transition-all duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Filters */}
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 bg-white shadow-sm focus:shadow-md transition-all duration-200"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type}
                    placeholder={filter.placeholder || `Filter by ${filter.label}`}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white shadow-sm focus:shadow-md transition-all duration-200"
                  />
                )}
              </div>
            ))}

            {/* Clear Filters Button */}
            {(searchTerm || Object.values(filterValues).some(Boolean)) && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
                      column.className || ''
                    }`}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortable && column.sortable !== false && (
                        <button
                          onClick={() => handleSort(String(column.key))}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {sortConfig?.key === String(column.key) ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                              <ChevronDownIcon className="w-4 h-4" />
                            )
                          ) : (
                            <div className="w-4 h-4 opacity-30">
                              <ChevronUpIcon className="w-4 h-4" />
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 text-sm text-gray-900 ${
                          column.className || ''
                        }`}
                      >
                        {column.render
                          ? column.render(getNestedValue(item, String(column.key)), item, index)
                          : String(getNestedValue(item, String(column.key)) || '')}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item, index)}
                              className={`text-sm font-medium transition-colors ${
                                action.variant === 'danger'
                                  ? 'text-red-600 hover:text-red-800'
                                  : action.variant === 'success'
                                  ? 'text-green-600 hover:text-green-800'
                                  :                                 action.variant === 'primary'
                                  ? 'text-blue-600 hover:text-blue-800'
                                  : 'text-gray-600 hover:text-gray-800'
                              } ${action.className || ''}`}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{' '}
                {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-accent-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function to create common column types
export const createColumn = <T,>(
  key: keyof T | string,
  label: string,
  options?: Partial<TableColumn<T>>
): TableColumn<T> => ({
  key,
  label,
  sortable: true,
  searchable: true,
  ...options,
});

// Utility function to create common action types
export const createAction = <T,>(
  label: string,
  onClick: (item: T, index: number) => void,
  options?: Partial<TableAction<T>>
): TableAction<T> => ({
  label,
  onClick,
  variant: 'primary',
  ...options,
});
