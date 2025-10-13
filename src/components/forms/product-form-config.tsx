'use client';

import React from 'react';
import DynamicForm from '../dynamic-form';
import { FormField } from '../form-types';

export interface ProductFormValues extends Record<string, unknown> {
  name: string;
  description?: string;
  price: number;
  categoryId: string; // GraphQL expects ID
  stock: number;
  status: 'Active' | 'Inactive';
  image?: File | null;
  gallery?: File[];
  createdAt?: string;
  // For edit mode - existing images
  existingFeatureImage?: string;
  existingGalleryImages?: string[];
}

export function buildProductFormFields(options: { categories: { value: string; label: string }[] }): FormField<ProductFormValues>[] {
  return [
    { name: 'name', label: 'Product Name', type: 'text', required: true, placeholder: 'Enter product name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the product', colSpan: 2 },
    { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 0.01 },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select',
      options: options.categories,
      required: true,
    },
    { name: 'stock', label: 'Stock', type: 'number', min: 0, step: 1 },
    {
      name: 'status',
      label: 'Status',
      type: 'radio',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
      defaultValue: 'Active',
    },
    { name: 'image', label: 'Feature Image', type: 'file', accept: 'image/*' },
    { name: 'gallery', label: 'Gallery Images', type: 'file', accept: 'image/*', multiple: true, colSpan: 2 },
    { name: 'createdAt', label: 'Available From', type: 'date' },
  ];
}

export function ProductFormExample() {
  const handleSubmit = async (values: ProductFormValues) => {
    // Replace with your mutation/action
    console.log('Submit product form', values);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Product</h2>
      <DynamicForm<ProductFormValues>
        fields={buildProductFormFields({ categories: [] })}
        onSubmit={handleSubmit}
        submitLabel="Create"
      />
    </div>
  );
}

export default ProductFormExample;


