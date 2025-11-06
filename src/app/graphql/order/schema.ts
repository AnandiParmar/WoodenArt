import { gql } from 'graphql-tag';

export const orderSchema = gql`
  type OrderItemView {
    id: ID!
    productId: Int!
    productName: String!
    productImage: String
    quantity: Int!
    price: Decimal!
  }

  type OrderSummary {
    id: ID!
    orderNumber: String!
    status: String!
    totalAmount: Decimal!
    createdAt: DateTime!
    items: [OrderItemView!]!
  }

  type OrderStatusUpdate {
    id: ID!
    status: String!
  }

  extend type Query {
    myOrders: [OrderSummary!]!
    allOrders: [OrderSummary!]!
  }

  input ShippingInput {
    address: String!
    city: String!
    state: String!
    zip: String!
    phone: String!
    paymentMethod: String
    notes: String
  }

  extend type Mutation {
    createOrder(shipping: ShippingInput!): OrderSummary!
    updateOrderStatus(orderId: ID!, status: String!): OrderStatusUpdate!
  }
`;


