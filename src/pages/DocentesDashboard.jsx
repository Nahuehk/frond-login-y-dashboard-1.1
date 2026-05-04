import { useState } from 'react'
import {
  Home, ClipboardCheck, BookOpen, FolderOpen,
  Calendar, MessageSquare, User, LogOut
} from 'lucide-react'
import '../shared.css'
import './DocentesDashboard.css'

const NAV_ITEMS = [
  { id: 'inicio',       icon: Home,          label: 'Inicio'        },
  { id: 'asistencia',   icon: ClipboardCheck, label: 'Asistencia'   },
  { id: 'notas',        icon: BookOpen,       label: 'Notas'        },
  { id: 'mis-cursos',   icon: FolderOpen,     label: 'Mis Cursos'   },
  { id: 'eventos',      icon: Calendar,       label: 'Eventos'      },
  { id: 'comunicados',  icon: MessageSquare,  label: 'Comunicados'  },
  { id: 'perfil',       icon: User,           label: 'Perfil'       },
]

const CLASES = [
  { id: 1, hora: '07:30 - 08:50', materia: 'Matemática', curso: '3° Año A', aula: 'Aula 12',  tomada: true  },
  { id: 2, hora: '09:00 - 10:20', materia: 'Matemática', curso: '2° Año B', aula: 'Aula 8',   tomada: false },
  { id: 3, hora: '10:30 - 11:50', materia: 'Matemática', curso: '5° Año A', aula: 'Aula 15',  tomada: false },
]

const COMUNICADOS = [
  { id: 1, titulo: 'Acto 25 de Mayo',         descripcion: 'Se recuerda que el acto del 25 de Mayo será a las 10:00 hs.' },
  { id: 2, titulo: 'Cierre por jornada docente', descripcion: 'El viernes 2 de mayo no habrá clases en la institución.'      },
]

const EVENTOS = [
  { id: 1, fecha: '02/05/2026',            titulo: 'Jornada docente — sin clases', hora: null,    aula: null,     tipo: 'purple' },
  { id: 2, fecha: '06/05/2026 · 08:00',   titulo: 'Entrega de TPs - Matemática',  hora: '08:00', aula: 'Aula 12', tipo: 'yellow' },
]

export default function DocentesDashboard({ onLogout, username }) {
  const nombre = username || 'Usuario Demo'
  const [navActiva, setNavActiva] = useState('inicio')
  const [asistencias, setAsistencias] = useState({})

  const handleTomar = (id) => setAsistencias(p => ({ ...p, [id]: true }))

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
              <span className="sh-user-role">Docente</span>
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
              <p className="sh-hero-welcome">Bienvenido</p>
              <h1 className="sh-hero-name">{nombre}</h1>
              <p className="sh-hero-date">{fechaHoy}</p>
              <div className="sh-hero-tags">
                <span className="sh-hero-tag">Docente · Matemática</span>
                <span className="sh-hero-tag">3 cursos a cargo</span>
              </div>
            </div>
          </div>

          {/* ── GRID ── */}
          <div className="dd-grid">

            {/* Clases de hoy — full width */}
            <div className="sh-card dd-clases-card">
              <h2 className="sh-card-title">
                <ClipboardCheck size={17} /> Clases de hoy
              </h2>
              <div className="dd-clases-list">
                {CLASES.map((clase) => {
                  const tomada = clase.tomada || asistencias[clase.id]
                  return (
                    <div key={clase.id} className="dd-clase-row">
                      <span className="dd-clase-hora">{clase.hora}</span>
                      <div className="dd-clase-info">
                        <span className="dd-clase-nombre">{clase.materia} — {clase.curso}</span>
                        <span className="dd-clase-aula">{clase.aula}</span>
                      </div>
                      <div>
                        {tomada
                          ? <span className="sh-badge-ok">✓ Asistencia tomada</span>
                          : <button className="sh-btn-secondary" onClick={() => handleTomar(clase.id)}>Tomar asistencia</button>
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="dd-acciones">
              <button className="sh-btn-action">
                <div className="sh-btn-action-icon"><ClipboardCheck size={20} /></div>
                <span className="sh-btn-action-label">Tomar asistencia</span>
                <span className="sh-btn-action-desc">Registrá presentes y ausentes</span>
              </button>
              <button className="sh-btn-action">
                <div className="sh-btn-action-icon"><BookOpen size={20} /></div>
                <span className="sh-btn-action-label">Cargar notas</span>
                <span className="sh-btn-action-desc">Ingresá calificaciones por curso</span>
              </button>
            </div>

            {/* Comunicados */}
            <div className="sh-card">
              <h2 className="sh-card-title">
                <MessageSquare size={17} /> Comunicados Institucionales
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {COMUNICADOS.map((c) => (
                  <div key={c.id} className="sh-comunicado-item sh-comunicado-item--admin">
                    <p className="sh-comunicado-title">{c.titulo}</p>
                    <p className="sh-comunicado-body sh-comunicado-body--expanded">{c.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eventos */}
            <div className="sh-card">
              <h2 className="sh-card-title">
                <Calendar size={17} /> Eventos próximos
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
                {EVENTOS.map((ev) => (
                  <div key={ev.id} className={`sh-evento-item sh-evento-item--${ev.tipo}`}>
                    <p className="sh-evento-fecha">{ev.fecha}</p>
                    <p className="sh-evento-nombre">{ev.titulo}</p>
                    {ev.aula && <p className="sh-evento-lugar">{ev.aula}</p>}
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
