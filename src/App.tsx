import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full px-4 pb-12 pt-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1290px] flex-col gap-8">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
