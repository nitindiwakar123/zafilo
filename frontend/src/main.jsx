import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import store from './store/store.js';
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { config } from './config/config.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <GoogleOAuthProvider clientId={config.googleClientId}>
       <App />
     </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
