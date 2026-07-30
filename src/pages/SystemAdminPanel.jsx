import { useEffect, useMemo, useState } from 'react'
import {
  Download,
  FileSpreadsheet,
  History,
  Pencil,
  Plus,
  Search,
  Settings2,
  UploadCloud,
  UserCog,
} from 'lucide-react'
import { AppLayout } from '../components/AppLayout.jsx'
import { Metric } from '../components/Metric.jsx'
import { allUsers, publicServiceDocuments } from '../data/mockData.js'
import {
  createConcessionaire,
  createConcessionaireService,
  createService,
  listConcessionaireServices,
  listConcessionaires,
  listRoles,
  listServices,
} from '../services/catalogService.js'
import { createUser, listUsers, updateUser } from '../services/userService.js'
import { formatNumber } from '../utils/formatters.js'

const emptyUserForm = {
  firstName: '',
  lastName: '',
  documentId: '',
  username: '',
  password: '',
  role: 'Electrico',
}

const emptyConcessionaireForm = {
  nit: '',
  nombre: '',
  ubicacion: '',
  propietario: '',
  telefono: '',
}

const emptyServiceForm = {
  nombre: '',
  tarifa: '',
}

const emptyRelationForm = {
  idConcesionario: '',
  idServicio: '',
  numeroContador: '',
  estado: 'ACTIVO',
}

const roleLabelByApiName = {
  SISTEMAS: 'Administrador',
  ELECTRICO: 'Electrico',
  ADMINELECTRICOS: 'Administrador electrico',
}

const roleNameByLabel = {
  Administrador: 'SISTEMAS',
  Electrico: 'ELECTRICO',
  'Administrador electrico': 'ADMINELECTRICOS',
}

function mapUserFromApi(user) {
  return {
    id: user.idUsuario,
    firstName: user.nombre,
    lastName: user.apellido,
    documentId: user.cedula,
    username: user.usuario,
    password: user.password,
    role: roleLabelByApiName[user.nombreRol] ?? roleLabelByApiName[user.rol] ?? `Rol ${user.idRol ?? '-'}`,
    idRol: user.idRol,
    status: user.estado === 'ACTIVO' ? 'active' : 'inactive',
  }
}

function getRoleId(roles, label) {
  const apiName = roleNameByLabel[label]
  return roles.find((role) => role.nombre === apiName)?.idRol
}

const initialFormatSettings = {
  Energia: {
    service: 'Energia',
    unit: 'kWh',
    rate: 325,
    columns: 'NIT, Cliente, Local comercial, Lectura anterior, Lectura actual, Consumo, Valor',
  },
  Agua: {
    service: 'Agua',
    unit: 'm3',
    rate: 4600,
    columns: 'NIT, Cliente, Local comercial, Lectura anterior, Lectura actual, Consumo, Valor',
  },
  Gas: {
    service: 'Gas',
    unit: 'm3',
    rate: 2850,
    columns: 'NIT, Cliente, Local comercial, Lectura anterior, Lectura actual, Consumo, Valor',
  },
}

export function SystemAdminPanel({ onLogout }) {
  const [users, setUsers] = useState(allUsers)
  const [roles, setRoles] = useState([])
  const [services, setServices] = useState([])
  const [concessionaires, setConcessionaires] = useState([])
  const [concessionaireServices, setConcessionaireServices] = useState([])
  const [search, setSearch] = useState('')
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [concessionaireForm, setConcessionaireForm] = useState(emptyConcessionaireForm)
  const [serviceForm, setServiceForm] = useState(emptyServiceForm)
  const [relationForm, setRelationForm] = useState(emptyRelationForm)
  const [integrationMessage, setIntegrationMessage] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('Energia')
  const [formatSettings, setFormatSettings] = useState(initialFormatSettings)

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [rolesData, usersData, servicesData, concessionairesData, relationsData] =
          await Promise.allSettled([
            listRoles(),
            listUsers(),
            listServices(),
            listConcessionaires(),
            listConcessionaireServices(),
          ])

        const loadedRoles = rolesData.status === 'fulfilled' ? rolesData.value : []
        setRoles(loadedRoles)

        if (usersData.status === 'fulfilled') {
          setUsers(
            usersData.value.map((user) => {
              const role = loadedRoles.find((loadedRole) => loadedRole.idRol === user.idRol)
              return {
                ...mapUserFromApi(user),
                role: roleLabelByApiName[role?.nombre] ?? `Rol ${user.idRol ?? '-'}`,
              }
            }),
          )
        }

        if (servicesData.status === 'fulfilled') {
          setServices(servicesData.value)
        }

        if (concessionairesData.status === 'fulfilled') {
          setConcessionaires(concessionairesData.value)
        }

        if (relationsData.status === 'fulfilled') {
          setConcessionaireServices(relationsData.value)
        }

        const failedLoads = [rolesData, usersData, servicesData, concessionairesData, relationsData].filter(
          (result) => result.status === 'rejected',
        ).length

        if (failedLoads > 0) {
          setIntegrationMessage(
            'Algunos catalogos del backend todavia no estan disponibles. La pantalla sigue funcionando con los datos que si respondieron.',
          )
        }
      } catch {
        setIntegrationMessage('No fue posible cargar datos administrativos desde el backend.')
      }
    }

    loadAdminData()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((user) =>
      [user.firstName, user.lastName, user.documentId, user.username, user.role, user.status]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [users, search])

  const activeUsers = users.filter((user) => user.status === 'active').length
  const inactiveUsers = users.length - activeUsers
  const currentFormat = formatSettings[selectedFormat]

  const handleUserFormChange = (event) => {
    const { name, value } = event.target
    setUserForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()

    const roleId = getRoleId(roles, userForm.role)

    try {
      const createdUser = await createUser({
        cedula: userForm.documentId.trim(),
        nombre: userForm.firstName.trim(),
        apellido: userForm.lastName.trim(),
        usuario: userForm.username.trim(),
        password: userForm.password,
        estado: 'ACTIVO',
        idRol: roleId,
      })

      setUsers((currentUsers) => [
        {
          ...mapUserFromApi(createdUser),
          role: userForm.role,
        },
        ...currentUsers,
      ])
      setUserForm(emptyUserForm)
      setIntegrationMessage('Usuario creado correctamente en el backend.')
    } catch {
      setIntegrationMessage('No se pudo crear el usuario. Revisa que la cedula y el usuario no existan ya.')
    }
  }

  const handleFormatChange = (event) => {
    const { name, value } = event.target
    setFormatSettings((currentSettings) => ({
      ...currentSettings,
      [selectedFormat]: {
        ...currentSettings[selectedFormat],
        [name]: name === 'rate' ? Number(value) : value,
      },
    }))
  }

  const handleConcessionaireFormChange = (event) => {
    const { name, value } = event.target
    setConcessionaireForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleServiceFormChange = (event) => {
    const { name, value } = event.target
    setServiceForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleRelationFormChange = (event) => {
    const { name, value } = event.target
    setRelationForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleCreateConcessionaire = async (event) => {
    event.preventDefault()

    try {
      const createdConcessionaire = await createConcessionaire(concessionaireForm)
      setConcessionaires((currentConcessionaires) => [createdConcessionaire, ...currentConcessionaires])
      setConcessionaireForm(emptyConcessionaireForm)
      setIntegrationMessage('Concesionario creado correctamente.')
    } catch {
      setIntegrationMessage('No se pudo crear el concesionario. Revisa que la tabla exista y los datos sean validos.')
    }
  }

  const handleCreateService = async (event) => {
    event.preventDefault()

    try {
      const createdService = await createService({
        nombre: serviceForm.nombre.trim(),
        tarifa: Number(serviceForm.tarifa),
      })
      setServices((currentServices) => [createdService, ...currentServices])
      setServiceForm(emptyServiceForm)
      setIntegrationMessage('Servicio creado correctamente.')
    } catch {
      setIntegrationMessage('No se pudo crear el servicio. Revisa que la tarifa sea valida.')
    }
  }

  const handleCreateRelation = async (event) => {
    event.preventDefault()

    try {
      const createdRelation = await createConcessionaireService({
        idConcesionario: Number(relationForm.idConcesionario),
        idServicio: Number(relationForm.idServicio),
        numeroContador: Number(relationForm.numeroContador),
        estado: relationForm.estado,
      })
      setConcessionaireServices((currentRelations) => [createdRelation, ...currentRelations])
      setRelationForm(emptyRelationForm)
      setIntegrationMessage('Contador asociado correctamente al concesionario.')
    } catch {
      setIntegrationMessage('No se pudo asociar el contador. Revisa concesionario, servicio y numero de contador.')
    }
  }

  const toggleStatus = async (userId) => {
    const selectedUser = users.find((user) => user.id === userId)

    if (!selectedUser) {
      return
    }

    const nextStatus = selectedUser.status === 'active' ? 'inactive' : 'active'

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'active' ? 'inactive' : 'active',
            }
          : user,
      ),
    )

    try {
      await updateUser(selectedUser.documentId, {
        cedula: selectedUser.documentId,
        nombre: selectedUser.firstName,
        apellido: selectedUser.lastName,
        usuario: selectedUser.username,
        password: selectedUser.password ?? 'admin123',
        estado: nextStatus === 'active' ? 'ACTIVO' : 'INACTIVO',
        idRol: selectedUser.idRol,
      })
    } catch {
      setIntegrationMessage('El estado cambio en pantalla, pero no se pudo sincronizar con el backend.')
    }
  }

  return (
    <AppLayout
      onLogout={onLogout}
      navItems={[
        { label: 'Panel general', icon: UserCog, active: true },
        { label: 'Registros', icon: History },
        { label: 'Formatos', icon: Settings2 },
      ]}
    >
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Administrador / Sistemas</p>
          <h1>Control general de servicios publicos</h1>
        </div>
        <div className="document-actions admin-export-actions">
          <button className="secondary-action" type="button">
            <Download size={17} aria-hidden="true" />
            Exportar Excel
          </button>
          <button className="primary-action publish-action" type="button">
            <UploadCloud size={17} aria-hidden="true" />
            Publicar SAP
          </button>
        </div>
      </header>

      <section className="metrics-row" aria-label="Resumen administrativo">
        <Metric label="Documentos registrados" value={publicServiceDocuments.length} />
        <Metric label="Usuarios activos" value={activeUsers} tone="green" />
        <Metric label="Usuarios inactivos" value={inactiveUsers} tone="red" />
      </section>

      {integrationMessage ? <p className="integration-message">{integrationMessage}</p> : null}

      <section className="system-grid">
        <div className="form-panel system-user-form">
          <div className="section-heading">
            <span className="section-icon">
              <Plus size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>Crear usuario</h2>
              <p>Alta de electricos, administradores electricos y administradores.</p>
            </div>
          </div>

          <form className="electrician-form system-create-form" onSubmit={handleCreateUser}>
            <label className="field compact-field">
              <span className="field-label">Nombre</span>
              <input
                name="firstName"
                placeholder="Nombre"
                required
                value={userForm.firstName}
                onChange={handleUserFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Apellido</span>
              <input
                name="lastName"
                placeholder="Apellido"
                required
                value={userForm.lastName}
                onChange={handleUserFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Cedula</span>
              <input
                inputMode="numeric"
                name="documentId"
                placeholder="Numero de cedula"
                required
                value={userForm.documentId}
                onChange={handleUserFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Usuario</span>
              <input
                name="username"
                placeholder="usuario.apellido"
                required
                value={userForm.username}
                onChange={handleUserFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Contrasena</span>
              <input
                name="password"
                placeholder="Contrasena temporal"
                required
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Rol</span>
              <select name="role" value={userForm.role} onChange={handleUserFormChange}>
                {['Electrico', 'Administrador electrico', 'Administrador'].map((roleLabel) => (
                  <option key={roleLabel}>{roleLabel}</option>
                ))}
              </select>
            </label>

            <button className="primary-action" type="submit">
              <Plus size={18} aria-hidden="true" />
              Crear usuario
            </button>
          </form>
        </div>

        <div className="users-panel system-documents-panel">
          <div className="section-heading list-heading">
            <div>
              <h2>Historial de documentos</h2>
              <p>Consulta los formatos creados y su estado de exportacion.</p>
            </div>
            <button className="status-action" type="button">
              <FileSpreadsheet size={16} aria-hidden="true" />
              Descargar seleccionado
            </button>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table documents-table">
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Creado por</th>
                  <th>Servicios</th>
                  <th>Consumo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {publicServiceDocuments.map((document) => (
                  <tr key={document.id}>
                    <td>
                      <strong>{document.period}</strong>
                    </td>
                    <td>{document.createdBy}</td>
                    <td>{document.services.join(', ')}</td>
                    <td>{formatNumber(document.totalConsumption)}</td>
                    <td>
                      <span className={`status-badge ${document.status === 'Exportado' ? 'is-active' : 'is-draft'}`}>
                        {document.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-panel format-panel">
          <div className="section-heading">
            <span className="section-icon">
              <Settings2 size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>Formatos configurables</h2>
              <p>Administracion de estructura para energia, agua y gas.</p>
            </div>
          </div>

          <div className="format-list">
            {['Energia', 'Agua', 'Gas'].map((format) => (
              <article className={`format-item ${selectedFormat === format ? 'is-selected' : ''}`} key={format}>
                <div>
                  <strong>{format}</strong>
                  <span>Columnas, concesionarios y calculos</span>
                </div>
                <button className="status-action" type="button" onClick={() => setSelectedFormat(format)}>
                  <Pencil size={15} aria-hidden="true" />
                  Editar
                </button>
              </article>
            ))}
          </div>

          <form className="format-editor-form">
            <label className="field compact-field">
              <span className="field-label">Servicio</span>
              <input name="service" value={currentFormat.service} onChange={handleFormatChange} />
            </label>
            <label className="field compact-field">
              <span className="field-label">Unidad</span>
              <input name="unit" value={currentFormat.unit} onChange={handleFormatChange} />
            </label>
            <label className="field compact-field">
              <span className="field-label">Tarifa base</span>
              <input
                inputMode="numeric"
                name="rate"
                type="number"
                value={currentFormat.rate}
                onChange={handleFormatChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Columnas del formato</span>
              <textarea name="columns" value={currentFormat.columns} onChange={handleFormatChange} />
            </label>
            <button className="secondary-action format-save-action" type="button">
              Guardar formato
            </button>
          </form>
        </div>
      </section>

      <section className="catalog-grid" aria-label="Catalogos del backend">
        <div className="form-panel catalog-card">
          <div className="section-heading">
            <span className="section-icon">
              <Settings2 size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>Servicios publicos</h2>
              <p>Crea y consulta los servicios disponibles para el formato.</p>
            </div>
          </div>

          <form className="electrician-form" onSubmit={handleCreateService}>
            <label className="field compact-field">
              <span className="field-label">Nombre del servicio</span>
              <input
                name="nombre"
                placeholder="Energia, Agua o Gas"
                required
                value={serviceForm.nombre}
                onChange={handleServiceFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Tarifa</span>
              <input
                inputMode="decimal"
                name="tarifa"
                placeholder="Ej: 3500"
                required
                type="number"
                value={serviceForm.tarifa}
                onChange={handleServiceFormChange}
              />
            </label>
            <button className="primary-action" type="submit">
              <Plus size={18} aria-hidden="true" />
              Crear servicio
            </button>
          </form>

          <div className="mini-list">
            {services.map((service) => (
              <article key={service.idServicio}>
                <strong>{service.nombre}</strong>
                <span>Tarifa: {formatNumber(service.tarifa ?? 0)}</span>
              </article>
            ))}
            {services.length === 0 ? <p>No hay servicios cargados desde backend.</p> : null}
          </div>
        </div>

        <div className="form-panel catalog-card">
          <div className="section-heading">
            <span className="section-icon">
              <UserCog size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>Concesionarios</h2>
              <p>Base editable de locales comerciales que apareceran en el formato.</p>
            </div>
          </div>

          <form className="electrician-form" onSubmit={handleCreateConcessionaire}>
            <label className="field compact-field">
              <span className="field-label">NIT</span>
              <input name="nit" required value={concessionaireForm.nit} onChange={handleConcessionaireFormChange} />
            </label>
            <label className="field compact-field">
              <span className="field-label">Nombre / local</span>
              <input
                name="nombre"
                required
                value={concessionaireForm.nombre}
                onChange={handleConcessionaireFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Ubicacion</span>
              <input
                name="ubicacion"
                required
                value={concessionaireForm.ubicacion}
                onChange={handleConcessionaireFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Propietario</span>
              <input
                name="propietario"
                required
                value={concessionaireForm.propietario}
                onChange={handleConcessionaireFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Telefono</span>
              <input
                name="telefono"
                value={concessionaireForm.telefono}
                onChange={handleConcessionaireFormChange}
              />
            </label>
            <button className="primary-action" type="submit">
              <Plus size={18} aria-hidden="true" />
              Crear concesionario
            </button>
          </form>

          <div className="mini-list">
            {concessionaires.slice(0, 5).map((concessionaire) => (
              <article key={concessionaire.idConcesionario}>
                <strong>{concessionaire.nombre}</strong>
                <span>
                  {concessionaire.nit} / {concessionaire.ubicacion}
                </span>
              </article>
            ))}
            {concessionaires.length === 0 ? <p>No hay concesionarios cargados desde backend.</p> : null}
          </div>
        </div>

        <div className="form-panel catalog-card">
          <div className="section-heading">
            <span className="section-icon">
              <FileSpreadsheet size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>Contadores por servicio</h2>
              <p>Relaciona cada concesionario con energia, agua o gas y su contador.</p>
            </div>
          </div>

          <form className="electrician-form" onSubmit={handleCreateRelation}>
            <label className="field compact-field">
              <span className="field-label">Concesionario</span>
              <select
                name="idConcesionario"
                required
                value={relationForm.idConcesionario}
                onChange={handleRelationFormChange}
              >
                <option value="">Seleccionar</option>
                {concessionaires.map((concessionaire) => (
                  <option key={concessionaire.idConcesionario} value={concessionaire.idConcesionario}>
                    {concessionaire.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact-field">
              <span className="field-label">Servicio</span>
              <select name="idServicio" required value={relationForm.idServicio} onChange={handleRelationFormChange}>
                <option value="">Seleccionar</option>
                {services.map((service) => (
                  <option key={service.idServicio} value={service.idServicio}>
                    {service.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact-field">
              <span className="field-label">Numero de contador</span>
              <input
                inputMode="numeric"
                name="numeroContador"
                required
                value={relationForm.numeroContador}
                onChange={handleRelationFormChange}
              />
            </label>
            <label className="field compact-field">
              <span className="field-label">Estado</span>
              <select name="estado" value={relationForm.estado} onChange={handleRelationFormChange}>
                <option>ACTIVO</option>
                <option>INACTIVO</option>
              </select>
            </label>
            <button className="primary-action" type="submit">
              <Plus size={18} aria-hidden="true" />
              Asociar contador
            </button>
          </form>

          <div className="mini-list">
            {concessionaireServices.slice(0, 5).map((relation) => (
              <article key={relation.idConcesionarioServicio}>
                <strong>Contador {relation.numeroContador}</strong>
                <span>
                  Concesionario #{relation.idConcesionario} / Servicio #{relation.idServicio}
                </span>
              </article>
            ))}
            {concessionaireServices.length === 0 ? <p>No hay relaciones cargadas desde backend.</p> : null}
          </div>
        </div>
      </section>

      <section className="users-panel system-users-panel">
        <div className="section-heading list-heading">
          <div>
            <h2>Manejo de todos los usuarios</h2>
            <p>Vista general de electricos, administradores electricos y administradores.</p>
          </div>
          <label className="search-box">
            <Search size={18} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar usuario"
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
                <th>Rol</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                  </td>
                  <td>{user.documentId}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge is-${user.status}`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="status-action"
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                    >
                      {user.status === 'active' ? 'Inactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
