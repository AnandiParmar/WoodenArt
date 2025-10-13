import { gql } from 'graphql-tag';

export const userSchema = gql`
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

  type AuthResponse {
    user: User!
    token: String!
    refreshToken: String!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type UserEdge {
    node: User!
    cursor: String!
  }

  input CreateUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: UserRole
    isActive: Boolean
  }

  input UpdateUserInput {
    id: ID!
    email: String
    firstName: String
    lastName: String
    password: String
    role: UserRole
    isActive: Boolean
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input UsersFilter {
    search: String
    role: UserRole
    isActive: Boolean
  }

  input UsersSort {
    field: String!
    direction: SortDirection!
  }

  extend type Query {
    me: User
    users(
      first: Int
      after: String
      filter: UsersFilter
      sort: UsersSort
    ): UserConnection!
    user(id: ID!): User
  }

  extend type Mutation {
    login(input: LoginInput!): AuthResponse!
    register(input: RegisterInput!): AuthResponse!
    refreshToken(refreshToken: String!): RefreshResponse!
    logout: Boolean!
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }

  type RefreshResponse {
    token: String!
  }
`;
