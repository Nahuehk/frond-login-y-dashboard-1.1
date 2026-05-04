import { useState, useEffect } from "react";
import {
  Home, BookOpen, ClipboardCheck, Calendar, CalendarDays,
  MessageSquare, User, LogOut, Clock, MapPin, AlertTriangle,
  GraduationCap, Building2, Star, Pin, Menu, X, ArrowRight,
  Clock3
} from "lucide-react";
import "../shared.css";
import "./Dashboard.css";

const NAV_ITEMS = [
  { id: "inicio",      icon: Home,          label: "Inicio"       },
  { id: "notas",       icon: BookOpen,       label: "Notas"        },
  { id: "asistencia",  icon: ClipboardCheck, label: "Asistencia"   },
  { id: "horario",     icon: Calendar,       label: "Horario"      },
  { id: "eventos",     icon: CalendarDays,   label: "Eventos"      },
  { id: "comunicados", icon: MessageSquare,  label: "Comunicados"  },
  { id: "perfil",      icon: User,           label: "Perfil"       },
];

const CLASES = [
  { time: "07:30", end: "08:50", subject: "Geografía",        teacher: "Prof. López",  room: "Aula 12",  color: "#6366f1" },
  { time: "09:00", end: "10:20", subject: "Tecnología",       teacher: "Prof. Torres", room: "Aula TIC", color: "#3b82f6" },
  { time: "10:30", end: "11:50", subject: "Matemática",       teacher: "Prof. García", room: "Aula 12",  color: "#f59e0b" },
  { time: "13:00", end: "14:20", subject: "Educación Física", teacher: "Prof. Ruiz",   room: "Gimnasio", color: "#ef4444" },
];

const EVENTOS = [
  { date: "02/05/2026", title: "Jornada docente — sin clases", location: null,     color: "purple", icon: Star },
  { date: "06/05/2026 · 08:00", title: "Entrega de TPs - Matemática", location: "Aula 12", color: "yellow", icon: Pin },
];

const COMUNICADOS = [
  { tipo: "preceptor", label: "Preceptor",     date: "27 abr", title: "Ausencia del Prof. García", body: "Informamos que mañana el Prof. García (Matemática) no asistirá. La hora será libre."                                         },
  { tipo: "admin",     label: "Administrador", date: "28 abr", title: "Acto 25 de Mayo",            body: "Se recuerda que el acto del 25 de Mayo será en el aula magna a las 10:00 hs. Asistencia obligatoria con uniforme de gala." },
  { tipo: "preceptor", label: "Preceptor",     date: "25 abr", title: "Cambio de horario",          body: "El jueves la clase de Física se traslada al laboratorio 2 por mantenimiento."                                              },
];

const ASISTENCIAS = [
  { subject: "Educación Física", pct: 72, colorClass: "warn"   },
  { subject: "Historia",         pct: 76, colorClass: "med"    },
  { subject: "Matemática",       pct: 80, colorClass: "ok"     },
];

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime(date) {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(date) {
  const str = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function SectionPlaceholder({ title }) {
  return (
    <div className="sh-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ background: 'var(--gray-100)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Star size={32} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>Sección: {title}</h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Esta sección se encuentra actualmente en desarrollo para tu perfil.</p>
    </div>
  );
}

export default function Dashboard({ onLogout, username }) {
  const [activeNav, setActiveNav] = useState("inicio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedComunicado, setExpandedComunicado] = useState(null);
  const [asistLoaded, setAsistLoaded] = useState(false);
  const time = useClock();

  useEffect(() => {
    const t = setTimeout(() => setAsistLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const nombre = username || "Valentín López";

  const renderContent = () => {
    if (activeNav !== "inicio") {
      const activeItem = NAV_ITEMS.find(i => i.id === activeNav);
      return <SectionPlaceholder title={activeItem?.label || activeNav} />;
    }

    return (
      <>
        {/* ── HERO ── */}
        <div className="sh-hero">
          <div className="sh-hero-left">
            <p className="sh-hero-welcome">Bienvenido</p>
            <h1 className="sh-hero-name">{nombre}</h1>
            <p className="sh-hero-date">
              <Calendar size={13} /> {formatDate(time)}
            </p>
            <div className="sh-hero-tags">
              <span className="sh-hero-tag"><GraduationCap size={13} /> 3° Año A</span>
              <span className="sh-hero-tag"><Building2 size={13} /> Grupo de Taller: A</span>
            </div>
          </div>
          <div className="sh-hero-right">
            <div className="sh-hero-tag" style={{ background: 'rgba(255,255,255,0.15)', fontSize: '14px', padding: '8px 16px' }}>
              <Clock3 size={16} /> {formatTime(time)}
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="db-grid">

          {/* Clases de hoy */}
          <div className="sh-card">
            <h2 className="sh-card-title">
              <BookOpen size={17} /> Clases de hoy
            </h2>
            <div className="db-class-list">
              {CLASES.map((c, i) => (
                <div className="db-class-item" key={i}>
                  <div className="db-class-time">
                    <span className="db-time-start">{c.time}</span>
                    <span className="db-time-end">{c.end}</span>
                  </div>
                  <div className="db-class-dot" style={{ background: c.color }} />
                  <div className="db-class-info">
                    <span className="db-class-name">{c.subject}</span>
                    <span className="db-class-meta">{c.teacher} · {c.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos */}
          <div className="sh-card">
            <h2 className="sh-card-title">
              <CalendarDays size={17} /> Eventos próximos
            </h2>
            <div className="db-events-list">
              {EVENTOS.map((e, i) => {
                const Icon = e.icon;
                return (
                  <div className={`sh-evento-item sh-evento-item--${e.color}`} key={i}>
                    <p className="sh-evento-fecha"><Icon size={11} /> {e.date}</p>
                    <p className="sh-evento-nombre">{e.title}</p>
                    {e.location && <p className="sh-evento-lugar"><MapPin size={10} /> {e.location}</p>}
                  </div>
                );
              })}
            </div>
            <button className="sh-ver-todos">Ver calendario completo <ArrowRight size={13} /></button>
          </div>

          {/* Comunicados */}
          <div className="sh-card db-comunicados-card">
            <h2 className="sh-card-title">
              <MessageSquare size={17} /> Comunicados
            </h2>
            <div className="db-comunicados-list">
              {COMUNICADOS.map((c, i) => (
                <div
                  key={i}
                  className={`sh-comunicado-item sh-comunicado-item--${c.tipo}`}
                  onClick={() => setExpandedComunicado(expandedComunicado === i ? null : i)}
                >
                  <div className="sh-comunicado-header">
                    <span className={`sh-comunicado-tag sh-comunicado-tag--${c.tipo}`}>
                      <span className="sh-unread-dot" />
                      {c.label}
                    </span>
                    <span className="sh-comunicado-date">{c.date}</span>
                  </div>
                  <p className="sh-comunicado-title">{c.title}</p>
                  <p className={`sh-comunicado-body ${expandedComunicado === i ? "sh-comunicado-body--expanded" : ""}`}>
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
            <button className="sh-ver-todos">Ver todos <ArrowRight size={13} /></button>
          </div>

          {/* Asistencia crítica */}
          <div className="sh-card">
            <h2 className="sh-card-title">
              <AlertTriangle size={17} /> Materias con asistencia crítica
            </h2>
            <div className="db-asist-list">
              {ASISTENCIAS.map((a, i) => (
                <div className="db-asist-item" key={i}>
                  <div className="db-asist-header">
                    <span className="db-asist-subject">{a.subject}</span>
                    <span className={`db-asist-pct db-asist-pct--${a.colorClass}`}>{a.pct}%</span>
                  </div>
                  <div className="db-progress-bg">
                    <div
                      className={`db-progress-fill db-progress-fill--${a.colorClass}`}
                      style={{ width: asistLoaded ? `${a.pct}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="sh-btn-primary db-asist-btn">Ver todas mis asistencias</button>
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
            <span className="sh-school-sub">Manuel Belgrano</span>
            <span className="sh-school-sub">Tres de Febrero</span>
          </div>
          <button className="sh-hamburger" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)' }} onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sh-nav">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`sh-nav-item ${activeNav === id ? "sh-nav-item--active" : ""}`}
              onClick={() => { setActiveNav(id); setIsSidebarOpen(false); }}
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
              <span className="sh-user-role">Estudiante</span>
            </div>
          </div>
          <button className="sh-logout" onClick={onLogout}>
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
          <div style={{ width: 32 }} /> {/* Espaciador */}
        </div>

        <div className="sh-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
