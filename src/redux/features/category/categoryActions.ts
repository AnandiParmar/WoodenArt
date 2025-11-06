'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { graphqlFetch } from '@/lib/graphql-client';
import { CategoryTableData } from '@/components/table-types';

// GraphQL response types
interface GraphQLCategory {
  id: string ;
  name: string;
  description?: string | null;
  createdAt: string;
  products?: { id: string | number }[];
}

interface GraphQLCategoriesResponse {
  categories: GraphQLCategory[];
}

interface GraphQLCreateCategoryResponse {
  createCategory: GraphQLCategory;
}

export const listCategories = createAsyncThunk('category/list', async () => {
  const query = `
    query Categories { 
      categories { 
        id 
        name 
        description 
        createdAt 
        products { 
          id 
        } 
      } 
    }
  `;
  const res = await graphqlFetch<GraphQLCategoriesResponse>({ query });
  const rows: CategoryTableData[] = res.categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? '',
    productCount: c.products?.length || 0,
    isActive: true,
    createdAt: c.createdAt?.slice(0, 10),
  }));
  return rows;
});

export const createCategory = createAsyncThunk(
  'category/create',
  async (input: { name: string; description?: string | null }) => {
    const mutation = `mutation CreateCategory($input: CategoryInput!) { createCategory(input: $input) { id name description createdAt } }`;
    const created = await graphqlFetch<GraphQLCreateCategoryResponse, { input: Record<string, unknown> }>({
      query: mutation,
      variables: { input },
    });
    const c = created.createCategory;
    const row: CategoryTableData = {
      id: c.id,
      name: c.name,
      description: c.description ?? '',
      productCount: 0, // New categories start with 0 products
      isActive: true,
      createdAt: c.createdAt?.slice(0, 10),
    };
    return row;
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async (input: { id: string; data: { name?: string; description?: string | null } }) => {
    const mutation = `mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) { updateCategory(id: $id, input: $input) { id name description createdAt } }`;
    const updated = await graphqlFetch<{ updateCategory: GraphQLCategory }, { id: string; input: Record<string, unknown> }>({
      query: mutation,
      variables: { id: String(input.id), input: input.data },
    });
    const c = updated.updateCategory;
    const row: CategoryTableData = {
      id: c.id,
      name: c.name,
      description: c.description ?? '',
      // Keep existing count on the client; it will refresh on next list
      productCount: 0,
      isActive: true,
      createdAt: c.createdAt?.slice(0, 10),
    };
    return row;
  }
);

export const deleteCategory = createAsyncThunk('category/delete', async (id: string) => {
  const mutation = `mutation DeleteCategory($id: ID!) { deleteCategory(id: $id) }`;
  await graphqlFetch<{ deleteCategory: boolean }, { id: string }>({ query: mutation, variables: { id: String(id) } });
  return id;
});


