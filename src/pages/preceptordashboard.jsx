import { useState, useEffect } from 'react'
import {
  LayoutDashboard, ClipboardCheck, Calendar, MessageSquare,
  User, LogOut, Bell
} from 'lucide-react'
import '../shared.css'
import './preceptordashboard.css'

const NAV_ITEMS = [
  { id: 'inicio',       icon: LayoutDashboard, label: 'Inicio'       },
  { id: 'asistencia',   icon: ClipboardCheck,  label: 'Asistencia'   },
  { id: 'eventos',      icon: Calendar,        label: 'Eventos'      },
  { id: 'comunicados',  icon: MessageSquare,   label: 'Comunicados'  },
  { id: 'perfil',       icon: User,            label: 'Perfil'       },
]

const CURSOS_ASISTENCIA = [
  { curso: '1° Año A', estudiantes: 28, completada: false },
  { curso: '1° Año B', estudiantes: 26, completada: false },
  { curso: '2° Año B', estudiantes: 24, completada: false },
  { curso: '3° Año A', estudiantes: 15, completada: true  },
  { curso: '3° Año B', estudiantes: 17, completada: false },
]

const MENSAJES = [
  { nombre: 'Prof. García',  texto: 'Mañana no voy a poder asistir por turno médico.', hora: '07:45', noLeido: true  },
  { nombre: 'Prof. Sánchez', texto: '¿Pueden avisarle a Pérez que tiene que traer el TP?', hora: 'Ayer', noLeido: false },
]

const CURSOS_CARGO = [
  { curso: '3° Año A', estudiantes: 15, tomada: true  },
  { curso: '3° Año B', estudiantes: 17, tomada: false },
]

const EVENTOS = [
  { tipo: 'purple', fecha: '⭐ 02/05/2026',       nombre: 'Jornada docente — sin clases', lugar: null        },
  { tipo: 'yellow', fecha: '06/05/2026 · 08:00', nombre: 'Entrega de TPs - Matemática',  lugar: 'Aula 12'   },
]

export default function PreceptorDashboard({ onLogout, username }) {
  const nombre = username || 'Usuario Demo'
  const [navActiva, setNavActiva] = useState('inicio')
  const [hora, setHora] = useState('')

  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase())

  return (
    <div className="sh-layout">

      {/* ── SIDEBAR ── */}
      <aside className="sh-sidebar">
        <div className="sh-sidebar-header">
          <div className="sh-sidebar-logo">
            <img src="https://eestn1.com.ar/src/assets/img/logo.webp" alt="Logo EEST N°1" />
          </div>
          <div className="sh-sidebar-school">
            <span className="sh-school-name">E.E.S.T. N°1</span>
            <span className="sh-school-sub">Manuel Belgrano</span>
            <span className="sh-school-sub">Tres de Febrero</span>
          </div>
        </div>

        <nav className="sh-nav">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`sh-nav-item ${navActiva === id ? 'sh-nav-item--active' : ''}`}
              onClick={() => setNavActiva(id)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sh-sidebar-footer">
          <div className="sh-footer-user">
            <div className="sh-user-avatar">{nombre[0].toUpperCase()}</div>
            <div className="sh-user-info">
              <span className="sh-user-name">{nombre}</span>
              <span className="sh-user-role">Preceptor</span>
            </div>
          </div>
          <button className="sh-logout" onClick={() => onLogout && onLogout()}>
            <LogOut size={13} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="sh-main">
        <div className="sh-content">

          {/* ── HERO ── */}
          <div className="sh-hero">
            <div className="sh-hero-left">
              <p className="sh-hero-welcome">Bienvenida</p>
              <h1 className="sh-hero-name">{nombre}</h1>
              <p className="sh-hero-date">
                <Calendar size={13} /> {fechaHoy}
              </p>
            </div>
            <div className="sh-hero-right">
              <div className="sh-hero-clock">🕐 {hora}</div>
            </div>
          </div>

          {/* ── CARD ASISTENCIA ── */}
          <div className="sh-card">
            <h2 className="sh-card-title">
              <ClipboardCheck size={17} /> Tomar asistencia
            </h2>
            <p className="sh-card-subtitle">Podés tomar lista de cualquier curso</p>
            {CURSOS_ASISTENCIA.map((item, i) => (
              <div key={i} className="sh-row">
                <div>
                  <p className="pd-curso-nombre">{item.curso}</p>
                  <p className="pd-curso-estudiantes">{item.estudiantes} estudiantes</p>
                </div>
                {item.completada ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="sh-badge-ok">✓ Completada</span>
                    <button className="sh-btn-ghost">Editar</button>
                  </div>
                ) : (
                  <button className="sh-btn-primary">Tomar asistencia</button>
                )}
              </div>
            ))}
          </div>

          {/* ── GRID INFERIOR ── */}
          <div className="pd-bottom-grid">

            {/* Mensajes docentes */}
            <div className="sh-card">
              <h2 className="sh-card-title">
                <MessageSquare size={17} /> Mensajes de Docentes
              </h2>
              {MENSAJES.map((m, i) => (
                <div key={i} className="sh-row" style={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="pd-mensaje-nombre">
                      {m.nombre}
                      {m.noLeido && <span className="sh-unread-dot" style={{ marginLeft: 5 }} />}
                    </span>
                    <span className="pd-mensaje-texto">{m.texto}</span>
                  </div>
                  <span className="pd-mensaje-hora">{m.hora}</span>
                </div>
              ))}
              <button className="sh-ver-todos">Ver todos →</button>
            </div>

            {/* Mis cursos */}
            <div className="sh-card">
              <h2 className="sh-card-title">
                <User size={17} /> Mis cursos a cargo
              </h2>
              {CURSOS_CARGO.map((c, i) => (
                <div key={i} className="sh-row">
                  <div>
                    <p className="pd-curso-nombre">{c.curso}</p>
                    <p className="pd-curso-estudiantes">{c.estudiantes} estudiantes</p>
                  </div>
                  <span className={c.tomada ? 'sh-badge-ok' : 'sh-badge-warn'}>
                    {c.tomada ? 'Tomada' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>

            {/* Eventos */}
            <div className="sh-card">
              <h2 className="sh-card-title">
                <Calendar size={17} /> Eventos próximos
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
                {EVENTOS.map((e, i) => (
                  <div key={i} className={`sh-evento-item sh-evento-item--${e.tipo}`}>
                    <p className="sh-evento-fecha">{e.fecha}</p>
                    <p className="sh-evento-nombre">{e.nombre}</p>
                    {e.lugar && <p className="sh-evento-lugar">📍 {e.lugar}</p>}
                  </div>
                ))}
              </div>
              <button className="sh-ver-todos">Ver calendario completo →</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
