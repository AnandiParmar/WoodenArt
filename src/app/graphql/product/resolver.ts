import { connectToDatabase } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { Category as CategoryModel } from '@/models/Category';
import { cacheGetJSON, cacheSetJSON } from '@/lib/redis';
import { 
  ProductInput, 
  ProductUpdateInput, 
  ProductFilterInput, 
  ProductSortInput,
  ProductWithRelations,
  ProductConnection
} from '../types';

type Direction = 'asc' | 'desc';

export const productResolvers = {
  Query: {
    product: async (_: unknown, { id }: { id: string }): Promise<ProductWithRelations | null> => {
      await connectToDatabase();
      const p = await ProductModel.findById(id).lean();
      if (!p) return null;
      const category = p.categoryId ? await CategoryModel.findById(p.categoryId).select({ _id: 1, name: 1 }).lean() : null;
      return {
        id: String(p._id),
        name: p.name,
        description: p.description || null,
        price: Number(p.price),
        discount: p.discount != null ? Number(p.discount) : null,
        discountType: 'PERCENT',
        stock: p.stock,
        isActive: p.isActive,
        featureImage: p.featureImage || null,
        images: Array.isArray(p.images) ? p.images : [],
        createdAt: (p.createdAt as Date).toISOString(),
        categoryId: p.categoryId as any,
        category: category ? { id: String(category._id), name: category.name } : null,
        ratings: [],
      } as unknown as ProductWithRelations;
    },

    products: async (
      _: unknown,
      {
        filter,
        sort,
        first,
        after,
      }: {
        filter?: ProductFilterInput;
        sort?: ProductSortInput;
        first?: number;
        after?: string;
        last?: number;
        before?: string;
      }
    ): Promise<ProductConnection> => {
      await connectToDatabase();
      const mongoFilter: Record<string, unknown> = {};

      if (filter) {
        if (filter.categoryId) mongoFilter['categoryId'] = filter.categoryId;
        if (filter.isActive !== undefined) mongoFilter['isActive'] = filter.isActive;
        const priceFilter: Record<string, unknown> = {};
        if (filter.minPrice) priceFilter['$gte'] = Number(filter.minPrice as unknown as number);
        if (filter.maxPrice) priceFilter['$lte'] = Number(filter.maxPrice as unknown as number);
        if (Object.keys(priceFilter).length > 0) mongoFilter['price'] = priceFilter;
        if (filter.material) mongoFilter['material'] = { $regex: filter.material, $options: 'i' };
        if (filter.color) mongoFilter['color'] = { $regex: filter.color, $options: 'i' };
        if (filter.style) mongoFilter['style'] = { $regex: filter.style, $options: 'i' };
        if (filter.search) mongoFilter['$or'] = [
          { name: { $regex: filter.search, $options: 'i' } },
          { description: { $regex: filter.search, $options: 'i' } },
          { material: { $regex: filter.search, $options: 'i' } },
          { color: { $regex: filter.search, $options: 'i' } },
          { style: { $regex: filter.search, $options: 'i' } },
        ];
      }

      let sortObj: Record<string, Direction> = { createdAt: 'desc' };
      
      if (sort) {
        const direction = sort.direction.toLowerCase() as 'asc' | 'desc';
        switch (sort.field) {
          case 'NAME':
            sortObj = { name: direction };
            break;
          case 'PRICE':
            sortObj = { price: direction };
            break;
          case 'CREATED_AT':
            sortObj = { createdAt: direction };
            break;
          case 'UPDATED_AT':
            sortObj = { updatedAt: direction };
            break;
          case 'AVERAGE_RATING':
            sortObj = { averageRating: direction };
            break;
          case 'STOCK':
            sortObj = { stock: direction };
            break;
          default:
            sortObj = { createdAt: 'desc' };
        }
      }

      const skip = after ? parseInt(Buffer.from(after, 'base64').toString()) : 0;
      const take = first || 10;

      const cacheKey = `products:${Buffer.from(JSON.stringify({ mongoFilter, sortObj, skip, take })).toString('base64')}`;
      const cached = await cacheGetJSON<{ edges: any[]; totalCount: number }>(cacheKey);
      let products: any[];
      let totalCount: number;
      if (cached) {
        products = cached.edges.map(e => e.nodeRaw);
        totalCount = cached.totalCount;
      } else {
        products = await ProductModel.find(mongoFilter).sort(sortObj).skip(skip).limit(take).lean();
        totalCount = await ProductModel.countDocuments(mongoFilter);
      }

      // Prefetch categories
      const catIds = Array.from(new Set(products.map((p: any) => p.categoryId).filter(Boolean)));
      const cats = catIds.length ? await CategoryModel.find({ _id: { $in: catIds } }).select({ _id: 1, name: 1 }).lean() : [];
      const idToCat = new Map(cats.map(c => [String(c._id), c.name]));

      const edges = (products as any[]).map((p, index) => ({
        node: {
          id: String(p._id),
          name: p.name,
          description: p.description || null,
          price: Number(p.price),
          discount: p.discount != null ? Number(p.discount) : null,
          discountType: 'PERCENT',
          stock: p.stock,
          isActive: p.isActive,
          featureImage: p.featureImage || null,
          images: Array.isArray(p.images) ? p.images : [],
          createdAt: (p.createdAt as Date).toISOString(),
          category: p.categoryId ? { id: String(p.categoryId), name: idToCat.get(String(p.categoryId)) || 'Uncategorized' } : null,
          ratings: [],
        } as unknown as ProductWithRelations,
        nodeRaw: p,
        cursor: Buffer.from((skip + index).toString()).toString('base64'),
      }));

      const result = {
        edges,
        pageInfo: {
          hasNextPage: skip + take < totalCount,
          hasPreviousPage: skip > 0,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        totalCount,
      };

      if (!cached) {
        await cacheSetJSON(cacheKey, { edges, totalCount }, 60);
      }
      return result;
    },

    productsByCategory: async (_: unknown, { categoryId }: { categoryId: string }): Promise<ProductWithRelations[]> => {
      await connectToDatabase();
      const products = await ProductModel.find({ categoryId }).lean();
      const category = await CategoryModel.findById(categoryId).select({ _id: 1, name: 1 }).lean();
      return products.map((p: any) => ({
        id: String(p._id),
        name: p.name,
        description: p.description || null,
        price: Number(p.price),
        discount: p.discount != null ? Number(p.discount) : null,
        discountType: 'PERCENT',
        stock: p.stock,
        isActive: p.isActive,
        featureImage: p.featureImage || null,
        images: Array.isArray(p.images) ? p.images : [],
        createdAt: (p.createdAt as Date).toISOString(),
        category: category ? { id: String(category._id), name: category.name } : null,
        ratings: [],
      })) as unknown as ProductWithRelations[];
    },

    searchProducts: async (_: unknown, { query }: { query: string }): Promise<ProductWithRelations[]> => {
      await connectToDatabase();
      const results = await ProductModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { material: { $regex: query, $options: 'i' } },
          { color: { $regex: query, $options: 'i' } },
          { style: { $regex: query, $options: 'i' } },
        ],
      }).lean();
      return results.map((p: any) => ({
        id: String(p._id),
        name: p.name,
        description: p.description || null,
        price: Number(p.price),
        discount: p.discount != null ? Number(p.discount) : null,
        discountType: 'PERCENT',
        stock: p.stock,
        isActive: p.isActive,
        featureImage: p.featureImage || null,
        images: Array.isArray(p.images) ? p.images : [],
        createdAt: (p.createdAt as Date).toISOString(),
        category: null,
        ratings: [],
      })) as unknown as ProductWithRelations[];
    },
  },

  Mutation: {
    createProduct: async (_: unknown, { input }: { input: ProductInput }): Promise<ProductWithRelations> => {
      await connectToDatabase();
      const { categoryId, ...productData } = input as any;
      const created = await ProductModel.create({ ...productData, categoryId });
      const category = categoryId ? await CategoryModel.findById(categoryId).select({ _id: 1, name: 1 }).lean() : null;
      return {
        id: String(created._id),
        name: created.name,
        description: created.description || null,
        price: Number(created.price),
        discount: created.discount != null ? Number(created.discount) : null,
        discountType: 'PERCENT',
        stock: created.stock,
        isActive: created.isActive,
        featureImage: created.featureImage || null,
        images: Array.isArray(created.images) ? created.images : [],
        createdAt: (created.createdAt as Date).toISOString(),
        category: category ? { id: String(category._id), name: category.name } : null,
        ratings: [],
      } as unknown as ProductWithRelations;
    },

    updateProduct: async (
      _: unknown,
      { id, input }: { id: string; input: ProductUpdateInput & { featureImage?: string | null } }
    ): Promise<ProductWithRelations> => {
      await connectToDatabase();
      const data: Record<string, unknown> = {};
      
      // Copy all properties except categoryId
      if (input.name !== undefined) data.name = input.name;
      if (input.description !== undefined) data.description = input.description;
      if (input.price !== undefined) data.price = input.price;
      if (input.discount !== undefined) data.discount = input.discount;
      if (input.discountType !== undefined) data['discountType'] = input.discountType;
      if (input.sku !== undefined) data.sku = input.sku;
      if (input.stock !== undefined) data.stock = input.stock;
      {
        const rec = input as unknown as Record<string, unknown>;
        if ('featureImage' in rec) {
          const fe = rec['featureImage'] as string | null | undefined;
          // Allow null to clear featureImage, undefined to keep existing
          if (fe !== undefined) {
            (data as Record<string, unknown>)['featureImage'] = fe;
          }
        }
        if ('images' in rec) {
          const imgs = rec['images'] as unknown as string[] | null | undefined;
          // Allow null or empty array to clear/replace images, undefined to keep existing
          if (imgs !== undefined) {
            data.images = imgs || []; // null becomes empty array
          }
        }
      }
      if (input.material !== undefined) data.material = input.material;
      if (input.color !== undefined) data.color = input.color;
      if (input.specialFeature !== undefined) data.specialFeature = input.specialFeature;
      if (input.style !== undefined) data.style = input.style;
      if (input.isActive !== undefined) data.isActive = input.isActive;
      // Only replace images/featureImage if provided; if omitted, keep existing (handled above)
      
      // Handle category update via relation connect
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ('categoryId' in input && typeof (input as any).categoryId === 'string') {
        data['categoryId'] = (input as any).categoryId;
      }

      const updated = await ProductModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
      if (!updated) throw new Error('Product not found');
      const category = updated.categoryId ? await CategoryModel.findById(updated.categoryId).select({ _id: 1, name: 1 }).lean() : null;
      return {
        id: String(updated._id),
        name: updated.name,
        description: updated.description || null,
        price: Number(updated.price),
        discount: updated.discount != null ? Number(updated.discount) : null,
        discountType: 'PERCENT',
        stock: updated.stock,
        isActive: updated.isActive,
        featureImage: updated.featureImage || null,
        images: Array.isArray(updated.images) ? updated.images : [],
        createdAt: (updated.createdAt as Date).toISOString(),
        category: category ? { id: String(category._id), name: category.name } : null,
        ratings: [],
      } as unknown as ProductWithRelations;
    },

    deleteProduct: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      await connectToDatabase();
      await ProductModel.findByIdAndDelete(id);
      return true;
    },

    toggleProductStatus: async (_: unknown, { id }: { id: string }): Promise<ProductWithRelations> => {
      await connectToDatabase();
      const product = await ProductModel.findById(id).lean();
      if (!product) throw new Error('Product not found');
      const updated = await ProductModel.findByIdAndUpdate(id, { $set: { isActive: !product.isActive } }, { new: true }).lean();
      const category = updated?.categoryId ? await CategoryModel.findById(updated.categoryId).select({ _id: 1, name: 1 }).lean() : null;
      return {
        id: String(updated!._id),
        name: updated!.name,
        description: updated!.description || null,
        price: Number(updated!.price),
        discount: updated!.discount != null ? Number(updated!.discount) : null,
        discountType: 'PERCENT',
        stock: updated!.stock,
        isActive: updated!.isActive,
        featureImage: updated!.featureImage || null,
        images: Array.isArray(updated!.images) ? updated!.images : [],
        createdAt: (updated!.createdAt as Date).toISOString(),
        category: category ? { id: String(category._id), name: category.name } : null,
        ratings: [],
      } as unknown as ProductWithRelations;
    },
  },

  Product: {
    category: async (parent: ProductWithRelations) => parent.category,

    ratings: async (parent: ProductWithRelations) => parent.ratings || [],
  },
};