import { Schema, model } from 'mongoose';

interface IConfiguration {
    id: Schema.Types.ObjectId
    type: string
    shortname: string
    name: string
    value: number
    isPercentage: boolean
    calculatedPrice: number
}

const ConfigurationSchema = new Schema<IConfiguration>({
    type: String,
    name: String,
    shortname: String,
    value: Number,
    isPercentage: Boolean,
    calculatedPrice: Number
});

const Configuration = model<IConfiguration>('Configuration', ConfigurationSchema);

export { Configuration, IConfiguration };
