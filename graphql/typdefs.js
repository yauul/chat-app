const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        token: String
        created_at: String!
    }

    type Query {
        getUsers: [User]!
        login(username: String!, password: String!): User!
    }

    type Mutation {
        register(
            username: String!
            email: String!
            password: String!
            confirmPassword: String!
        ): User!
    }
`;
