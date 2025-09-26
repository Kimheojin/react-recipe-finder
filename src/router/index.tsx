import { Routes, Route } from "react-router-dom";
import HomeView from "../views/HomeView";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomeView />} />
        </Routes>
    );
}
