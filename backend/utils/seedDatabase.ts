import { City } from '../Schema/City';
import { Configuration } from '../Schema/Configuration';

async function seedDatabase(): Promise<void> {
   const isCitiesEmpty = await City.countDocuments().exec();
   if (isCitiesEmpty === 0) {
       const cities = [
           { name: 'Vinkovci', basePrice: 1000 },
           { name: 'Zagreb', basePrice: 1200 },
           { name: 'Rijeka', basePrice: 800 },
       ];
       await City.insertMany(cities);
       console.log('Cities seeded successfully!');
   }

   const isConfigurationsEmpty = await Configuration.countDocuments().exec();
   if (isConfigurationsEmpty === 0) {
       const coverages = [
           { type: 'coverage', shortname: "bonus", name: 'Bonus Protection', value: 12, isPercentage: true, calculatedPrice: 0 },
           { type: 'coverage', shortname: "ao+", name: 'AO+', value: 55, isPercentage: false, calculatedPrice: 0 },
           {  type: 'coverage', shortname: "glass", name: 'Glass protection', value: 80, isPercentage: true, calculatedPrice: 0 },
       ];
       const discounts = [
           { type: 'discount', shortname: "com-disc", name: 'Commercial discount', value: 10, isPercentage: true, calculatedPrice: 0 },
           { type: 'discount', shortname: "adviser", name: 'Adviser discount', value: 20, isPercentage: true, calculatedPrice: 0 },
           { type: 'discount', shortname: "vip", name: 'VIP discount', value: 5, isPercentage: true, calculatedPrice: 0 },
           { type: 'discount', shortname: "strong", name: 'Strong car surcharge', value: 10, isPercentage: true, calculatedPrice: 0 },
       ];
       await Configuration.insertMany([...coverages, ...discounts]);
       console.log('Configuration seeded successfully!');
   }
}

export default seedDatabase;
