import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import SettingsPage from './pages/Settings'
import Sidebar from './components/Sidebar'
import Dashboard from './layout/Dashboard'

function App() {

  return (
    <div className='h-screen'>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard><SettingsPage /></Dashboard>} />
    </Routes>
    </div>
  )
}

export default App
