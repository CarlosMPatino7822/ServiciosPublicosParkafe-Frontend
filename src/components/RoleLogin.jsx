import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import brandLogo from '../assets/logo-parque-del-cafe.png'

export function RoleLogin({ message, onSubmit }) {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <a className="brand" href="/" aria-label="Parque del Cafe">
          <img src={brandLogo} alt="Parque del Cafe" className="brand-logo" />
        </a>
        <span className="header-product">Servicios Publicos</span>
      </header>

      <main className="auth-shell">
        <section className="auth-visual" aria-label="Servicios Publicos Parque del Cafe">
          <div className="visual-content">
            <p className="visual-kicker">Operacion mensual</p>
            <h1>Servicios Publicos</h1>
            <p className="visual-copy">
              Gestion de lecturas, consumos y trazabilidad para concesionarios.
            </p>
            <div className="service-strip" aria-label="Servicios gestionados">
              <span>Energia</span>
              <span>Agua</span>
              <span>Gas</span>
            </div>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="login-title">
          <div className="panel-heading">
            <span className="security-label">
              <ShieldCheck size={17} strokeWidth={2.2} aria-hidden="true" />
              Acceso seguro
            </span>
            <h2 id="login-title">Iniciar sesion</h2>
            <p>Ingresa con tu usuario autorizado.</p>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            <label className="field">
              <span className="field-label">Usuario</span>
              <span className="input-shell">
                <UserRound size={19} strokeWidth={2} aria-hidden="true" />
                <input
                  type="text"
                  name="username"
                  placeholder="Usuario institucional"
                  autoComplete="username"
                />
              </span>
            </label>

            <label className="field">
              <span className="field-label">Contrasena</span>
              <span className="input-shell">
                <LockKeyhole size={19} strokeWidth={2} aria-hidden="true" />
                <input
                  type="password"
                  name="password"
                  placeholder="Contrasena"
                  autoComplete="current-password"
                />
              </span>
            </label>

            <label className="remember-option">
              <input type="checkbox" name="remember" />
              <span>Recordarme en este equipo</span>
            </label>

            <button className="login-button" type="submit">
              <span>Entrar al sistema</span>
              <ArrowRight size={19} strokeWidth={2.3} aria-hidden="true" />
            </button>

            {message ? <p className="login-message">{message}</p> : null}
          </form>
        </section>
      </main>
    </div>
  )
}
