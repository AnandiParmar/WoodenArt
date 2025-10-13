import { PrismaClient } from '@prisma/client';
import { 
  CategoryInput, 
  CategoryUpdateInput,
  CategoryWithRelations
} from '../types';

const prisma = new PrismaClient();

export const categoryResolvers = {
  Query: {
    category: async (_: unknown, { id }: { id: string }): Promise<CategoryWithRelations | null> => {
      return await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: {
            include: {
              ratings: true,
            },
          },
        },
      });
    },

    categories: async (): Promise<CategoryWithRelations[]> => {
      return await prisma.category.findMany({
        include: {
          products: {
            include: {
              ratings: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    },

    categoryWithProducts: async (_: unknown, { id }: { id: string }): Promise<CategoryWithRelations | null> => {
      return await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: {
            where: { isActive: true },
            include: {
              ratings: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    },
  },

  Mutation: {
    createCategory: async (_: unknown, { input }: { input: CategoryInput }): Promise<CategoryWithRelations> => {
      // Check if category with same name already exists
      const existingCategory = await prisma.category.findUnique({
        where: { name: input.name },
      });

      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      return await prisma.category.create({
        data: input,
        include: {
          products: true,
        },
      });
    },

    updateCategory: async (_: unknown, { id, input }: { id: string; input: CategoryUpdateInput }): Promise<CategoryWithRelations> => {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCategory) {
        throw new Error('Category not found');
      }

      // If updating name, check for duplicates
      if (input.name && input.name !== existingCategory.name) {
        const duplicateCategory = await prisma.category.findUnique({
          where: { name: input.name },
        });

        if (duplicateCategory) {
          throw new Error('Category with this name already exists');
        }
      }

      return await prisma.category.update({
        where: { id: parseInt(id) },
        data: input,
        include: {
          products: {
            include: {
              ratings: true,
            },
          },
        },
      });
    },

    deleteCategory: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      // Check if category has products
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: true,
        },
      });

      if (!categoryWithProducts) {
        throw new Error('Category not found');
      }

      if (categoryWithProducts.products.length > 0) {
        throw new Error('Cannot delete category that has products. Please move or delete products first.');
      }

      await prisma.category.delete({
        where: { id: parseInt(id) },
      });

      return true;
    },
  },

  Category: {
    products: async (parent: CategoryWithRelations) => {
      if (parent.products) return parent.products;
      return await prisma.product.findMany({
        where: { categoryId: parent.id },
        include: {
          ratings: true,
        },
      });
    },
  },
};