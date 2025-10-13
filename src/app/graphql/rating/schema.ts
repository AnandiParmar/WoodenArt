import { gql } from 'graphql-tag';

export const ratingSchema = gql`
  input RatingInput {
    productId: ID!
    userId: ID!
    rating: Int!
    review: String
  }

  input RatingUpdateInput {
    rating: Int
    review: String
  }

  input RatingFilterInput {
    productId: ID
    userId: ID
    minRating: Int
    maxRating: Int
    hasReview: Boolean
  }

  input RatingSortInput {
    field: RatingSortField!
    direction: SortDirection!
  }

  enum RatingSortField {
    RATING
    CREATED_AT
    UPDATED_AT
  }

  type RatingConnection {
    edges: [RatingEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type RatingEdge {
    node: Rating!
    cursor: String!
  }

  extend type Query {
    rating(id: ID!): Rating
    ratings(
      filter: RatingFilterInput
      sort: RatingSortInput
      first: Int
      after: String
      last: Int
      before: String
    ): RatingConnection!
    ratingsByProduct(productId: ID!): [Rating!]!
    ratingsByUser(userId: ID!): [Rating!]!
    averageRating(productId: ID!): Float!
  }

  extend type Mutation {
    createRating(input: RatingInput!): Rating!
    updateRating(id: ID!, input: RatingUpdateInput!): Rating!
    deleteRating(id: ID!): Boolean!
  }
`;