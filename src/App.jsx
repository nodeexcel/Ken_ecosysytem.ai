import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import SettingsPage from './pages/Settings'
import Dashboard from './layout/Dashboard'
import { Pricing } from './pages/pricing'
import SetPassword from './pages/createPassword'
import Success from './pages/success'


function App() {

  return (
    <div className='h-screen'>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/create-password' element={<SetPassword />} />
      <Route path='/dashboard' element={<Dashboard><SettingsPage /></Dashboard>} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/success' element={<Success />} />
    </Routes>
    </div>
  )
}

export default App
