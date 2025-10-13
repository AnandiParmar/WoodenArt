import { gql } from 'graphql-tag';

export const productSchema = gql`
  input ProductInput {
    name: String!
    description: String
    price: Decimal!
    discount: Decimal
    sku: String
    stock: Int = 0
    featureImage: String
    images: JSON
    material: String
    color: String
    specialFeature: String
    style: String
    isActive: Boolean = true
    categoryId: ID!
  }

  input ProductUpdateInput {
    name: String
    description: String
    price: Decimal
    discount: Decimal
    sku: String
    stock: Int
    featureImage: String
    images: JSON
    material: String
    color: String
    specialFeature: String
    style: String
    isActive: Boolean
    categoryId: ID
  }

  input ProductFilterInput {
    categoryId: ID
    isActive: Boolean
    minPrice: Decimal
    maxPrice: Decimal
    material: String
    color: String
    style: String
    search: String
  }

  input ProductSortInput {
    field: ProductSortField!
    direction: SortDirection!
  }

  enum ProductSortField {
    NAME
    PRICE
    CREATED_AT
    UPDATED_AT
    AVERAGE_RATING
    STOCK
  }

  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  extend type Query {
    # Product queries
    product(id: ID!): Product
    products(
      filter: ProductFilterInput
      sort: ProductSortInput
      first: Int
      after: String
      last: Int
      before: String
    ): ProductConnection!
    productsByCategory(categoryId: ID!): [Product!]!
    searchProducts(query: String!): [Product!]!
  }

  extend type Mutation {
    # Product mutations
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
    deleteProduct(id: ID!): Boolean!
    toggleProductStatus(id: ID!): Product!
  }
`;