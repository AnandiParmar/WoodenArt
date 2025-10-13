import { gql } from 'graphql-tag';

export const categorySchema = gql`
  input CategoryInput {
    name: String!
    description: String
  }

  input CategoryUpdateInput {
    name: String
    description: String
  }

  extend type Query {
    category(id: ID!): Category
    categories: [Category!]!
    categoryWithProducts(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;