import { gql } from 'graphql-tag';

export const sharedTypes = gql`
  scalar DateTime
  scalar Decimal
  scalar JSON

  type Product {
    id: ID!
    name: String!
    description: String
    price: Decimal!
    discount: Decimal
    sku: String
    stock: Int!
    featureImage: String
    images: JSON
    material: String
    color: String
    specialFeature: String
    style: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    categoryId: ID!
    category: Category
    averageRating: Float!
    totalRatings: Int!
    ratings: [Rating!]!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [Product!]!
  }

  type Rating {
    id: ID!
    productId: ID!
    product: Product
    userId: ID!
    user: User
    rating: Int!
    review: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum UserRole {
    USER
    ADMIN
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  enum SortDirection {
    ASC
    DESC
  }
`;
