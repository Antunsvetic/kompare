import gql from 'graphql-tag';

export default gql`
    type Customer {
        id: ID!
        name: String!
        age: Int!
        city: String
        vehiclePower: Int!
        voucher: Float
        basePrice: Float!
        totalPrice: Float!
        selectedCoverages: [Configuration]
        selectedDiscounts: [Configuration]
    }

    type CustomerShort {
        id: ID!
        name: String!
    }

    type PriceDetailsConfig {
        configType: String
        configName: String
        configPrice: Float
    }
   
    type Configuration {
        id: ID!
        type: String!
        name: String!
        shortname: String!
        value: Float!
        isPercentage: Boolean!
        calculatedPrice: Float
    }
       
    type City {
        id: ID!
        name: String!
        basePrice: Float!
    }

    input ConfigInput {
        id: ID!
        type: String!
        name: String!
        value: Float!
        isPercentage: Boolean!
    }

    input CustomerInput {
        name: String!
        age: Int!
        city: String
        vehiclePower: Int!
        voucher: Float
    }

    type Query {
        getCustomer(id: ID!): Customer!
        getAllCustomers: [CustomerShort!]
        getConfigurations: [Configuration!]!
        getCities: [City!]!
        getPriceDetails(id: ID!): [PriceDetailsConfig]
    }

    type Mutation {
        createCustomer(customerInput: CustomerInput!): Customer!
        toggleConfig(customerId: ID!, configShortname: String): Customer!
    }
`;