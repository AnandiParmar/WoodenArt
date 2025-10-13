import React from 'react';
import Image from 'next/image';
import { TableColumn, TableFilter, TableAction, ProductTableData } from '../table-types';
import { createColumn, createAction } from '../dynamic-table';
import { ViewIcon, EditIcon, DeleteIcon, ProductIcon } from '../icons';

// Re-export types for external use
export type { ProductTableData };

// Product table columns configuration
export const productColumns: TableColumn<ProductTableData>[] = [
  createColumn<ProductTableData>('name', 'Product', {
    render: (value: unknown, item: ProductTableData) => (
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                console.error('Table image failed to load:', item.image, e);
                e.currentTarget.src = '/window.svg';
              }}
              onLoad={() => {
                console.log('Table image loaded successfully:', item.image);
              }}
            />
          ) : (
            <ProductIcon className="w-6 h-6 text-accent-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">ID: #{item.id}</p>
        </div>
      </div>
    ),
    width: '300px',
  }),
  createColumn<ProductTableData>('category', 'Category'),
  createColumn<ProductTableData>('price', 'Price', {
    render: (value: unknown) => (
      <span className="font-semibold text-gray-900">${value as number}</span>
    ),
  }),
  createColumn<ProductTableData>('stock', 'Stock', {
    render: (value: unknown) => {
      const stockValue = value as number;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          stockValue > 10 
            ? 'bg-green-100 text-green-800' 
            : stockValue > 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {stockValue}
        </span>
      );
    },
  }),
  createColumn<ProductTableData>('status', 'Status', {
    render: (value: unknown) => {
      const statusValue = value as string;
      return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          statusValue === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {statusValue}
        </span>
      );
    },
  }),
  createColumn<ProductTableData>('createdAt', 'Created', {
    render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    sortable: true,
  }),
];

// Product table filters configuration
export const productFilters: TableFilter[] = [
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'Kitchen', label: 'Kitchen' },
      { value: 'Furniture', label: 'Furniture' },
      { value: 'Decorative', label: 'Decorative' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'price',
    label: 'Min Price',
    type: 'number',
    placeholder: 'Enter minimum price',
  },
];

// Product table actions configuration
export const createProductActions = (
  onEdit: (item: ProductTableData) => void,
  onDelete: (item: ProductTableData) => void,
  onView: (item: ProductTableData) => void
): TableAction<ProductTableData>[] => [
  createAction<ProductTableData>('View', onView, {
    variant: 'primary',
    icon: <ViewIcon className="w-4 h-4" />,
    className: 'px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 hover:border-blue-300',
  }),
  createAction<ProductTableData>('Edit', onEdit, {
    variant: 'secondary',
    icon: <EditIcon className="w-4 h-4" />,
    className: 'px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 hover:border-gray-300',
  }),
  createAction<ProductTableData>('Delete', onDelete, {
    variant: 'danger',
    icon: <DeleteIcon className="w-4 h-4" />,
    className: 'px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 hover:border-red-300',
  }),
];

// Sample product data
export const sampleProductData: ProductTableData[] = [
  {
    id: 1,
    name: "Handcrafted Wooden Bowl",
    description: "Beautiful handcrafted wooden bowl made from oak",
    price: 45,
    category: "Kitchen",
    stock: 12,
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Oak Wooden Table",
    description: "Solid oak dining table with traditional craftsmanship",
    price: 299,
    category: "Furniture",
    stock: 3,
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Decorative Wooden Vase",
    description: "Elegant wooden vase for home decoration",
    price: 89,
    category: "Decorative",
    stock: 0,
    status: "Inactive",
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    name: "Bamboo Cutting Board",
    description: "Eco-friendly bamboo cutting board",
    price: 35,
    category: "Kitchen",
    stock: 8,
    status: "Active",
    createdAt: "2024-01-20",
  },
  {
    id: 5,
    name: "Wooden Wall Art",
    description: "Hand-carved wooden wall decoration",
    price: 125,
    category: "Decorative",
    stock: 5,
    status: "Active",
    createdAt: "2024-01-18",
  },
];
