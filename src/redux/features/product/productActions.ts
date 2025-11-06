'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { graphqlFetch } from '@/lib/graphql-client';
import { ProductTableData } from '@/components/table-types';

// GraphQL response types
interface GraphQLProduct {
  id: string ;
  name: string;
  description?: string | null;
  price: string | number;
  discount?: string | number | null;
  discountType?: 'PERCENT' | 'FIXED';
  stock: number;
  isActive: boolean;
  featureImage?: string | null;
  images?: string[] | null;
  createdAt: string;
  category?: {
    id: string ;
    name: string;
  } | null;
}

interface GraphQLProductsResponse {
  products: {
    edges: {
      node: GraphQLProduct;
    }[];
  };
}

interface GraphQLCreateProductResponse {
  createProduct: GraphQLProduct;
}

interface GraphQLUpdateProductResponse {
  updateProduct: GraphQLProduct;
}

export const listProducts = createAsyncThunk('product/list', async () => {
  const res = await fetch('/api/products?first=100');
  if (!res.ok) throw new Error('Failed to load products');
  const data = await res.json();
  return data.items as ProductTableData[];
});

export const createProduct = createAsyncThunk(
  'product/create',
  async (input: { name: string; description?: string; price: number; discount?: number; discountType?: 'PERCENT' | 'FIXED'; stock?: number; isActive: boolean; categoryId: string; featureImage?: string | null; images?: string[] | null }) => {
    const mutation = `
      mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) { id name description price discount discountType stock isActive featureImage images createdAt category { id name } }
      }
    `;
    const created = await graphqlFetch<GraphQLCreateProductResponse, { input: Record<string, unknown> }>({
      query: mutation,
      variables: { input },
    });
    const p = created.createProduct;
    const row: ProductTableData = {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      discount: p.discount != null ? (typeof p.discount === 'string' ? parseFloat(p.discount) : p.discount) : undefined,
      discountType: p.discountType,
      finalPrice: (() => {
        const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        const disc = p.discount != null ? (typeof p.discount === 'string' ? parseFloat(p.discount) : p.discount) : 0;
        return p.discountType === 'PERCENT' ? price - (price * disc) / 100 : price - disc;
      })(),
      category: p.category?.name ?? 'Uncategorized',
      stock: p.stock,
      status: p.isActive ? 'Active' : 'Inactive',
      createdAt: p.createdAt?.slice(0, 10),
      image: p.featureImage ?? undefined,
      featureImage: p.featureImage ?? undefined,
      images: p.images && Array.isArray(p.images) ? p.images : [],
    };
    return row;
  }
);

export const deleteProduct = createAsyncThunk('product/delete', async (id: string) => {
  const mutation = `mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) }`;
  await graphqlFetch<{ deleteProduct: boolean }, { id: string }>({ query: mutation, variables: { id: String(id) } });
  return id;
});

export const updateProduct = createAsyncThunk(
  'product/update',
  async ({
    id,
    input,
  }: {
    id: string;
    input: {
      name?: string;
      description?: string;
      price?: number;
      discount?: number;
      discountType?: 'PERCENT' | 'FIXED';
      stock?: number;
      isActive?: boolean;
      categoryId?: string;
      featureImage?: string | null;
      images?: string[] | null; // if provided, replace; if undefined, keep old
    };
  }) => {
    const mutation = `
      mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
        updateProduct(id: $id, input: $input) {
          id
          name
          description
          price
          discount
          discountType
          stock
          isActive
          featureImage
          images
          createdAt
          category { id name }
        }
      }
    `;
    const updated = await graphqlFetch<GraphQLUpdateProductResponse, { id: string; input: Record<string, unknown> }>({
      query: mutation,
      variables: { id: String(id), input },
    });
    const p = updated.updateProduct;
    const row: ProductTableData = {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      discount: p.discount != null ? (typeof p.discount === 'string' ? parseFloat(p.discount) : p.discount) : undefined,
      discountType: p.discountType,
      finalPrice: (() => {
        const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        const disc = p.discount != null ? (typeof p.discount === 'string' ? parseFloat(p.discount) : p.discount) : 0;
        return p.discountType === 'PERCENT' ? price - (price * disc) / 100 : price - disc;
      })(),
      category: p.category?.name ?? 'Uncategorized',
      stock: p.stock,
      status: p.isActive ? 'Active' : 'Inactive',
      createdAt: p.createdAt?.slice(0, 10),
      image: p.featureImage ?? undefined,
      featureImage: p.featureImage ?? undefined,
      images: p.images && Array.isArray(p.images) ? p.images : [],
    };
    return row;
  }
);


