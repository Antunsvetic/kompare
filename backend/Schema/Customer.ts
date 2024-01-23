import { Schema, model } from 'mongoose';
import { IConfiguration } from './Configuration';

interface IPriceDetails {
    configType: string
    configName: string
    configPrice: number
} 

interface ICreateCustomer {
    name: string
    age: number
    city: string
    vehiclePower: number
    voucher: number,
    selectedDiscounts: IConfiguration[]
}

interface ICustomer {
    name: string
    age: number
    city: String
    vehiclePower: number
    voucher: number
    basePrice: number
    totalPrice: number
    selectedCoverages: IConfiguration[]
    selectedDiscounts: IConfiguration[]
}

const CustomerSchema = new Schema<ICustomer>({
    name: String,
    age: Number,
    city: String,
    vehiclePower: Number,
    voucher: Number,
    basePrice: Number,
    totalPrice: Number,
    selectedCoverages: Array,
    selectedDiscounts: Array
});

const Customer = model<ICustomer>('Customer', CustomerSchema);

export { Customer, ICustomer, ICreateCustomer, IPriceDetails }
