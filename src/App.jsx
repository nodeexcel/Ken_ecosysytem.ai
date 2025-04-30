import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Dashboard from './layout/Dashboard'
import SetPassword from './pages/createPassword'
import Success from './pages/success'
import PaymentFailed from './pages/failure'
import ResetPassword from './pages/ResetPassword'
import PricingPage from './pages/Pricing'
import SettingsPage from './pages/Dashboard/Settings'
import Home from './pages/Dashboard/Home'
import AcceptInvitation from './pages/acceptInvite'


function App() {

  return (
    <div className='h-screen'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/create-password' element={<SetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<PaymentFailed />} />
        <Route path='/accept-invite' element={<AcceptInvitation />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
