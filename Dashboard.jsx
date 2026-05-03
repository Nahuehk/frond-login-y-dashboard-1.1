import { useState, useEffect } from "react";
// Importamos los iconos de la librería 'lucide-react' para dar un aspecto profesional
import { 
  Home, 
  BookOpen, 
  ClipboardCheck, 
  Calendar, 
  CalendarDays, 
  MessageSquare, 
  User, 
  LogOut,
  Clock,
  MapPin,
  AlertTriangle,
  GraduationCap,
  Building2,
  Star,
  Pin,
  Menu,
  X
} from "lucide-react";
import "./Dashboard.css";
 
// ── DATOS DE PRUEBA (MOCK DATA) ───────────────────────────────────────────
// Estos datos simulan lo que vendría de una base de datos en el futuro.

// Elementos del menú lateral
const NAV_ITEMS = [
  { id: "inicio",       icon: Home, label: "Inicio" },
  { id: "notas",        icon: BookOpen, label: "Notas" },
  { id: "asistencia",   icon: ClipboardCheck, label: "Asistencia" },
  { id: "horario",      icon: Calendar, label: "Horario" },
  { id: "eventos",      icon: CalendarDays, label: "Eventos" },
  { id: "comunicados",  icon: MessageSquare, label: "Comunicados" },
  { id: "perfil",       icon: User, label: "Perfil" },
];
 
// Clases programadas para el día de hoy
const CLASES = [
  { time: "07:30", end: "08:50", subject: "Geografía",        teacher: "Prof. López",  room: "Aula 12",  color: "#6366f1" },
  { time: "09:00", end: "10:20", subject: "Tecnología",       teacher: "Prof. Torres", room: "Aula TIC", color: "#3b82f6" },
  { time: "10:30", end: "11:50", subject: "Matemática",       teacher: "Prof. García", room: "Aula 12",  color: "#f59e0b" },
  { time: "13:00", end: "14:20", subject: "Educación Física", teacher: "Prof. Ruiz",   room: "Gimnasio", color: "#ef4444" },
];
 
// Próximos eventos institucionales
const EVENTOS = [
  {
    date: "02/05/2026",
    title: "Jornada docente — sin clases",
    location: null,
    color: "purple",
    icon: Star,
  },
  {
    date: "06/05/2026 · 08:00",
    title: "Entrega de TPs - Matemática",
    location: "Aula 12",
    color: "blue",
    icon: Pin,
  },
];
 
// Mensajes y avisos para el alumno
const COMUNICADOS = [
  {
    tipo: "preceptor",
    label: "Preceptor",
    date: "27 abr",
    title: "Ausencia del Prof. García",
    body: "Informamos que mañana el Prof. García (Matemática) no asistirá. La hora será libre.",
  },
  {
    tipo: "admin",
    label: "Administrador",
    date: "28 abr",
    title: "Acto 25 de Mayo",
    body: "Se recuerda que el acto del 25 de Mayo será en el aula magna a las 10:00 hs. Asistencia obligatoria con uniforme de gala.",
  },
  {
    tipo: "preceptor",
    label: "Preceptor",
    date: "25 abr",
    title: "Cambio de horario",
    body: "El jueves la clase de Física se traslada al laboratorio 2 por mantenimiento.",
  },
];
 
// Porcentaje de asistencia por materia
const ASISTENCIAS = [
  { subject: "Educación Física", pct: 72,  colorClass: "warn" },
  { subject: "Historia",         pct: 76,  colorClass: "med"  },
  { subject: "Matemática",       pct: 80,  colorClass: "ok"   },
];
 
// ── RELOJ EN VIVO (CUSTOM HOOK) ──────────────────────────────────────────
// Esta función mantiene el tiempo actualizado cada segundo.
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id); // Limpieza al desmontar el componente
  }, []);
  return time;
}
 
// Formatea la hora en estilo argentino (HH:MM:SS)
function formatTime(date) {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
 
// Formatea la fecha larga (ej: "Lunes, 1 de mayo de 2026")
function formatDate(date) {
  const str = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return str.charAt(0).toUpperCase() + str.slice(1); // Capitaliza la primera letra
}
 
// ── BARRA LATERAL (SIDEBAR) ───────────────────────────────────────────────
function Sidebar({ activeNav, onNav, onLogout, username, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="school-logo">
          <div className="logo-icon">
             <img 
               src="https://eestn1.com.ar/src/assets/img/logo.webp" 
               alt="Logo EEST N°1" 
               className="logo-img"
             />
          </div>
          <div className="logo-text">
            <div className="school-name">E.E.S.T. N°1</div>
            <div className="school-sub">Manuel Belgrano</div>
          </div>
        </div>
        {/* Botón para cerrar el menú en dispositivos móviles */}
        <button className="mobile-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
 
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => {
                onNav(item.id);
                onClose(); // Cierra el menú automáticamente al hacer clic en móvil
              }}
            >
              <Icon className="nav-icon" size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
 
      {/* Información del usuario y botón de salida */}
      <div className="sidebar-footer">
        <div className="user-profile">
          {/* Avatar con la inicial del nombre */}
          <div className="user-avatar">{username ? username[0].toUpperCase() : "U"}</div>
          <div className="user-info">
            <div className="user-name">{username || "Usuario Demo"}</div>
            <div className="user-role">Estudiante</div>
          </div>
        </div>
        {/* Botón de salida (Deshabilitado temporalmente) */}
        <button 
          className="logout-btn" 
          onClick={() => console.log("Cierre de sesión deshabilitado")} 
          disabled
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
 
// ── BARRA SUPERIOR (TOP BAR) ─────────────────────────────────────────────
function TopBar({ time, onMenuOpen }) {
  const dateStr = formatDate(time);
  const timeStr = formatTime(time);
 
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Botón "hamburguesa" para abrir el menú en móviles */}
        <button className="mobile-menu-btn" onClick={onMenuOpen}>
          <Menu size={20} />
        </button>
        <span className="topbar-date">
          <Calendar size={14} className="topbar-icon" />
          {dateStr}
        </span>
        <span className="topbar-time">
          <Clock size={14} className="topbar-icon" />
          {timeStr}
        </span>
      </div>
    </header>
  );
}
 
// ── TARJETA: CLASES ───────────────────────────────────────────────────────
function ClasesCard() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <BookOpen size={18} className="card-title-icon" />
          Clases de hoy
        </h2>
      </div>
      <div className="class-list">
        {CLASES.map((c, i) => (
          <div className="class-item" key={i}>
            <div className="class-time">
              <div className="time-start">{c.time}</div>
              <div className="time-end">{c.end}</div>
            </div>
            {/* Punto de color indicativo de la materia */}
            <div className="class-dot" style={{ backgroundColor: c.color }} />
            <div className="class-info">
              <div className="class-name">{c.subject}</div>
              <div className="class-meta">{c.teacher} · {c.room}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ── TARJETA: EVENTOS ─────────────────────────────────────────────────────
function EventosCard() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <CalendarDays size={18} className="card-title-icon" />
          Eventos próximos
        </h2>
      </div>
      <div className="events-list">
        {EVENTOS.map((e, i) => {
          const Icon = e.icon;
          return (
            <div className={`event-item ${e.color}`} key={i}>
              <div className="event-date">
                <Icon size={12} />
                {e.date}
              </div>
              <div className="event-title">{e.title}</div>
              {e.location && <div className="event-location"><MapPin size={10} /> {e.location}</div>}
            </div>
          );
        })}
      </div>
      <a className="card-link" href="#">Ver calendario completo →</a>
    </div>
  );
}
 
// ── TARJETA: COMUNICADOS ─────────────────────────────────────────────────
function ComunicadosCard() {
  const [expanded, setExpanded] = useState(null); // Controla qué comunicado está expandido
 
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <MessageSquare size={18} className="card-title-icon" />
          Comunicados
        </h2>
      </div>
      <div className="comunicados-list">
        {COMUNICADOS.map((c, i) => (
          <div
            className={`comunicado-item ${c.tipo}`}
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)} // Alterna expansión
            style={{ cursor: "pointer" }}
          >
            <div className="comunicado-header">
              <span className={`comunicado-tag ${c.tipo}`}>
                <span className="tag-dot" />
                {c.label}
              </span>
              <span className="comunicado-date">{c.date}</span>
            </div>
            <div className="comunicado-title">{c.title}</div>
            <div
              className="comunicado-body"
              style={expanded === i ? { WebkitLineClamp: "unset" } : {}}
            >
              {c.body}
            </div>
          </div>
        ))}
      </div>
      <a className="card-link" href="#">Ver todos →</a>
    </div>
  );
}
 
// ── TARJETA: ASISTENCIA ─────────────────────────────────────────────────
function AsistenciaCard() {
  const [loaded, setLoaded] = useState(false);
  // Efecto para animar las barras de progreso al cargar
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);
 
  // Funciones auxiliares para determinar el color según la gravedad
  const fillClass = (c) => {
    if (c === "warn") return "fill-warn";
    if (c === "med")  return "fill-med";
    return "fill-ok";
  };
 
  const pctClass = (c) => {
    if (c === "warn") return "pct-warn";
    if (c === "med")  return "pct-med";
    return "pct-ok";
  };
 
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title alert-header">
          <AlertTriangle size={18} className="alert-icon" />
          Materias con asistencia crítica
        </h2>
      </div>
      <div className="asistencia-list">
        {ASISTENCIAS.map((a, i) => (
          <div className="asistencia-item" key={i}>
            <div className="asistencia-header">
              <span className="asistencia-subject">{a.subject}</span>
              <span className={`asistencia-pct ${pctClass(a.colorClass)}`}>
                {a.pct}%
              </span>
            </div>
            {/* Barra de progreso visual */}
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${fillClass(a.colorClass)}`}
                style={{ width: loaded ? `${a.pct}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="asistencia-footer">
        <button className="asistencia-btn">Ver todas mis asistencias</button>
      </div>
    </div>
  );
}
 
// ── BANNER DE BIENVENIDA (HERO) ──────────────────────────────────────────
function HeroBanner({ time, username }) {
  const dateStr = formatDate(time);
 
  return (
    <div className="hero-banner">
      <div className="hero-date">
        <Calendar size={14} />
        {dateStr}
      </div>
      <div className="hero-name">{username || "Valentín López"}</div>
      <div className="hero-badges">
        <span className="badge"><GraduationCap size={14} /> 3° Año A</span>
        <span className="badge"><Building2 size={14} /> Grupo de Taller: A</span>
      </div>
    </div>
  );
}
 
// ── COMPONENTE PRINCIPAL (ROOT) ──────────────────────────────────────────
export default function Dashboard({ onLogout, username }) {
  const [activeNav, setActiveNav] = useState("inicio"); // Controla la sección activa
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla el menú móvil
  const time = useClock(); // Hook personalizado para el tiempo
 
  return (
    <div className="dashboard-layout">
      {/* Menú Lateral */}
      <Sidebar 
        activeNav={activeNav} 
        onNav={setActiveNav} 
        onLogout={onLogout} 
        username={username}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
 
      {/* Contenido Principal */}
      <div className="main-content">
        <TopBar 
          time={time} 
          onMenuOpen={() => setIsSidebarOpen(true)} 
        />
 
        <main className="page-content">
          <HeroBanner time={time} username={username} />
 
          {/* Cuadrícula de tarjetas del Dashboard */}
          <div className="dashboard-grid">
            <ClasesCard />
            <EventosCard />
            <ComunicadosCard />
            <AsistenciaCard />
          </div>
        </main>
      </div>
    </div>
  );
}
