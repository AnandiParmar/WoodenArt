import React from 'react';
import { TableColumn, TableFilter, TableAction, CategoryTableData } from '../table-types';
import { createColumn, createAction } from '../dynamic-table';
import { ViewIcon, EditIcon, DeleteIcon, CategoryIcon } from '../icons';

// Re-export types for external use
export type { CategoryTableData };

// Category table columns configuration
export const categoryColumns: TableColumn<CategoryTableData>[] = [
  createColumn<CategoryTableData>('name', 'Category Name', {
    render: (value: unknown, item: CategoryTableData) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
          <CategoryIcon className="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">ID: #{item.id}</p>
        </div>
      </div>
    ),
    width: '250px',
  }),
  createColumn<CategoryTableData>('description', 'Description', {
    render: (value: unknown) => (
      <span className="text-gray-600">
        {(value as string) || 'No description available'}
      </span>
    ),
  }),
  createColumn<CategoryTableData>('productCount', 'Products', {
    render: (value: unknown) => (
      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
        {value as number} items
      </span>
    ),
  }),
  createColumn<CategoryTableData>('createdAt', 'Created', {
    render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    sortable: true,
  }),
];

// Category table filters configuration
export const categoryFilters: TableFilter[] = [
  {
    key: 'name',
    label: 'Category Name',
    type: 'text',
    placeholder: 'Search by category name',
  },
];

// Category table actions configuration
export const createCategoryActions = (
  onEdit: (item: CategoryTableData) => void,
  onDelete: (item: CategoryTableData) => void,
  onView: (item: CategoryTableData) => void
): TableAction<CategoryTableData>[] => [
  createAction<CategoryTableData>('View', onView, {
    variant: 'primary',
    icon: <ViewIcon className="w-4 h-4" />,
  }),
  createAction<CategoryTableData>('Edit', onEdit, {
    variant: 'secondary',
    icon: <EditIcon className="w-4 h-4" />,
  }),
  createAction<CategoryTableData>('Delete', onDelete, {
    variant: 'danger',
    icon: <DeleteIcon className="w-4 h-4" />,
  }),
];

// Sample category data
export const sampleCategoryData: CategoryTableData[] = [
  {
    id: "1",
    name: "Kitchen Items",
    description: "Wooden items for kitchen use",
    productCount: 15,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Furniture",
    description: "Wooden furniture pieces",
    productCount: 8,
    isActive: true,
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Decorative",
    description: "Decorative wooden art pieces",
    productCount: 12,
    isActive: false,
    createdAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Garden",
    description: "Outdoor wooden items",
    productCount: 6,
    isActive: true,
    createdAt: "2024-01-04",
  },
  {
    id: "5" ,
    name: "Office",
    description: "Wooden office accessories",
    productCount: 4,
    isActive: true,
    createdAt: "2024-01-05",
  },
];
