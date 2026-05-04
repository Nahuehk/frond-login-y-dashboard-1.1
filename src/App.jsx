import { useState, useEffect } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import PreceptorDashboard from "./pages/preceptordashboard"
import AdminDashboard from "./pages/AdminDashboard"
import DocentesDashboard from "./pages/DocentesDashboard"
import FamiliaDashboard from "./pages/FamiliaDashboard"
import "./App.css"

function App() {
  // --- ESTADOS DE AUTENTICACIÓN ---
  const [token, setToken] = useState("")
  const [rol, setRol] = useState("")
  const [nombre, setNombre] = useState("")

  // --- Al cargar, verificar si hay sesión guardada ---
  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token")
    const savedRol = localStorage.getItem("rol") || sessionStorage.getItem("rol")
    const savedNombre = localStorage.getItem("nombre") || sessionStorage.getItem("nombre")
    if (savedToken && savedRol) {
      setToken(savedToken)
      setRol(savedRol)
      setNombre(savedNombre || "")
    }
  }, [])

  // --- CALLBACK DE LOGIN (recibe datos del componente Login) ---
  const handleLogin = ({ token: t, rol: r, nombre: n, remember }) => {
    setToken(t)
    setRol(r)
    setNombre(n)

    const storage = remember ? localStorage : sessionStorage
    storage.setItem("token", t)
    storage.setItem("rol", r)
    storage.setItem("nombre", n)
  }

  // --- FUNCIÓN DE CIERRE DE SESIÓN ---
  const handleLogout = () => {
    setToken("")
    setRol("")
    setNombre("")
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    localStorage.removeItem("nombre")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("rol")
    sessionStorage.removeItem("nombre")
  }

  // --- REDIRECCIÓN POR ROL ---
  if (token && rol) {
    switch (rol) {
      case "estudiante":
        return <Dashboard onLogout={handleLogout} username={nombre} />
      case "preceptor":
        return <PreceptorDashboard onLogout={handleLogout} username={nombre} />
      case "admin":
        return <AdminDashboard onLogout={handleLogout} username={nombre} />
      case "profesor":
        return <DocentesDashboard onLogout={handleLogout} username={nombre} />
      case "familia":
        return <FamiliaDashboard onLogout={handleLogout} username={nombre} />
      default:
        // Si el rol no coincide, cerramos sesión para evitar estados inconsistentes
        handleLogout()
        break
    }
  }

  // --- PANTALLA DE LOGIN ---
  return <Login onLogin={handleLogin} />
}

export default App
