import "reflect-metadata";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                body: { value: '"MaruBuri", Arial, sans-serif' },
                heading: { value: '"MaruBuri", Arial, sans-serif' },
            },
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ChakraProvider value={system}>
            <App />
        </ChakraProvider>
    </StrictMode>
);
