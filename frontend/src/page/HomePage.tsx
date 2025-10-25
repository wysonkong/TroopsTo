import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import {useAuth} from "@/provider/AuthProvider.tsx";


const HomePage = () => {
    const {isLoggedIn} = useAuth();

    return (

        <div className={"bg-cover h-screen flex items-center justify-center"}>
            <div className={"rounded-lg text-center text-white opacity-75"}>
                <h1 className={"text-6xl font-bold mb-4 text-primary"}>Platoon Troops To Task</h1>
                <p className={"text-xl text-background-foreground mb-4"}>Track your platoon</p>
                <div className={"flex flex-wrap items-center justify-center gap-2 mb-32"}>
                    <Button asChild className={"bg-primary"}>
                        <Link to={isLoggedIn ? "/Tasks" : "/Login"} className={"text-primary-foreground"}>Get Started</Link>
                    </Button>
                </div>
            </div>

        </div>

    );
};

export default HomePage;