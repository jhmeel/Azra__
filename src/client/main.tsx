import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store.ts";
import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
import { Toaster } from "sonner";
import App from "./src/App";
import React from "react";
import ReactDOM from "react-dom/client";
import { SocketContextProvider } from "./src/socketContext.tsx";
import "./src/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster position="top-right" closeButton={true} />
        <Router>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
