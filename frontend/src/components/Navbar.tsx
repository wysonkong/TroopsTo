import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/provider/AuthProvider.tsx";
import {useUser} from "@/provider/UserProvider.tsx";

const Navbar = () => {
    const {isLoggedIn, logout} = useAuth();
    const {user} = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <NavigationMenu
            className={"fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 rounded-b-lg bg-secondary justify-between"}
        >
            <NavigationMenuList className={"flex items-center justify-between px-8 py-3 w-full"}>
                <NavigationMenuItem>
                    <Link to={"/"} className={""}>Home</Link>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList
                className={"flex items-center justify-between px-8 py-3 w-full"}>
                <div className={"ml-auto flex items-center space-x-4"}>
                    {isLoggedIn && user ? (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to={"/Calendar"}
                                            className={"px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"}
                                        >
                                            Calendar
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to={"/Tasks"}
                                            className={"px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"}
                                        >
                                            Tasks
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to="#"
                                            onClick={handleLogout}
                                            className={"px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"}
                                        >
                                            Log Out
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to={"/Platoon"}
                                            className={"px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"}
                                        >
                                            Platoon
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </>
                        ) :
                        (
                            <><NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to={"/Login"}
                                        className={"px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"}
                                    >
                                        Log In
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem><NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to={"/Signup"}
                                        className={"px-3 py-2 rounded-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"}
                                    >
                                        Sign Up
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem></>
                        )}


                </div>
            </NavigationMenuList>
        </NavigationMenu>
    );
};


export default Navbar;