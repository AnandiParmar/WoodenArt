import { PrismaClient, Prisma } from '@prisma/client';
import { 
  ProductInput, 
  ProductUpdateInput, 
  ProductFilterInput, 
  ProductSortInput,
  ProductWithRelations,
  ProductConnection
} from '../types';

const prisma = new PrismaClient();

export const productResolvers = {
  Query: {
    product: async (_: unknown, { id }: { id: string }): Promise<ProductWithRelations | null> => {
      const result = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true,
          ratings: true,
        },
      });
      return result as unknown as ProductWithRelations | null;
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
      const where: Prisma.ProductWhereInput = {};

      if (filter) {
        if (filter.categoryId) {
          where.categoryId = parseInt(filter.categoryId);
        }
        if (filter.isActive !== undefined) {
          where.isActive = filter.isActive;
        }
        if (filter.minPrice || filter.maxPrice) {
          where.price = {};
          if (filter.minPrice) {
            where.price.gte = filter.minPrice;
          }
          if (filter.maxPrice) {
            where.price.lte = filter.maxPrice;
          }
        }
        if (filter.material) {
          where.material = { contains: filter.material };
        }
        if (filter.color) {
          where.color = { contains: filter.color };
        }
        if (filter.style) {
          where.style = { contains: filter.style };
        }
        if (filter.search) {
          where.OR = [
            { name: { contains: filter.search } },
            { description: { contains: filter.search } },
            { material: { contains: filter.search } },
            { color: { contains: filter.search } },
            { style: { contains: filter.search } },
          ];
        }
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
      
      if (sort) {
        const direction = sort.direction.toLowerCase() as 'asc' | 'desc';
        switch (sort.field) {
          case 'NAME':
            orderBy = { name: direction };
            break;
          case 'PRICE':
            orderBy = { price: direction };
            break;
          case 'CREATED_AT':
            orderBy = { createdAt: direction };
            break;
          case 'UPDATED_AT':
            orderBy = { updatedAt: direction };
            break;
          case 'AVERAGE_RATING':
            orderBy = { averageRating: direction };
            break;
          case 'STOCK':
            orderBy = { stock: direction };
            break;
          default:
            orderBy = { createdAt: 'desc' };
        }
      }

      const skip = after ? parseInt(Buffer.from(after, 'base64').toString()) : 0;
      const take = first || 10;

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            category: true,
            ratings: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      const edges = (products as unknown as ProductWithRelations[]).map((product, index) => ({
        node: product as unknown as ProductWithRelations,
        cursor: Buffer.from((skip + index).toString()).toString('base64'),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage: skip + take < totalCount,
          hasPreviousPage: skip > 0,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        totalCount,
      };
    },

    productsByCategory: async (_: unknown, { categoryId }: { categoryId: string }): Promise<ProductWithRelations[]> => {
      const results = await prisma.product.findMany({
        where: { categoryId: parseInt(categoryId) },
        include: {
          category: true,
          ratings: true,
        },
      });
      return results as unknown as ProductWithRelations[];
    },

    searchProducts: async (_: unknown, { query }: { query: string }): Promise<ProductWithRelations[]> => {
      const results = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { material: { contains: query } },
            { color: { contains: query } },
            { style: { contains: query } },
          ],
        },
        include: {
          category: true,
          ratings: true,
        },
      });
      return results as unknown as ProductWithRelations[];
    },
  },

  Mutation: {
    createProduct: async (_: unknown, { input }: { input: ProductInput }): Promise<ProductWithRelations> => {
      const { categoryId, ...productData } = input;
      const product = await prisma.product.create({
        data: {
          ...productData,
          categoryId: parseInt(categoryId),
        },
        include: {
          category: true,
          ratings: true,
        },
      });
      return product as unknown as ProductWithRelations;
    },

    updateProduct: async (
      _: unknown,
      { id, input }: { id: string; input: ProductUpdateInput & { featureImage?: string | null } }
    ): Promise<ProductWithRelations> => {
      const data: Prisma.ProductUpdateInput = {};
      
      // Copy all properties except categoryId
      if (input.name !== undefined) data.name = input.name;
      if (input.description !== undefined) data.description = input.description;
      if (input.price !== undefined) data.price = input.price;
      if (input.discount !== undefined) data.discount = input.discount;
      if (input.discountType !== undefined) (data as Record<string, unknown>)['discountType'] = input.discountType;
      if (input.sku !== undefined) data.sku = input.sku;
      if (input.stock !== undefined) data.stock = input.stock;
      {
        const rec = input as unknown as Record<string, unknown>;
        if ('featureImage' in rec) {
          const fe = rec['featureImage'] as string | null | undefined;
          // Assign via indexer to avoid type complaint in generated Prisma types
          (data as Record<string, unknown>)['featureImage'] = fe as string | null | undefined;
        }
        if ('images' in rec) {
          const imgs = rec['images'] as Prisma.InputJsonValue | null | undefined;
          if (imgs !== null && imgs !== undefined) {
            data.images = imgs as Prisma.InputJsonValue;
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
        const newCategoryId = parseInt((input as any).categoryId);
        if (!Number.isNaN(newCategoryId)) {
          (data as Prisma.ProductUpdateInput).category = { connect: { id: newCategoryId } };
        }
      }

      const updated = await prisma.product.update({
        where: { id: parseInt(id) },
        data,
        include: {
          category: true,
          ratings: true,
        },
      });
      return updated as unknown as ProductWithRelations;
    },

    deleteProduct: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });
      return true;
    },

    toggleProductStatus: async (_: unknown, { id }: { id: string }): Promise<ProductWithRelations> => {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const updated = await prisma.product.update({
        where: { id: parseInt(id) },
        data: { isActive: !product.isActive },
        include: {
          category: true,
          ratings: true,
        },
      });
      return updated as unknown as ProductWithRelations;
    },
  },

  Product: {
    category: async (parent: ProductWithRelations) => {
      if (parent.category) return parent.category;
      return await prisma.category.findUnique({
        where: { id: parent.categoryId },
      });
    },

    ratings: async (parent: ProductWithRelations) => {
      if (parent.ratings) return parent.ratings;
      return await prisma.rating.findMany({
        where: { productId: parent.id },
      });
    },
  },
};