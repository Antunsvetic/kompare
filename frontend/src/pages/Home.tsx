import CustomerForm from "../components/Customer/Form";
import PriceDetails from "../components/Customer/PriceDetails";
import UserSelect from "../components/Customer/UserSelect";
import { useUser } from "../context/user";
import SideBar from "../components/SideBar/SideBar";

const Home = () => {
    const { user, setUser } = useUser();

    return (
        <>
            <div className="home">
                <SideBar />
                <UserSelect user={user} setUser={setUser} />
                {!user && <CustomerForm setUser={setUser} />}
                {user && <PriceDetails user={user} />}
            </div>
        </>
    );
}

export default Home;