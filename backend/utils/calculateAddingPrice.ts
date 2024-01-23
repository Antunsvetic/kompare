export function calculateAddingPrice(isPercentage: boolean, value: number, basePrice: number) {
    return isPercentage ? basePrice * (value/100) : value
}