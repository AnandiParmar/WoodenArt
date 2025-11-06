import React from 'react';

// Base table column interface
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: unknown, item: T, index: number) => React.ReactNode;
  className?: string;
  width?: string;
}

// Table filter interface
export interface TableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// Table action interface
export interface TableAction<T> {
  label: string;
  onClick: (item: T, index: number) => void;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

// Main table props interface
export interface DynamicTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  filters?: TableFilter[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

// Common column types for different data types
export interface ProductTableData extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  discountType?: 'PERCENT' | 'FIXED';
  finalPrice?: number;
  category: string;
  stock: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  image?: string; // mapped from featureImage
  featureImage?: string; // original featureImage field
  images?: string[]; // gallery images array
}

export interface CategoryTableData extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface OrderTableData extends Record<string, unknown> {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  items: number;
}

export interface RatingTableData {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  review?: string;
  createdAt: string;
}

// Utility types for common table configurations
export type TableVariant = 'default' | 'compact' | 'detailed';
export type TableSize = 'sm' | 'md' | 'lg';
export type SortDirection = 'asc' | 'desc';
