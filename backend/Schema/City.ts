import { Schema, model } from "mongoose";

interface ICity {
 name: string;
 basePrice: number;
}

const CitySchema = new Schema<ICity>({
 name: String,
 basePrice: Number,
});

const City = model<ICity>('City', CitySchema);

export { City, ICity };
