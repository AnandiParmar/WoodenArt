import React from 'react';
import { TableColumn, TableFilter, TableAction, OrderTableData } from '../table-types';
import { createColumn, createAction } from '../dynamic-table';
import { ViewIcon, EditIcon } from '../icons';

// Order table columns configuration
export const orderColumns: TableColumn<OrderTableData>[] = [
  createColumn<OrderTableData>('id', 'Order ID', {
    render: (value: unknown) => (
      <span className="font-mono text-sm font-semibold text-gray-900">
        #{(value as number).toString().padStart(6, '0')}
      </span>
    ),
    width: '120px',
  }),
  createColumn<OrderTableData>('customerName', 'Customer', {
    render: (value: unknown, item: OrderTableData) => (
      <div>
        <p className="font-medium text-gray-900">{value as string}</p>
        <p className="text-sm text-gray-500">{item.email}</p>
      </div>
    ),
    width: '200px',
  }),
  createColumn<OrderTableData>('total', 'Total', {
    render: (value: unknown) => (
      <span className="font-semibold text-gray-900">${value as number}</span>
    ),
  }),
  createColumn<OrderTableData>('items', 'Items', {
    render: (value: unknown) => (
      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
        {value as number} items
      </span>
    ),
  }),
  createColumn<OrderTableData>('status', 'Status', {
    render: (value: unknown) => {
      const statusValue = value as string;
      const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Shipped': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800',
      };
      
      return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          statusColors[statusValue as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
        }`}>
          {statusValue}
        </span>
      );
    },
  }),
  createColumn<OrderTableData>('createdAt', 'Order Date', {
    render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    sortable: true,
  }),
];

// Order table filters configuration
export const orderFilters: TableFilter[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Processing', label: 'Processing' },
      { value: 'Shipped', label: 'Shipped' },
      { value: 'Delivered', label: 'Delivered' },
      { value: 'Cancelled', label: 'Cancelled' },
    ],
  },
  {
    key: 'customerName',
    label: 'Customer',
    type: 'text',
    placeholder: 'Search by customer name',
  },
  {
    key: 'total',
    label: 'Min Total',
    type: 'number',
    placeholder: 'Enter minimum total',
  },
];

// Order table actions configuration
export const createOrderActions = (
  onView: (item: OrderTableData) => void,
  onEdit: (item: OrderTableData) => void,
  onCancel: (item: OrderTableData) => void
): TableAction<OrderTableData>[] => [
  createAction<OrderTableData>('View', onView, {
    variant: 'primary',
    icon: <ViewIcon className="w-4 h-4" />,
  }),
  createAction<OrderTableData>('Edit', onEdit, {
    variant: 'secondary',
    icon: <EditIcon className="w-4 h-4" />,
  }),
  createAction<OrderTableData>('Cancel', onCancel, {
    variant: 'danger',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  }),
];

// Sample order data
export const sampleOrderData: OrderTableData[] = [
  {
    id: 1,
    customerName: "John Doe",
    email: "john.doe@email.com",
    total: 299,
    status: "Delivered",
    createdAt: "2024-01-15",
    items: 2,
  },
  {
    id: 2,
    customerName: "Jane Smith",
    email: "jane.smith@email.com",
    total: 89,
    status: "Shipped",
    createdAt: "2024-01-14",
    items: 1,
  },
  {
    id: 3,
    customerName: "Bob Johnson",
    email: "bob.johnson@email.com",
    total: 125,
    status: "Processing",
    createdAt: "2024-01-13",
    items: 3,
  },
  {
    id: 4,
    customerName: "Alice Brown",
    email: "alice.brown@email.com",
    total: 45,
    status: "Pending",
    createdAt: "2024-01-12",
    items: 1,
  },
  {
    id: 5,
    customerName: "Charlie Wilson",
    email: "charlie.wilson@email.com",
    total: 199,
    status: "Cancelled",
    createdAt: "2024-01-11",
    items: 2,
  },
];
