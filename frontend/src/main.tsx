import React from "react";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App';
import {store} from './redux/store/store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')as HTMLElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)