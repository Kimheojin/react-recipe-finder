import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

function App() {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[1024px] mx-auto">
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;
