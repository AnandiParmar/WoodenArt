import { connectToDatabase } from '@/lib/mongodb';
import { Category as CategoryModel } from '@/models/Category';
import { Product as ProductModel } from '@/models/Product';
import { Types } from 'mongoose';
import { 
  CategoryInput, 
  CategoryUpdateInput,
  CategoryWithRelations
} from '../types';

 

export const categoryResolvers = {
  Query: {
    category: async (_: unknown, { id }: { id: string }): Promise<CategoryWithRelations | null> => {
      await connectToDatabase();
      const c = await CategoryModel.findById(id).lean();
      if (!c) return null;
      const products = await ProductModel.find({ categoryId: id }).lean();
      return {
        id: String(c._id),
        name: c.name,
        description: c.description || null,
        createdAt: c.createdAt || new Date(),
        updatedAt: c.updatedAt || new Date(),
        products: products.map((p: any) => ({ id: String(p._id), name: p.name, description: p.description || null })) as any,
      } as unknown as CategoryWithRelations;
    },

    categories: async (): Promise<CategoryWithRelations[]> => {
      await connectToDatabase();
      const cats = await CategoryModel.find({}).sort({ name: 'asc' }).lean();

      // Compute product counts per category in one aggregation
      const categoryIds = cats.map((c: any) => new Types.ObjectId(String(c._id)));
      const counts = await ProductModel.aggregate([
        { $match: { categoryId: { $in: categoryIds } } },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      ]);
      const countMap = new Map<string, number>(counts.map((r: any) => [String(r._id), r.count]));

      return cats.map((c: any) => {
        const count = countMap.get(String(c._id)) || 0;
        // We only need length on the client; return minimal product stubs to satisfy the schema
        const productStubs = Array.from({ length: count }).map((_, idx) => ({ id: `${idx}` }));
        return {
          id: String(c._id),
          name: c.name,
          description: c.description || null,
          createdAt: c.createdAt || new Date(),
          updatedAt: c.updatedAt || new Date(),
          products: productStubs as any,
        } as unknown as CategoryWithRelations;
      }) as any;
    },

    categoryWithProducts: async (_: unknown, { id }: { id: string }): Promise<CategoryWithRelations | null> => {
      await connectToDatabase();
      const c = await CategoryModel.findById(id).lean();
      if (!c) return null;
      const products = await ProductModel.find({ categoryId: id, isActive: true }).sort({ createdAt: -1 }).lean();
      return {
        id: String(c._id),
        name: c.name,
        description: c.description || null,
        createdAt: c.createdAt || new Date(),
        updatedAt: c.updatedAt || new Date(),
        products: products.map((p: any) => ({ id: String(p._id), name: p.name, description: p.description || null })) as any,
      } as unknown as CategoryWithRelations;
    },
  },

  Mutation: {
    createCategory: async (_: unknown, { input }: { input: CategoryInput }): Promise<CategoryWithRelations> => {
      await connectToDatabase();
      const existing = await CategoryModel.findOne({ name: input.name }).lean();
      if (existing) throw new Error('Category with this name already exists');
      const created = await CategoryModel.create({ name: input.name, description: input.description });
      // Convert to plain object to access timestamps
      const createdDoc = created.toObject();
      return { 
        id: String(created._id), 
        name: created.name, 
        description: created.description || null, 
        createdAt: createdDoc.createdAt || new Date(),
        updatedAt: createdDoc.updatedAt || new Date(),
        products: [] 
      } as any;
    },

    updateCategory: async (_: unknown, { id, input }: { id: string; input: CategoryUpdateInput }): Promise<CategoryWithRelations> => {
      await connectToDatabase();
      const existing = await CategoryModel.findById(id).lean();
      if (!existing) throw new Error('Category not found');
      if (input.name && input.name !== existing.name) {
        const dup = await CategoryModel.findOne({ name: input.name }).lean();
        if (dup) throw new Error('Category with this name already exists');
      }
      const updated = await CategoryModel.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();
      return { 
        id: String(updated!._id), 
        name: updated!.name, 
        description: updated!.description || null, 
        createdAt: updated!.createdAt || new Date(),
        updatedAt: updated!.updatedAt || new Date(),
        products: [] 
      } as any;
    },

    deleteCategory: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      await connectToDatabase();
      const productCount = await ProductModel.countDocuments({ categoryId: id });
      if (productCount > 0) throw new Error('Cannot delete category that has products. Please move or delete products first.');
      await CategoryModel.findByIdAndDelete(id);
      return true;
    },
  },

  Category: {
    products: async (parent: CategoryWithRelations) => parent.products || [],
  },
};