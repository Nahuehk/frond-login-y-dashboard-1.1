import { useState, useEffect } from 'react'
import {
  Home, BookOpen, CheckSquare, Clock, Calendar,
  MessageSquare, User, LogOut, GraduationCap,
  ChevronDown, MapPin, AlertCircle, Clock3, ArrowRight, CheckCircle2,
  Menu, X
} from 'lucide-react'
import '../shared.css'
import './FamiliaDashboard.css'

const ESTUDIANTES = [
  { id: 1, nombre: 'Valentín López', curso: '3° Año A · Grupo A' },
  { id: 2, nombre: 'Sofía López',    curso: '1° Año B · Grupo C' },
]

const CLASES_HOY = [
  { id: 1, inicio: '07:30', fin: '08:50', materia: 'Historia',  profesor: 'Prof. Martínez',  aula: 'Aula 8',       color: '#ef4444' },
  { id: 2, inicio: '09:00', fin: '10:20', materia: 'Inglés',    profesor: 'Prof. Williams',  aula: 'Aula 5',       color: '#f97316' },
  { id: 3, inicio: '10:30', fin: '11:50', materia: 'Física',    profesor: 'Prof. Sánchez',   aula: 'Lab. Física',  color: '#3b82f6' },
  { id: 4, inicio: '13:00', fin: '14:20', materia: 'Biología',  profesor: 'Prof. Fernández', aula: 'Lab. Bio',     color: '#22c55e' },
]

const MOVIMIENTOS = [
  { id: 1, tipo: 'tarde',   materia: 'Matemática', detalle: 'Llegó 10 min tarde',              fecha: 'Lun 21/04' },
  { id: 2, tipo: 'ausente', materia: 'Biología',   detalle: '',                                 fecha: 'Mar 22/04' },
  { id: 3, tipo: 'tarde',   materia: 'Historia',   detalle: 'Ingresó 8 min tarde por tráfico', fecha: 'Jue 24/04' },
]

const ASISTENCIA = { porcentaje: 82, inasistencias: 8, permitidas: 15 }

const COMUNICADOS = [
  { id: 1, titulo: 'Ausencia del Prof. García',  cuerpo: 'Informamos que mañana el Prof. García (Matemática) no asistirá. La hora será libre.', fecha: '27 abr' },
  { id: 2, titulo: 'Cambio de horario',           cuerpo: 'El jueves la clase de Física se traslada al laboratorio 2 por mantenimiento.',          fecha: '25 abr' },
  { id: 3, titulo: 'Entrega de boletines',        cuerpo: 'La entrega de boletines del 1er cuatrimestre será el martes 29 de abril a las 18:00 hs.', fecha: '23 abr' },
]

const NAV_ITEMS = [
  { id: 'inicio',      label: 'Inicio',      Icon: Home          },
  { id: 'notas',       label: 'Notas',       Icon: BookOpen      },
  { id: 'asistencia',  label: 'Asistencia',  Icon: CheckSquare   },
  { id: 'horario',     label: 'Horario',     Icon: Clock         },
  { id: 'eventos',     label: 'Eventos',     Icon: Calendar      },
  { id: 'comunicados', label: 'Comunicados', Icon: MessageSquare },
  { id: 'perfil',      label: 'Perfil',      Icon: User          },
]

function CirculoAsistencia({ porcentaje }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const offset = circ - (porcentaje / 100) * circ
  return (
    <svg width="90" height="90" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e8eaf0" strokeWidth="7" />
      <circle cx="40" cy="40" r={r} fill="none" stroke="var(--accent-blue)" strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="40" y="45" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--navy)" fontFamily="inherit">
        {porcentaje}%
      </text>
    </svg>
  )
}

function SectionPlaceholder({ title }) {
  return (
    <div className="sh-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ background: 'var(--gray-100)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <User size={32} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>Sección: {title}</h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Esta sección se encuentra actualmente en desarrollo para el seguimiento de tus hijos.</p>
    </div>
  );
}

export default function FamiliaDashboard({ onLogout, username }) {
  const [navActiva, setNavActiva]           = useState('inicio')
  const [estudianteIdx, setEstudianteIdx]   = useState(0)
  const [selectorOpen, setSelectorOpen]     = useState(false)
  const [isSidebarOpen, setIsSidebarOpen]   = useState(false)
  const estudiante = ESTUDIANTES[estudianteIdx]

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).replace(/^\w/, c => c.toUpperCase())

  const renderContent = () => {
    if (navActiva !== 'inicio') {
      const activeItem = NAV_ITEMS.find(i => i.id === navActiva);
      return <SectionPlaceholder title={activeItem?.label || navActiva} />;
    }

    return (
      <>
        {/* ── HERO ── */}
        <div className="sh-hero">
          <div className="sh-hero-left" style={{ width: '100%' }}>
            <p className="sh-hero-welcome">Bienvenido/a</p>
            <h1 className="sh-hero-name">{username || 'Usuario Demo'}</h1>
            <p className="sh-hero-date"><Calendar size={13} /> {fechaHoy}</p>

            {/* Selector de estudiante dentro del hero */}
            <div className="fd-selector-wrapper">
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase' }}>
                Estudiante a cargo
              </p>
              <button className="fd-selector-btn" onClick={() => setSelectorOpen(!selectorOpen)}>
                <GraduationCap size={15} style={{ opacity: 0.8 }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{estudiante.nombre}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{estudiante.curso}</span>
                </div>
                <ChevronDown size={14} style={{ marginLeft: 'auto', transform: selectorOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {selectorOpen && (
                <div className="fd-selector-dropdown">
                  {ESTUDIANTES.map((e, i) => (
                    <button key={e.id} className={`fd-selector-option ${i === estudianteIdx ? 'fd-selector-option--active' : ''}`}
                      onClick={() => { setEstudianteIdx(i); setSelectorOpen(false) }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <strong>{e.nombre}</strong>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.curso}</span>
                      </div>
                      {i === estudianteIdx && <CheckCircle2 size={14} style={{ color: 'var(--accent-blue)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── COMUNICADOS (full width, prioritario) ── */}
        <div className="sh-card">
          <h2 className="sh-card-title"><MessageSquare size={17} /> Comunicados del Preceptor</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COMUNICADOS.map((c) => (
              <div key={c.id} className="sh-comunicado-item sh-comunicado-item--preceptor">
                <div className="sh-comunicado-header">
                  <span className="sh-comunicado-tag sh-comunicado-tag--preceptor">
                    <span className="sh-unread-dot" /> PRECEPTOR
                  </span>
                  <span className="sh-comunicado-date">{c.fecha}</span>
                </div>
                <p className="sh-comunicado-title">{c.titulo}</p>
                <p className="sh-comunicado-body sh-comunicado-body--expanded">{c.cuerpo}</p>
              </div>
            ))}
          </div>
          <button className="sh-ver-todos">Ver todos los comunicados <ArrowRight size={13} /></button>
        </div>

        {/* ── GRID ── */}
        <div className="fd-grid">

          {/* Clases de hoy */}
          <div className="sh-card">
            <h2 className="sh-card-title"><Clock size={17} /> Clases de hoy</h2>
            <div className="fd-clases-lista">
              {CLASES_HOY.map((c) => (
                <div key={c.id} className="fd-clase-item">
                  <div className="fd-clase-tiempo">
                    <span className="fd-clase-inicio">{c.inicio}</span>
                    <span className="fd-clase-fin">{c.fin}</span>
                  </div>
                  <span className="fd-clase-dot" style={{ background: c.color }} />
                  <div>
                    <p className="fd-clase-nombre">{c.materia}</p>
                    <p className="fd-clase-meta">{c.profesor} · <MapPin size={10} style={{ marginRight: 2, verticalAlign: 'middle' }} />{c.aula}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Movimientos de la semana */}
          <div className="sh-card">
            <h2 className="sh-card-title"><AlertCircle size={17} /> Movimientos de la semana</h2>
            <p className="sh-card-subtitle" style={{ fontSize: '12px', color: 'var(--text-soft)', marginBottom: '16px' }}>Inasistencias y tardanzas registradas</p>
            <div className="fd-mov-lista">
              {MOVIMIENTOS.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-50)' }}>
                  <div className={`fd-mov-icon fd-mov-icon--${m.tipo}`} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.tipo === 'tarde' ? 'var(--gray-100)' : 'rgba(220,38,38,0.1)', color: m.tipo === 'tarde' ? 'var(--warning)' : 'var(--danger)' }}>
                    {m.tipo === 'tarde' ? <Clock3 size={14} /> : <AlertCircle size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="fd-mov-materia" style={{ fontSize: '13px', fontWeight: 600 }}>{m.materia} — {m.tipo === 'tarde' ? 'Tarde' : 'Ausente'}</p>
                    {m.detalle && <p className="fd-mov-detalle" style={{ fontSize: '11px', color: 'var(--text-soft)' }}>{m.detalle}</p>}
                  </div>
                  <span className="fd-mov-fecha" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.fecha}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Asistencia */}
          <div className="sh-card">
            <h2 className="sh-card-title"><CheckSquare size={17} /> Estado de asistencia</h2>
            <div className="fd-asistencia-wrap">
              <CirculoAsistencia porcentaje={ASISTENCIA.porcentaje} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p className="fd-asist-stat">Inasistencias: <strong>{ASISTENCIA.inasistencias}</strong> de {ASISTENCIA.permitidas}</p>
                <p className="fd-asist-stat">Quedan <strong>{ASISTENCIA.permitidas - ASISTENCIA.inasistencias}</strong> antes del límite</p>
              </div>
            </div>
            <button className="sh-btn-primary" style={{ width: '100%', marginTop: '16px' }}>Ver reporte detallado</button>
          </div>

        </div>
      </>
    );
  };

  return (
    <div className="sh-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sh-sidebar ${isSidebarOpen ? 'sh-sidebar--open' : ''}`}>
        <div className="sh-sidebar-header">
          <div className="sh-sidebar-logo">
            <img src="https://eestn1.com.ar/src/assets/img/logo.webp" alt="Logo EEST N°1" />
          </div>
          <div className="sh-sidebar-school">
            <span className="sh-school-name">E.E.S.T. N°1</span>
            <span className="sh-school-sub">Manuel Belgrano</span>
            <span className="sh-school-sub">Tres de Febrero</span>
          </div>
          <button className="sh-hamburger" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)' }} onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sh-nav">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sh-nav-item ${navActiva === id ? 'sh-nav-item--active' : ''}`}
              onClick={() => { setNavActiva(id); setIsSidebarOpen(false); }}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sh-sidebar-footer">
          <div className="sh-footer-user">
            <div className="sh-user-avatar">{username ? username[0].toUpperCase() : 'F'}</div>
            <div className="sh-user-info">
              <span className="sh-user-name">{username || 'Usuario Demo'}</span>
              <span className="sh-user-role">Tutor / Familia</span>
            </div>
          </div>
          <button className="sh-logout" onClick={() => onLogout && onLogout()}>
            <LogOut size={13} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="sh-main">
        {/* Topbar móvil */}
        <div className="sh-mobile-topbar">
          <button className="sh-hamburger" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="sh-topbar-brand">
            <img src="https://eestn1.com.ar/src/assets/img/logo.webp" className="sh-topbar-logo" alt="logo" />
            <span className="sh-topbar-name">EEST N°1</span>
          </div>
          <div style={{ width: 32 }} />
        </div>

        <div className="sh-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
