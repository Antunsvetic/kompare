import { ObjectId } from 'mongoose';
import { ApolloError } from 'apollo-server-express';
import { Customer, ICustomer, IPriceDetails } from '../../Schema/Customer';
import { Configuration, IConfiguration } from '../../Schema/Configuration';
import { City, ICity } from '../../Schema/City';
import { calculateAddingPrice } from '../../utils/calculateAddingPrice';

const Query = {
    getCustomer: async (_: unknown, { id }: { id: ObjectId }): Promise<ICustomer> => {
        const customer = await Customer.findById(id);
        if (!customer) {
            throw new ApolloError(`Customer is not found.`);
        }

        return customer;
    },
    getAllCustomers: async (): Promise<ICustomer[]> => {
        const customers = await Customer.find();
        if (!customers) {
            throw new ApolloError(`Customer is not found.`);
        }

        return customers;
    },
    getConfigurations: async (): Promise<IConfiguration[]> => {
        const configurations = await Configuration.find();
        if (!configurations) {
            throw new ApolloError('No configurations in database!')
        }

        return configurations;
    },
    getCities: async (): Promise<ICity[]> => {
        const cities = await City.find();
        if (!cities) {
            throw new ApolloError(`Customer is not found.`);
        }

        return cities;
    },
    getPriceDetails: async (_: unknown, { id } : { id: ObjectId }): Promise<IPriceDetails[]> => {
        const customer = await Customer.findById(id)
        if (!customer) {
            throw new ApolloError(`Customer is not found.`);
        }

        const detailsArray: IPriceDetails[] = [];
        customer.selectedCoverages.map(item => detailsArray.push({
            configType: item.type,
            configName: item.name,
            configPrice: item.calculatedPrice
        }))
        customer.selectedDiscounts.map(item => detailsArray.push({
            configType: item.type,
            configName: item.name,
            configPrice: item.calculatedPrice
        }))

        return detailsArray;
    }
};

const Mutation = {
    createCustomer: async (_: unknown, { customerInput } : { customerInput: ICustomer }): Promise<ICustomer> => {
        const [city, discount] = await Promise.all([
            City.findOne({ name: customerInput.city }),
            Configuration.findOne({ shortname: "strong" })
        ])

        if (!city) throw new ApolloError("No cities found in database!")
        if (!discount) throw new ApolloError("Configuration not found!")

        const basePrice = city.basePrice + (customerInput.age * 2)
        const surchargeCheck = customerInput.vehiclePower > 100
        const calculateTotalPrice = surchargeCheck ? (discount.value / 100) + basePrice : basePrice
        const newCalculatedPrice = basePrice * (discount.value / 100)
        discount["calculatedPrice"] = newCalculatedPrice;

        const newObject = {
            ...customerInput,
            basePrice,
            totalPrice: calculateTotalPrice + customerInput.voucher,
            selectedDiscounts: surchargeCheck ? [discount] : [],
        }

        const newCustomer = new Customer(newObject);
        await newCustomer.save();
        return newCustomer;
    },
    toggleConfig: async (_: unknown, args: { customerId: ObjectId, configShortname: string }): Promise<ICustomer> => {
        const [customer, config] = await Promise.all([
            Customer.findById(args.customerId),
            Configuration.findOne({ shortname: args.configShortname })
        ])
        if (!customer || !config) throw new ApolloError("Customer or config not found!")

        const { isPercentage, value, type, shortname } = config;

        const index = type === "coverage"
            ? customer.selectedCoverages.findIndex(item => item.shortname === shortname)
            : customer.selectedDiscounts.findIndex(item => item.shortname === shortname)

        if (index !== -1) {
            type === "coverage"
                ? customer.selectedCoverages.splice(index, 1)
                : customer.selectedDiscounts.splice(index, 1)
            switch (shortname) {
                case "bonus":
                    customer.totalPrice -=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                case "ao+":
                    customer.totalPrice -= customer.age < 30 ? 55 : 105
                    break;
                case "glass":
                    customer.totalPrice -=
                        calculateAddingPrice(isPercentage, value, customer.vehiclePower)
                    break;
                case "com-disc":
                    customer.totalPrice +=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                case "adviser":
                    customer.totalPrice +=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                case "vip":
                    customer.totalPrice +=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                default:
                    break;
            }
        } else {     
            switch (shortname) {
                case "bonus":
                    customer.totalPrice +=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                    config.calculatedPrice = calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                case "ao+":
                    customer.totalPrice += customer.age < 30 ? 55 : 105
                    config.calculatedPrice = customer.age < 30 ? 55 : 105
                    break;
                case "glass":
                    customer.totalPrice +=
                        calculateAddingPrice(isPercentage, value, customer.vehiclePower)
                    config.calculatedPrice = calculateAddingPrice(isPercentage, value, customer.vehiclePower)
                    break;
                case "com-disc":
                    customer.totalPrice -=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                        config.calculatedPrice = calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                case "adviser":
                    if (customer.selectedCoverages.length > 1) {
                        customer.totalPrice -=
                            calculateAddingPrice(isPercentage, value, customer.basePrice)
                        config.calculatedPrice = calculateAddingPrice(isPercentage, value, customer.basePrice)
                    }
                    break;
                case "vip":
                    customer.totalPrice -=
                        calculateAddingPrice(isPercentage, value, customer.basePrice)
                    config.calculatedPrice = calculateAddingPrice(isPercentage, value, customer.basePrice)
                    break;
                default:
                    break;
            }

            if(type === "coverage") {
                customer.selectedCoverages.push(config)
            } else {
                if (shortname !== "adviser") {
                    customer.selectedDiscounts.push(config)
                } else if (shortname === "adviser" && customer.selectedCoverages.length > 1) {
                    customer.selectedDiscounts.push(config)
                } else {
                    throw new ApolloError("Cannot add adviser discount until 2 coverages are active.")
                }
            }
        }

        await customer.save();
        return customer;
    },
};

export default {
    Query,
    Mutation,
};
