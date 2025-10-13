'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { listProducts, createProduct as createProductAction, deleteProduct as deleteProductAction, updateProduct as updateProductAction } from '@/redux/features/product/productActions';
import { listCategories } from '@/redux/features/category/categoryActions';
import { DynamicTable } from '@/components/dynamic-table';
import { Modal } from '@/components/modal';
import DynamicForm from '@/components/dynamic-form';
import { 
  productColumns, 
  createProductActions, 
  ProductTableData 
} from '@/components/tables/product-table-config';
import { 
  buildProductFormFields, 
  ProductFormValues 
} from '@/components/forms/product-form-config';
import { graphqlFetch } from '@/lib/graphql-client';

export default function ProductManagement() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: { product: { items: ProductTableData[]; loading: boolean } }) => state.product.items);
  const loading = useAppSelector((state: { product: { items: ProductTableData[]; loading: boolean } }) => state.product.loading);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTableData | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductTableData | null>(null);
  const [tableKey, setTableKey] = React.useState(0);

  // Action handlers
  const handleEdit = (item: ProductTableData) => {
    setEditingProduct(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: ProductTableData) => {
    dispatch(deleteProductAction(item.id));
    // Refresh categories to update product counts
    dispatch(listCategories());
  };

  const handleView = (item: ProductTableData) => {
    setViewingProduct(item);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddProduct = async (values: ProductFormValues) => {
    const categoryId = values.categoryId;
    let featureImageUrl: string | null = null;
    const galleryUrls: string[] = [];

    // Create product first to get an ID
    const createdProduct = await dispatch(createProductAction({
      name: values.name,
      description: values.description ?? undefined,
      price: Number(values.price),
      stock: Number(values.stock ?? 0),
      isActive: values.status === 'Active',
      categoryId: String(categoryId),
      featureImage: null, // Initially null
      images: [], // Initially empty
    })).unwrap();

    const productId = createdProduct.id;

    // Upload feature image if present
    if (values.image) {
      try {
        const formData = new FormData();
        formData.append('file', values.image);
        
        const uploadResponse = await fetch(`/api/upload?scope=product&id=${productId}`, {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          featureImageUrl = uploadResult.url;
        }
      } catch (error) {
        console.error('Feature image upload failed:', error);
      }
    }

    // Upload gallery images if present
    if (values.gallery && Array.isArray(values.gallery) && values.gallery.length > 0) {
      for (let i = 0; i < values.gallery.length; i++) {
        const file = values.gallery[i];
        if (file) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await fetch(`/api/upload?scope=product_gallery&id=${productId}&index=${i}`, {
              method: 'POST',
              body: formData,
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
              galleryUrls.push(uploadResult.url);
            }
          } catch (error) {
            console.error('Gallery image upload failed:', error);
          }
        }
      }
    }

    // Update product with image URLs
    await dispatch(updateProductAction({
      id: productId,
      input: {
        featureImage: featureImageUrl,
        images: galleryUrls.length > 0 ? galleryUrls : null,
      },
    }));

    // Refresh categories to update product counts
    dispatch(listCategories());
    
    // Ensure table shows the new row by clearing any active filters/search
    setTableKey((k) => k + 1);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = async (values: ProductFormValues) => {
    if (!editingProduct) return;
    
    let featureImageUrl: string | null | undefined = undefined;
    let galleryUrls: string[] | undefined = undefined;

    // Handle feature image upload
    if (values.image) { // New feature image selected
      try {
        const formData = new FormData();
        formData.append('file', values.image);
        
        const uploadResponse = await fetch(`/api/upload?scope=product&id=${editingProduct.id}`, {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          featureImageUrl = uploadResult.url;
        }
      } catch (error) {
        console.error('Feature image upload failed:', error);
      }
    } else if (values.image === null) { // Explicitly cleared
      featureImageUrl = null;
    } else { // No new image selected, keep old one
      featureImageUrl = editingProduct.featureImage as string | undefined; // Pass existing URL
    }

    // Handle gallery images upload - APPEND to existing images
    if (values.gallery && Array.isArray(values.gallery) && values.gallery.length > 0) {
      const newGalleryUrls: string[] = [];
      for (let i = 0; i < values.gallery.length; i++) {
        const file = values.gallery[i];
        if (file) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await fetch(`/api/upload?scope=product_gallery&id=${editingProduct.id}&index=${Date.now()}_${i}`, {
              method: 'POST',
              body: formData,
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
              newGalleryUrls.push(uploadResult.url);
            }
          } catch (error) {
            console.error('Gallery image upload failed:', error);
          }
        }
      }
      
      // Append new images to existing ones
      const existingImages = editingProduct.images as string[] || [];
      galleryUrls = [...existingImages, ...newGalleryUrls];
    } else if (values.gallery === null) { // Explicitly cleared
      galleryUrls = [];
    } else { // No new gallery images selected, keep old ones
      galleryUrls = editingProduct.images as string[] | undefined; // Pass existing URLs
    }

    await dispatch(updateProductAction({
      id: editingProduct.id,
      input: {
        name: values.name,
        description: values.description ?? undefined,
        price: Number(values.price),
        stock: Number(values.stock ?? 0),
        isActive: values.status === 'Active',
        categoryId: values.categoryId,
        featureImage: featureImageUrl,
        images: galleryUrls,
      },
    }));

    // Refresh categories to update product counts
    dispatch(listCategories());
    
    // Force table refresh to show updated data
    console.log('Product updated, refreshing table...');
    setTableKey((k) => k + 1);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  // Create actions with handlers
  const actions = createProductActions(handleEdit, handleDelete, handleView);

  const [categoryOptions, setCategoryOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [filterCategories, setFilterCategories] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const query = `
        query AllCategories { categories { id name } }
      `;
      const res = await graphqlFetch<{ categories: { id: string | number; name: string }[] }>({ query });
      const categories = res.categories.map(c => ({ value: String(c.id), label: c.name }));
      setCategoryOptions(categories);
      // Add "All Categories" option for filter - use category names for filtering
      setFilterCategories([
        { value: '', label: 'All Categories' },
        ...res.categories.map(c => ({ value: c.name, label: c.name }))
      ]);
    };

    dispatch(listProducts());
    fetchCategories().catch(console.error);
  }, [dispatch]);

  // Create dynamic filters with real categories
  const dynamicFilters = [
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      options: filterCategories,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
    {
      key: 'price',
      label: 'Min Price',
      type: 'number' as const,
      placeholder: 'Enter minimum price',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your wooden art products</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{data.filter(item => item.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${data.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DynamicTable
          key={tableKey}
          data={data}
          columns={productColumns}
          filters={dynamicFilters}
          actions={actions}
          searchable={true}
          sortable={true}
          pagination={true}
          pageSize={10}
          loading={loading}
          emptyMessage="No products found. Add your first product to get started."
        />
                      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <DynamicForm<ProductFormValues>
          fields={buildProductFormFields({ categories: categoryOptions })}
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Create Product"
          cancelLabel="Cancel"
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        {editingProduct && (
          <DynamicForm<ProductFormValues>
            fields={buildProductFormFields({ categories: categoryOptions }).map((f) => {
              if (f.name === 'image') {
                return { ...f, previewUrl: editingProduct.featureImage as string | undefined };
              } else if (f.name === 'gallery') {
                const galleryImages = editingProduct.images as string[] || [];
                return { ...f, existingImages: galleryImages };
              }
              return f;
            })}
            onSubmit={handleEditProduct}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingProduct(null);
            }}
            submitLabel="Update Product"
            cancelLabel="Cancel"
            initialValues={{
              name: editingProduct.name,
              description: editingProduct.description,
              price: editingProduct.price,
              categoryId: categoryOptions.find(cat => cat.label === editingProduct.category)?.value || '',
              stock: editingProduct.stock,
              status: editingProduct.status,
              createdAt: editingProduct.createdAt,
            }}
          />
        )}
      </Modal>

      {/* View Product Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        title="Product Details"
        size="lg"
      >
        {viewingProduct && (
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-r from-accent-100 to-accent-200 rounded-xl flex items-center justify-center">
                  {viewingProduct.image ? (
                    <img
                      src={viewingProduct.image}
                      alt={viewingProduct.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = '/window.svg';
                      }}
                    />
                  ) : (
                    <svg className="w-16 h-16 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewingProduct.name}</h2>
                <p className="text-gray-600 mb-4">{viewingProduct.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    viewingProduct.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingProduct.status}
                  </span>
                  <span className="text-sm text-gray-500">ID: #{viewingProduct.id}</span>
                </div>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-2xl font-bold text-gray-900">${viewingProduct.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock</label>
                  <p className={`text-lg font-semibold ${
                    viewingProduct.stock > 10 
                      ? 'text-green-600' 
                      : viewingProduct.stock > 0 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                  }`}>
                    {viewingProduct.stock} units
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-lg text-gray-900">{viewingProduct.category}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-lg text-gray-900">
                    {viewingProduct.createdAt ? new Date(viewingProduct.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Product ID</label>
                  <p className="text-lg text-gray-900">#{viewingProduct.id}</p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            {viewingProduct.images && Array.isArray(viewingProduct.images) && viewingProduct.images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Gallery Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {viewingProduct.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="aspect-square">
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = '/window.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingProduct(null);
                }}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingProduct(null);
                  setEditingProduct(viewingProduct);
                  setIsEditModalOpen(true);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Edit Product
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}