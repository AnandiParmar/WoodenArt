'use client';

import React from 'react';
import { FormField } from '../form-types';

export interface CategoryFormValues extends Record<string, unknown> {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export const categoryFormFields: FormField<CategoryFormValues>[] = [
  { 
    name: 'name', 
    label: 'Category Name', 
    type: 'text', 
    required: true, 
    placeholder: 'Enter category name',
    colSpan: 2
  },
  { 
    name: 'description', 
    label: 'Description', 
    type: 'textarea', 
    placeholder: 'Describe the category',
    colSpan: 2
  },
  { 
    name: 'isActive', 
    label: 'Active', 
    type: 'checkbox',
    defaultValue: true,
    description: 'Check to make this category visible to customers'
  },
  { 
    name: 'createdAt', 
    label: 'Created Date', 
    type: 'date',
    defaultValue: new Date().toISOString().split('T')[0]
  },
];

export default categoryFormFields;
