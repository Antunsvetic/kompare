import { useReducer, useEffect } from "react";
import { User, useUser } from "../../context/user";
import { useMutation } from "@apollo/client";
import { UPDATE_CONFIG } from "../../graphql/graphqlQueries";
import { Loader } from "semantic-ui-react";

interface Discounts {
    com: boolean,
    adviser: boolean,
    vip: boolean,
    strong: boolean,
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
                com: checkActivity(user, 'com-disc'),
                adviser: checkActivity(user, 'adviser'),
                vip: checkActivity(user, 'vip'),
                strong: checkActivity(user, 'strong')
            }
        }
    }
}

function checkActivity(user: User | null, type: string) {
    return Boolean(user?.selectedDiscounts?.some(value => value.shortname === type));
}

const SideBar = () => {
    const { user, setUser } = useUser();
    const [updateConfig, { loading, error }] = useMutation(UPDATE_CONFIG);
    const wrappedReducer = (state: Discounts, action: Actions) => reducer(state, action, user);
    const [state, dispatch] = useReducer(wrappedReducer, {
        com: false,
        adviser: false,
        vip: false,
        strong: false,
    })
    useEffect(() => dispatch({ type: 'check' }), [user])

    if (loading) return <Loader />
    if (!user) {
        return (
            <div className="sidebar">
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
        .then(x => setCustomer(x.data.toggleConfig))
        .catch(err => {
            console.error('Failed to update configuration:', err);
        });
    }
    const setCustomer = (data: User) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
    }

    return (
        <div className="sidebar">
            <h1>Sidebar</h1>
            {error && <h4 style={{ color: "red" }}>{error.message}</h4>}
            <button
                style={state.com ? styles.isOn : styles.isOff}
                onClick={() => handleConfigUpdate("com-disc")}
            >
                Commercial
            </button>
            <button
                style={state.adviser ? styles.isOn : styles.isOff}
                onClick={() => handleConfigUpdate('adviser')}
            >
                Adviser
            </button>
            <button
                style={state.vip ? styles.isOn : styles.isOff}
                onClick={() => handleConfigUpdate("vip")}
            >
                VIP
            </button>
            <button
                disabled
                style={state.strong ? styles.isOn : styles.isOff}
                onClick={() => handleConfigUpdate("strong")}
            >
                Strong car
            </button>
        </div>
    )
}

export default SideBar;