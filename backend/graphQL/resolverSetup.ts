import customerResolver from './resolvers/customer';

export default {
    Query: {
        ...customerResolver.Query
    },
    Mutation: {
        ...customerResolver.Mutation,
    }
}