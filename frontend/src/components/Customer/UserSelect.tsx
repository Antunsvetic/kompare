import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_CUSTOMERS, GET_CUSTOMER } from "../../graphql/graphqlQueries";
import { Loader } from "semantic-ui-react";
import { User } from "../../context/user";

type Customer = {
    id: string,
    name: string
}

type SetUser = (user: User | null) => void;

const UserSelect = ({ user, setUser } : { user: User | null, setUser: SetUser }) => {
    const { data, loading } = useQuery(GET_ALL_CUSTOMERS)
    const [fetchCustomer, { loading: customerLoading }] = useLazyQuery(GET_CUSTOMER)

    if (loading || customerLoading) return <Loader />

    const handleUserChange = async (customerId: string) => {
        if(customerId === "none") {
            deleteUser()
            return;
        }
        fetchCustomer({
            variables: {id: customerId}
        })
        .then(x => setCustomer(x.data.getCustomer))
    }

    const setCustomer = (user: User) => {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const deleteUser = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <div className="user-select-container">
            <select onChange={(e) => handleUserChange(e.target.value)}>
                <option value="none">Select user</option>
                {data?.getAllCustomers?.map((customer: Customer) => (
                    <option key={customer.id} selected={customer.id === user?.id} value={customer.id}>{customer.name}</option>
                ))}
            </select>
            {user && <button onClick={deleteUser}>Add new user</button>}
        </div>
    )
}

export default UserSelect;