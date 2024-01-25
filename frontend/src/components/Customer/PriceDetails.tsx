import { User } from "../../context/user";

const PriceDetails = ({ user }: { user: User }) => {
    return (
        <div className="price-details">
            <h2>Price Details:</h2>
            <h4>Coverages:</h4>
            {!!user.selectedCoverages.length ? (
                user.selectedCoverages.map(coverage => (
                    <div key={coverage.shortname}>
                        <p>{coverage.name}</p>
                        <p>{coverage.calculatedPrice.toFixed(2)} EUR</p>
                    </div>
                ))
            ) : <h5>No coverages selected...</h5>}
            <h4>Discounts:</h4>
            {!!user.selectedDiscounts.length ? ( user.selectedDiscounts.map(discount => (
                <div key={discount.shortname}>
                    <p>{discount.name}</p>
                    <p>{discount.calculatedPrice.toFixed(2)} EUR</p>
                </div>
            ))
            ) : <h5>No discounts selected...</h5>}

            <h5>Total price: {user.totalPrice.toFixed(2)} EUR</h5>
        </div>
    )
}

export default PriceDetails;