'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { listCategories, createCategory as createCategoryAction, deleteCategory as deleteCategoryAction } from '@/redux/features/category/categoryActions';
import { DynamicTable } from '@/components/dynamic-table';
import { Modal } from '@/components/modal';
import DynamicForm from '@/components/dynamic-form';
import { toast } from 'react-toastify';
import { 
  categoryColumns, 
  categoryFilters, 
  createCategoryActions, 
  CategoryTableData 
} from '@/components/tables/category-table-config';
import { 
  categoryFormFields, 
  CategoryFormValues 
} from '@/components/forms/category-form-config';

export default function CategoryManagement() {
  const dispatch = useAppDispatch();
  const { items: data, loading } = useAppSelector((state) => state.category);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Action handlers
  const handleEdit = (item: CategoryTableData) => {
    // console.log('Edit category:', item);
    // Implement edit logic here
  };

  const handleDelete = (item: CategoryTableData) => {
    // console.log('Delete category:', item);
    dispatch(deleteCategoryAction(item.id));
  };

  const handleView = (item: CategoryTableData) => {
    // console.log('View category:', item);
    // Implement view logic here
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCategory = async (values: CategoryFormValues) => {
    try {
      await dispatch(createCategoryAction({
        name: values.name.trim(),
        description: values.description?.trim() ?? null,
      })).unwrap();
      toast.success('Category created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsAddModalOpen(false);
      // Refresh the category list
      dispatch(listCategories());
    } catch (e) {
      let errorMessage = 'Failed to create category';
      
      if (e instanceof Error) {
        const errorMsg = e.message;
        
        // Parse specific error messages from GraphQL
        if (errorMsg.includes('already exists') || 
            errorMsg.includes('Category with this name already exists') ||
            errorMsg.toLowerCase().includes('duplicate')) {
          errorMessage = `Category "${values.name.trim()}" already exists. Please choose a different name.`;
        } else if (errorMsg.includes('createdAt') || 
                   errorMsg.includes('Cannot return null') ||
                   errorMsg.includes('non-nullable field')) {
          errorMessage = 'An error occurred while creating the category. Please try again.';
        } else if (errorMsg.includes('name') && errorMsg.includes('required')) {
          errorMessage = 'Category name is required.';
        } else if (errorMsg.includes('Invalid credentials') || errorMsg.includes('Unauthorized')) {
          errorMessage = 'You are not authorized to perform this action.';
        } else if (errorMsg.includes('network error') || errorMsg.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (errorMsg.length > 0) {
          // Use the GraphQL error message if available, but clean it up
          errorMessage = errorMsg.replace(/GraphQL error:?\s*/i, '').trim() || 'Failed to create category';
        }
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Create actions with handlers
  const actions = createCategoryActions(handleEdit, handleDelete, handleView);

  React.useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-1">Manage product categories</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                + Add New Category
              </button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DynamicTable
            data={data}
            columns={categoryColumns}
            filters={categoryFilters}
            actions={actions}
            searchable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            loading={loading}
            emptyMessage="No categories found. Add your first category to get started."
          />
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <DynamicForm<CategoryFormValues>
          fields={categoryFormFields}
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Create Category"
          cancelLabel="Cancel"
        />
      </Modal>
    </>
  );
}