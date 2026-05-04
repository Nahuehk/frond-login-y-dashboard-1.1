import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, GraduationCap, UserCheck, UserCog,
  BookOpen, CalendarDays, Clock, LogOut, Bell,
  UserPlus, FolderPlus, CalendarClock, Send, BarChart2, Settings,
  CheckCircle2, Info, MessageSquare, AlertCircle, ArrowRight, Menu, X,
  Clock3, Calendar
} from "lucide-react";
import "../shared.css";
import "./AdminDashboard.css";

const STATS = [
  { id: 1, valor: 342, label: "Estudiantes",          Icon: GraduationCap, color: "blue"   },
  { id: 2, valor: 28,  label: "Docentes activos",     Icon: Users,         color: "green"  },
  { id: 3, valor: 18,  label: "Cursos activos",       Icon: FolderPlus,    color: "purple" },
  { id: 4, valor: 12,  label: "Comunicados este mes", Icon: MessageSquare, color: "pink"   },
];

const ACCESO_RAPIDO = [
  { id: 1, label: "Agregar usuario",    Icon: UserPlus,      color: "gray"   },
  { id: 2, label: "Crear curso",        Icon: FolderPlus,    color: "green"  },
  { id: 3, label: "Gestionar horarios", Icon: CalendarClock, color: "blue"   },
  { id: 4, label: "Enviar comunicado",  Icon: Send,          color: "purple" },
  { id: 5, label: "Ver reportes",       Icon: BarChart2,     color: "yellow" },
  { id: 6, label: "Configuración",      Icon: Settings,      color: "gray2"  },
];

const ACTIVIDAD = [
  { id: 1, tipo: "check",   texto: "Curso 3°B creado",                          tiempo: "Hace 10 min"  },
  { id: 2, tipo: "info",    texto: "Docente García agregado al sistema",         tiempo: "Hace 25 min"  },
  { id: 3, tipo: "message", texto: "Comunicado enviado a todos los preceptores", tiempo: "Hace 1 hora"  },
  { id: 4, tipo: "alert",   texto: "Horario de 2°A modificado",                 tiempo: "Hace 2 horas" },
  { id: 5, tipo: "check",   texto: "Boletines del 1° cuatrimestre exportados",  tiempo: "Hace 3 horas" },
  { id: 6, tipo: "info",    texto: "Tutora López vinculada a Valentín López",   tiempo: "Ayer 16:30"   },
  { id: 7, tipo: "check",   texto: 'Materia "Tecnología" agregada al plan 2°A', tiempo: "Ayer 11:00"   },
];

const NAV_SECTIONS = [
  { titulo: "INICIO",    items: [{ id: "dashboard", label: "Dashboard", Icon: LayoutDashboard }] },
  { titulo: "USUARIOS",  items: [
    { id: "estudiantes",      label: "Estudiantes",       Icon: GraduationCap },
    { id: "docentes",         label: "Docentes",          Icon: UserCheck     },
    { id: "preceptores",      label: "Preceptores",       Icon: UserCog       },
    { id: "tutores-familias", label: "Tutores / Familias", Icon: Users        },
  ]},
  { titulo: "ACADÉMICO", items: [
    { id: "cursos",   label: "Cursos",   Icon: FolderPlus },
    { id: "materias", label: "Materias", Icon: BookOpen   },
    { id: "horarios", label: "Horarios", Icon: Clock      },
  ]},
  { titulo: "CALENDARIO", items: [
    { id: "eventos", label: "Eventos / Calendario", Icon: CalendarDays },
  ]},
];

function ActividadIcono({ tipo }) {
  const cls = `ad-act-icon ad-act-icon--${tipo}`;
  if (tipo === "check")   return <CheckCircle2  size={16} className={cls} />;
  if (tipo === "info")    return <Info          size={16} className={cls} />;
  if (tipo === "message") return <MessageSquare size={16} className={cls} />;
  if (tipo === "alert")   return <AlertCircle   size={16} className={cls} />;
  return null;
}

function SectionPlaceholder({ title }) {
  return (
    <div className="sh-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ background: 'var(--gray-100)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Settings size={32} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>Sección: {title}</h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Esta sección se encuentra actualmente en desarrollo para el ciclo 2026.</p>
    </div>
  );
}

export default function AdminDashboard({ onLogout, username }) {
  const [navActiva, setNavActiva] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hora, setHora] = useState("");
  const nombre = username || "Administrador";

  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const renderContent = () => {
    if (navActiva !== "dashboard") {
      const allItems = NAV_SECTIONS.flatMap(s => s.items);
      const activeItem = allItems.find(i => i.id === navActiva);
      return <SectionPlaceholder title={activeItem?.label || navActiva} />;
    }

    return (
      <>
        {/* ── HERO ── */}
        <div className="sh-hero" style={{ marginBottom: '24px' }}>
          <div className="sh-hero-left">
            <p className="sh-hero-welcome">Gestión Centralizada</p>
            <h1 className="sh-hero-name">Resumen del Sistema</h1>
            <p className="sh-hero-date">
              <Calendar size={13} /> Ciclo lectivo 2026
            </p>
          </div>
          <div className="sh-hero-right">
            <div className="sh-hero-tag" style={{ background: 'rgba(255,255,255,0.15)', fontSize: '14px', padding: '8px 16px' }}>
              <Clock3 size={16} /> {hora}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="ad-stats-grid" style={{ marginBottom: '24px' }}>
          {STATS.map(({ id, valor, label, Icon, color }) => (
            <div key={id} className="ad-stat-card">
              <div className={`ad-stat-icon-wrap ad-stat-icon-wrap--${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="ad-stat-valor">{valor}</p>
                <p className="ad-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="ad-desktop-grid">
          {/* Acceso rápido */}
          <div className="sh-card" style={{ marginBottom: 0 }}>
            <p className="ad-section-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '1px' }}>ACCESO RÁPIDO</p>
            <div className="ad-acceso-grid">
              {ACCESO_RAPIDO.map(({ id, label, Icon, color }) => (
                <button key={id} className={`ad-acceso-btn ad-acceso-btn--${color}`}>
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="sh-card" style={{ marginBottom: 0 }}>
            <h3 className="sh-card-title">
              <Clock size={18} style={{ color: 'var(--accent-blue)' }} />
              Actividad reciente
            </h3>
            <div className="ad-actividad-lista" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ACTIVIDAD.map((act) => (
                <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--gray-50)' }}>
                  <ActividadIcono tipo={act.tipo} />
                  <span className="ad-actividad-texto" style={{ flex: 1, fontSize: '13px' }}>{act.texto}</span>
                  <span className="ad-actividad-tiempo" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.tiempo}</span>
                </div>
              ))}
            </div>
            <button className="sh-ver-todos">Ver reporte completo <ArrowRight size={13} /></button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="sh-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sh-sidebar ${isSidebarOpen ? "sh-sidebar--open" : ""}`}>
        <div className="sh-sidebar-header">
          <div className="sh-sidebar-logo">
            <img src="https://eestn1.com.ar/src/assets/img/logo.webp" alt="Logo EEST N°1" />
          </div>
          <div className="sh-sidebar-school">
            <span className="sh-school-name">E.E.S.T. N°1</span>
            <span className="sh-school-sub">Sistema de Gestión</span>
          </div>
          <button className="sh-hamburger" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)' }} onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sh-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.titulo}>
              <p className="sh-nav-section-title">{section.titulo}</p>
              {section.items.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`sh-nav-item ${navActiva === id ? "sh-nav-item--active" : ""}`}
                  onClick={() => { setNavActiva(id); setIsSidebarOpen(false); }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sh-sidebar-footer">
          <div className="sh-footer-user">
            <div className="sh-user-avatar">{nombre[0].toUpperCase()}</div>
            <div className="sh-user-info">
              <span className="sh-user-name">{nombre}</span>
              <span className="sh-user-role">Administrador</span>
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

        {/* Topbar Desktop */}
        <header className="sh-desktop-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#fff', borderBottom: '1px solid var(--gray-200)' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>Panel de Administración</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid #fff' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sh-user-avatar" style={{ width: 32, height: 32, background: 'var(--navy)', fontSize: 12 }}>{nombre[0].toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{nombre}</span>
            </div>
          </div>
        </header>

        <div className="sh-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
