import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { persistor, store } from "./redux/store/store";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
    >
      <ToastContainer />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
