import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n';
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import store from './store/index.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_GOOGLE_CALENDER_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    </Provider>
  </GoogleOAuthProvider>
)
