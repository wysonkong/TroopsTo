import {render, screen} from "@testing-library/react";
import {describe, it, expect} from "vitest";
import Navbar from "@/components/Navbar.tsx";
import {MemoryRouter} from "react-router-dom";
import {AuthProvider} from "@/provider/AuthProvider.tsx";
import {UserProvider} from "@/provider/UserProvider.tsx";

beforeEach(() => {
    localStorage.clear();
});

// const setLoggedInUser = (userId = "1", sessionId = "abc123") => {
//     localStorage.setItem("userId", userId);
//     localStorage.setItem("sessionId", sessionId);
// };

const setLoggedOutUser = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionId");
};


const renderNavbar = () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <UserProvider>
                    <Navbar />
                </UserProvider>
            </AuthProvider>
        </MemoryRouter>
    );
};

describe("Navbar", () => {

    it("should show Home link", () => {
        renderNavbar();
        expect(screen.getByText(/home/i)).toBeInTheDocument();
    });

    describe("Navbar with real providers", () => {
        it("shows Login/Sign Up when logged out", () => {
            setLoggedOutUser();
            renderNavbar();

            expect(screen.getByText(/log in/i)).toBeInTheDocument();
            expect(screen.getByText(/sign up/i)).toBeInTheDocument();
            expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
        });

    });

});
