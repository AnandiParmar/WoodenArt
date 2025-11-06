import { gql } from 'graphql-tag';

export const wishlistSchema = gql`
  type WishlistItemView {
    productId: ID!
    productName: String!
    productImage: String
    price: Decimal!
    discount: Decimal
    stock: Int!
  }

  extend type Query {
    myWishlist: [WishlistItemView!]!
  }

  extend type Mutation {
    addToWishlist(productId: ID!): Boolean!
    removeFromWishlist(productId: ID!): Boolean!
  }
`;


