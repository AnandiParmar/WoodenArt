import { gql } from 'graphql-tag';

export const cartSchema = gql`
  type CartItemView {
    productId: ID!
    productName: String!
    productImage: String
    price: Decimal!
    discount: Decimal
    quantity: Int!
    stock: Int!
  }

  type CartItemQuantity {
    productId: ID!
    quantity: Int!
  }

  extend type Query {
    myCart: [CartItemView!]!
  }

  extend type Mutation {
    addToCart(productId: ID!, quantity: Int): CartItemQuantity!
    updateCartItem(productId: ID!, quantity: Int!): CartItemQuantity!
    removeFromCart(productId: ID!): Boolean!
  }
`;


