import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import Header from "./components/header";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="app-container">
            <Header />
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
            <Footer />
        </div>
    );
}

export default App;
