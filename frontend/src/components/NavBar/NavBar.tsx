import { useReducer, useEffect } from "react";
import { User, useUser } from "../../context/user";
import { useMutation } from "@apollo/client";
import { UPDATE_CONFIG } from "../../graphql/graphqlQueries";
import { DimmerDimmable, Loader } from "semantic-ui-react";

interface Coverages {
    bonus: boolean,
    ao: boolean,
    glass: boolean
}

type Actions = {
    type: "check"
}

const styles: { [key: string]: React.CSSProperties } = {
    isOn: {
        backgroundColor: "grey",
        color: "white",
        marginRight: 10
    },
    isOff: {
        backgroundColor: "white",
        color: "black",
        border: "1px solid grey",
        marginRight: 10
    }
};

function reducer(_: unknown, action: Actions, user: User | null) {
    const { type } = action;

    switch (type) {
        case 'check': {
            return {
                bonus: checkActivity(user, 'bonus'),
                ao: checkActivity(user, 'ao+'),
                glass: checkActivity(user, 'glass')
            }
        }
    }
}

function checkActivity(user: User | null, type: string) {
    return Boolean(user?.selectedCoverages?.some(value => value.shortname === type));
}

const NavBar = () => {
    const { user, setUser } = useUser();
    const [updateConfig, { loading }] = useMutation(UPDATE_CONFIG);
    const wrappedReducer = (state: Coverages, action: Actions) => reducer(state, action, user);
    const [state, dispatch] = useReducer(wrappedReducer, {
        bonus: false,
        ao: false,
        glass: false
    })
    useEffect(() => dispatch({ type: 'check' }), [user])

    if (loading) {
        return (
            <div className="navbar">
                <Loader />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="navbar">
                <h3>No customer selected...</h3>
            </div>
        )
    }

    const handleConfigUpdate = (value: string) => {
        updateConfig({
            variables: {
                customerId: user.id,
                configShortname: value
            }
        })
            .then(x => {
                setCustomer(x.data.toggleConfig)
            })
    }
    const setCustomer = (data: User) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
    }

    return (
        <div className="navbar">
            <h2>NAVBAR and user: {user.name}</h2>
            <div className="navbar-content">
                <div>
                    <button
                        style={state.bonus ? styles.isOn : styles.isOff}
                        onClick={() => handleConfigUpdate("bonus")}
                    >
                        Bonus
                    </button>
                    <button
                        style={state.ao ? styles.isOn : styles.isOff}
                        onClick={() => handleConfigUpdate('ao+')}
                    >
                        Ao+
                    </button>
                    <button
                        style={state.glass ? styles.isOn : styles.isOff}
                        onClick={() => handleConfigUpdate("glass")}
                    >
                        Glass
                    </button>
                </div>

                <h2>Total price: {user.totalPrice.toFixed(2)} EUR</h2>
            </div>
        </div>
    )
}

export default NavBar;