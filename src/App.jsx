import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import SettingsPage from './pages/Settings'
import Dashboard from './layout/Dashboard'
import SetPassword from './pages/createPassword'
import Success from './pages/success'
import PaymentFailed from './pages/failure'
import ResetPassword from './pages/ResetPassword'
import PricingPage from './pages/Pricing'


function App() {

  return (
    <div className='h-screen'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/create-password' element={<SetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/dashboard' element={<Dashboard><SettingsPage /></Dashboard>} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<PaymentFailed />} />
      </Routes>
    </div>
  )
}

export default App
