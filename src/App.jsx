import { useState } from 'react'
import './App.css'
import { RoleLogin } from './components/RoleLogin.jsx'
import { ElectricalAdminPanel } from './pages/ElectricalAdminPanel.jsx'
import { ElectricianPanel } from './pages/ElectricianPanel.jsx'
import { SystemAdminPanel } from './pages/SystemAdminPanel.jsx'
import { getRoleKey, login } from './services/authService.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loginMessage, setLoginMessage] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginMessage('')

    const formData = new FormData(event.currentTarget)
    const usuario = formData.get('username')
    const password = formData.get('password')

    if (!usuario || !password) {
      setLoginMessage('Ingresa usuario y contrasena para continuar.')
      return
    }

    try {
      const user = await login({ usuario, password })
      setUserRole(getRoleKey(user.idRol))
      setIsAuthenticated(true)
    } catch {
      setLoginMessage('Usuario o contrasena incorrectos, o el backend no esta disponible.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
  }

  if (!isAuthenticated) {
    return <RoleLogin message={loginMessage} onSubmit={handleLogin} />
  }

  if (userRole === 'electrician') {
    return <ElectricianPanel onLogout={handleLogout} />
  }

  if (userRole === 'systemAdmin') {
    return <SystemAdminPanel onLogout={handleLogout} />
  }

  return <ElectricalAdminPanel onLogout={handleLogout} />
}

export default App
