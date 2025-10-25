import './App.css'
import {AuthProvider} from "@/provider/AuthProvider.tsx";
import {UserProvider} from "@/provider/UserProvider.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router";
import HomePage from "@/page/HomePage.tsx";
import Layout from "@/Layout.tsx";
import LoginPage from "@/page/LoginPage.tsx";
import SignupPage from "@/page/SignupPage.tsx";
import CalendarPage from "@/page/CalendarPage.tsx";
import PlatoonPage from "@/page/PlatoonPage.tsx";
import TaskPage from "@/page/TaskPage.tsx";

function App() {

    return (
        <AuthProvider>
            <UserProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path={"/"} element={<HomePage/>}/>
                            <Route path={"/Calendar"} element={<CalendarPage/>}/>
                            <Route path={"/Login"} element={<LoginPage/>}/>
                            <Route path={"/Signup"} element={<SignupPage/>}/>
                            <Route path={"/Platoon"} element={<PlatoonPage/>}/>
                            <Route path={"/Tasks"} element={<TaskPage/>}/>
                        </Routes>
                    </Layout>
                </Router>
            </UserProvider>
        </AuthProvider>
    )
}

export default App
