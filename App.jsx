import { useState } from "react"
import "./index.css"
import Dashboard from "./Pages/Dashboard"

function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  // useState permite guardar y actualizar datos que cambian en la pantalla
  const [username, setUsername] = useState("")      // Guarda el texto del usuario
  const [password, setPassword] = useState("")      // Guarda el texto de la contraseña
  const [mensaje, setMensaje] = useState("")        // Guarda mensajes de error o éxito para mostrar al usuario
  const [token, setToken] = useState("")            // Guarda el token de seguridad cuando el login es correcto
  const [remember, setRemember] = useState(false)   // Controla si la casilla "Recordar sesión" está marcada
  const [showPassword, setShowPassword] = useState(false) // Controla si la contraseña se ve o está oculta
  const [loading, setLoading] = useState(false)     // Indica si estamos esperando respuesta del servidor (para mostrar "Ingresando...")

  // --- FUNCIÓN DE INICIO DE SESIÓN ---
  const handleLogin = async (e) => {
    e.preventDefault() // Evita que la página se recargue al enviar el formulario
    setMensaje("")     // Limpia mensajes anteriores

    // Validación básica: que no haya campos vacíos
    if (!username.trim() || !password.trim()) {
      setMensaje("Completá usuario y contraseña para continuar.")
      return
    }

    try {
      setLoading(true) // Activamos el estado de carga

      // Enviamos los datos al servidor de Django
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      // Intentamos leer la respuesta del servidor (formato JSON)
      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        // Si el servidor responde que todo está bien (Status 200)
        const receivedToken = data.token || data.access || ""
        
        setMensaje("Login exitoso. Redirigiendo...")

        // Esperamos un momento para que el usuario vea el mensaje de éxito
        setTimeout(() => {
          setToken(receivedToken)

          // Guardamos el token según la preferencia del usuario
          if (remember && receivedToken) {
            localStorage.setItem("token", receivedToken)
          } else if (receivedToken) {
            sessionStorage.setItem("token", receivedToken)
          }
        }, 1500)
      } else {
        // Si las credenciales son incorrectas o hay otro error del servidor
        setMensaje(data.error || data.detail || "Usuario o contraseña incorrectos.")
      }
    } catch (error) {
      // Si no hay internet o el servidor está apagado
      setMensaje("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false) // Desactivamos el estado de carga al terminar (éxito o error)
    }
  }

  // --- FUNCIONES ADICIONALES ---
  const handleLogout = () => {
    setToken("")
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    setMensaje("Sesión cerrada.")
  }

  const isLoggedIn = !!token

  // --- ESTRUCTURA VISUAL (JSX) ---
  
  // Si el usuario está logueado, mostramos el Dashboard completo
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} username={username} />
  }

  // Si no está logueado, mostramos el formulario de Login
  return (
    <main className="login-page">
      {/* Sección del Logo y Título de la Institución */}
      <section className="brand">
        <img
          src="https://eestn1.com.ar/src/assets/img/logo.webp"
          alt="Logo EEST N°1"
          className="brand-logo"
        />
        <h1>EEST N°1</h1>
        <p>Sistema de Gestión Escolar</p>
      </section>

      {/* Formulario de Login */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        {/* Campo de Usuario */}
        <div className="field">
          <label htmlFor="username">Usuario</label>
          <div className="input-wrapper">
            <span className="input-icon">
              {/* Icono de Usuario (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresá tu usuario"
              autoComplete="username"
            />
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">
              {/* Icono de Candado (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // Cambia entre texto y asteriscos
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
            />

            {/* Botón para Mostrar/Ocultar Contraseña */}
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                /* Icono de Ojo Tachado (más limpio) */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                /* Icono de Ojo Abierto (más limpio) */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Opciones de Recordar y Olvidé Contraseña */}
        <div className="login-options">
          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordar sesión
          </label>
          <button
            type="button"
            className="forgot-button"
            onClick={() => setMensaje("Solicitá el cambio de contraseña en administración.")}
          >
            Olvidé mi contraseña
          </button>
        </div>

        {/* Botón de Ingresar */}
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {/* Mensaje de Feedback (Error o Éxito) */}
        {mensaje && (
          <p className={token ? "message success" : "message"}>{mensaje}</p>
        )}
      </form>

      {/* Nota al pie */}
      <p className="footer-note">
        Las credenciales son proporcionadas por la administración · EEST N°1
      </p>
    </main>
  )
}

export default App
