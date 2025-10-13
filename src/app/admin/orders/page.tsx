'use client';

import React, { useState } from 'react';
import { DynamicTable } from '@/components/dynamic-table';
import { 
  orderColumns, 
  orderFilters, 
  createOrderActions, 
  sampleOrderData,
  OrderTableData 
} from '@/components/tables/order-table-config';

export default function OrderManagement() {
  const [data, setData] = useState<OrderTableData[]>(sampleOrderData);
  const [loading, setLoading] = useState(false);

  // Action handlers
  const handleView = (item: OrderTableData) => {
    console.log('View order:', item);
    // Implement view logic here
  };

  const handleEdit = (item: OrderTableData) => {
    console.log('Edit order:', item);
    // Implement edit logic here
  };

  const handleCancel = (item: OrderTableData) => {
    console.log('Cancel order:', item);
    // Implement cancel logic here
    setData(prev => prev.map(order => 
      order.id === item.id 
        ? { ...order, status: 'Cancelled' as const }
        : order
    ));
  };

  // Create actions with handlers
  const actions = createOrderActions(handleView, handleEdit, handleCancel);

  return (
    <DynamicTable
      data={data}
      columns={orderColumns}
      filters={orderFilters}
      actions={actions}
      searchable={true}
      sortable={true}
      pagination={true}
      pageSize={10}
      loading={loading}
      title="Order Management"
      subtitle="Manage customer orders and track their status"
      emptyMessage="No orders found."
    />
  );
}