import './App.css'
import brandLogo from './assets/logo-parque-del-cafe.png'

function App() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="login-page">
      <header className="brand-bar">
        <a className="brand" href="/" aria-label="Parque del Cafe">
          <img src={brandLogo} alt="Parque del Cafe" className="brand-logo" />
        </a>
      </header>

      <main className="login-stage">
        <section className="login-card" aria-labelledby="login-title">
          <h1 id="login-title">INICIO DE SESION</h1>

          <div className="card-ornament" aria-hidden="true">
            <span className="card-ornament__line"></span>
            <span className="card-ornament__badge">O</span>
            <span className="card-ornament__line"></span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Usuario</span>
              <input
                type="text"
                name="username"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span className="field__label">Contrasena</span>
              <input
                type="password"
                name="password"
                placeholder="Ingresa tu contrasena"
                autoComplete="current-password"
              />
            </label>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" name="remember" />
                <span>Recordarme</span>
              </label>

              <a href="#recuperacion">Olvido su contrasena?</a>
            </div>

            <button className="login-button" type="submit">
              Entrar
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
