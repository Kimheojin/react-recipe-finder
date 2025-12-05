import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppRoutes } from "./router";

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <div className="min-h-screen w-full px-4 pb-12 pt-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1290px] flex-col gap-8">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
