import { gql } from "@apollo/client";

export const GET_CITIES = gql`
    query GetCities {
        getCities {
            name
        }
    }
`;

export const GET_CUSTOMER = gql`
    query GetCustomer($id: ID!) {
        getCustomer(id: $id) {
            id
            name
            age
            city
            vehiclePower
            voucher
            basePrice
            totalPrice
            selectedCoverages {
                type
                name
                shortname
                value
                isPercentage
                calculatedPrice
            }
            selectedDiscounts {
                type
                name
                shortname
                value
                isPercentage
                calculatedPrice
            }
        }
    }
`;

export const GET_ALL_CUSTOMERS = gql`
    query GetAllCustomers {
        getAllCustomers {
            id
            name
        }
    }
`;

export const CREATE_CUSTOMER = gql`
    mutation CreateCustomer($customerInput: CustomerInput!) {
        createCustomer(customerInput: $customerInput) {
            id
            name
            age
            city
            vehiclePower
            voucher
            basePrice
            totalPrice
            selectedCoverages {
                type
                name
                value
                isPercentage
            }
            selectedDiscounts {
                type
                name
                value
                isPercentage
                calculatedPrice
            }
        }
    }
`;

export const UPDATE_CONFIG = gql`
    mutation ToggleConfig($customerId: ID!, $configShortname: String) {
        toggleConfig(customerId: $customerId, configShortname: $configShortname) {
            id
            name
            age
            city
            vehiclePower
            voucher
            basePrice
            totalPrice
            selectedCoverages {
                type
                name
                value
                isPercentage
                calculatedPrice
                shortname
            }
            selectedDiscounts {
                type
                name
                value
                isPercentage
                calculatedPrice
                shortname
            }
        }
    }
`;
