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
import Agents from './pages/Dashboard/Agents'
import Documentation from './pages/Dashboard/Documentation'
import Support from './pages/Dashboard/Support'
import Community from './pages/Dashboard/Community'
import BrainAI from './pages/Dashboard/Brain'
import AppointmentSetter from './pages/Dashboard/AppointmentSetter'
import 'react-datepicker/dist/react-datepicker.css';
import Notification from './pages/Dashboard/Notification'
import Phone from './pages/Dashboard/Phone'



function App() {

  return (
    <div className='h-screen onest'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/create-password' element={<SetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<PaymentFailed />} />
        <Route path='/accept-invite' element={<AcceptInvitation />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='' element={<Home />} />
          <Route path="notification" element={<Notification />} />
          <Route path="agents" element={<Agents />} />
          <Route path="brain" element={<BrainAI />} />
          <Route path="phone" element={<Phone />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="support" element={<Support />} />
          <Route path="community" element={<Community />} />
          <Route path="appointment-setter" element={<AppointmentSetter />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
