import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GlobalStateProvider } from "./hooks/useGlobalState.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GlobalStateProvider>
            <App />
        </GlobalStateProvider>
    </StrictMode>
);
