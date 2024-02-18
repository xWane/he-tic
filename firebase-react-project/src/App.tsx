import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "@/redux/store";

function App() {
  return (
    <Provider store={store}>
      <div>
        <ToastContainer stacked newestOnTop limit={3} />
        <Router>
          <Navbar />
          <main className="h-full w-full flex-1 overflow-auto p-4 pt-0">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex-row items-center justify-center gap-x-4">
                    <svg
                      className="animate-spin h-10 w-10 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <h1 className="text-3xl font-bold text-typo-secondary">
                      Loading content...
                    </h1>
                  </div>
                </div>
              }
            >
              <AppRoutes />
            </Suspense>
          </main>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
