import { ArrowLeft } from 'lucide-react'
import brandLogo from '../assets/logo-parque-del-cafe.png'

export function AppLayout({ children, navItems, onLogout }) {
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/" aria-label="Parque del Cafe">
          <img src={brandLogo} alt="Parque del Cafe" />
        </a>

        <nav className="admin-nav" aria-label="Navegacion principal">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                className={`admin-nav__item ${item.active ? 'is-active' : ''}`}
                key={item.label}
                type="button"
              >
                <Icon size={19} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button className="sidebar-logout" type="button" onClick={onLogout}>
          <ArrowLeft size={18} aria-hidden="true" />
          Salir
        </button>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  )
}
