import { useMemo, useState } from 'react'
import { BadgeCheck, Plus, Search, UsersRound } from 'lucide-react'
import { AppLayout } from '../components/AppLayout.jsx'
import { Metric } from '../components/Metric.jsx'
import { initialElectricians } from '../data/mockData.js'

const emptyForm = {
  firstName: '',
  lastName: '',
  documentId: '',
  username: '',
  password: '',
}

export function ElectricalAdminPanel({ onLogout }) {
  const [electricians, setElectricians] = useState(initialElectricians)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')

  const filteredElectricians = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return electricians
    }

    return electricians.filter((electrician) =>
      [
        electrician.firstName,
        electrician.lastName,
        electrician.documentId,
        electrician.username,
        electrician.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [electricians, search])

  const activeCount = electricians.filter((electrician) => electrician.status === 'active').length
  const inactiveCount = electricians.length - activeCount

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleCreateElectrician = (event) => {
    event.preventDefault()

    const newElectrician = {
      id: Date.now(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      documentId: form.documentId.trim(),
      username: form.username.trim(),
      status: 'active',
    }

    setElectricians((currentElectricians) => [newElectrician, ...currentElectricians])
    setForm(emptyForm)
  }

  const toggleStatus = (electricianId) => {
    setElectricians((currentElectricians) =>
      currentElectricians.map((electrician) =>
        electrician.id === electricianId
          ? {
              ...electrician,
              status: electrician.status === 'active' ? 'inactive' : 'active',
            }
          : electrician,
      ),
    )
  }

  return (
    <AppLayout
      onLogout={onLogout}
      navItems={[{ label: 'Electricos', icon: UsersRound, active: true }]}
    >
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Administrador electrico</p>
          <h1>Gestion de usuarios electricos</h1>
        </div>
        <div className="operator-pill">
          <BadgeCheck size={18} aria-hidden="true" />
          Sesion activa
        </div>
      </header>

      <section className="metrics-row" aria-label="Resumen de usuarios">
        <Metric label="Electricos registrados" value={electricians.length} />
        <Metric label="Usuarios activos" value={activeCount} tone="green" />
        <Metric label="Usuarios inactivos" value={inactiveCount} tone="red" />
      </section>

      <section className="admin-workspace" id="usuarios">
        <div className="form-panel">
          <div className="section-heading">
            <span className="section-icon">
              <Plus size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>Crear electrico</h2>
              <p>El usuario se crea activo por defecto.</p>
            </div>
          </div>

          <form className="electrician-form" onSubmit={handleCreateElectrician}>
            <UserField label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} />
            <UserField label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} />
            <UserField
              inputMode="numeric"
              label="Cedula"
              name="documentId"
              placeholder="Numero de cedula"
              value={form.documentId}
              onChange={handleChange}
            />
            <UserField
              label="Usuario"
              name="username"
              placeholder="usuario.apellido"
              value={form.username}
              onChange={handleChange}
            />
            <UserField
              label="Contrasena"
              name="password"
              placeholder="Contrasena temporal"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <button className="primary-action" type="submit">
              <Plus size={18} aria-hidden="true" />
              Crear electrico
            </button>
          </form>
        </div>

        <div className="users-panel">
          <div className="section-heading list-heading">
            <div>
              <h2>Listado de electricos</h2>
              <p>Activa o inactiva usuarios segun su disponibilidad laboral.</p>
            </div>
            <label className="search-box">
              <Search size={18} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar"
              />
            </label>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cedula</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {filteredElectricians.map((electrician) => (
                  <tr key={electrician.id}>
                    <td>
                      <strong>
                        {electrician.firstName} {electrician.lastName}
                      </strong>
                    </td>
                    <td>{electrician.documentId}</td>
                    <td>{electrician.username}</td>
                    <td>
                      <span className={`status-badge is-${electrician.status}`}>
                        {electrician.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="status-action"
                        type="button"
                        onClick={() => toggleStatus(electrician.id)}
                      >
                        {electrician.status === 'active' ? 'Inactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

function UserField({ label, name, value, onChange, placeholder = label, type = 'text', inputMode }) {
  return (
    <label className="field compact-field">
      <span className="field-label">{label}</span>
      <input
        inputMode={inputMode}
        name={name}
        placeholder={placeholder}
        required
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}
