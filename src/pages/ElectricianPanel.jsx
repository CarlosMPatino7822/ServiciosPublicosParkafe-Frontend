import { useState } from 'react'
import { ClipboardList, Droplets, FileSpreadsheet, Flame, Plus, Save, Send, X, Zap } from 'lucide-react'
import { AppLayout } from '../components/AppLayout.jsx'
import { baseServiceRows, currentPeriod, serviceConfig } from '../data/mockData.js'
import { formatCurrency, formatNumber } from '../utils/formatters.js'

const serviceIcons = {
  energy: Zap,
  water: Droplets,
  gas: Flame,
}

export function ElectricianPanel({ onLogout }) {
  const [documentStatus, setDocumentStatus] = useState('none')
  const [activeService, setActiveService] = useState('energy')
  const [services, setServices] = useState(() =>
    Object.fromEntries(
      Object.keys(serviceConfig).map((serviceKey) => [
        serviceKey,
        baseServiceRows.map((row) => ({
          ...row,
          previous: serviceKey === 'energy' ? row.previous : Math.round(row.previous / 12),
          current: serviceKey === 'energy' ? row.current : Math.round(row.current / 12) + row.id * 3,
        })),
      ]),
    ),
  )

  const activeRows = services[activeService]
  const activeConfig = serviceConfig[activeService]
  const isPublished = documentStatus === 'published'
  const hasDocument = documentStatus !== 'none'

  const totals = activeRows.reduce(
    (summary, row) => {
      const consumption = Math.max(Number(row.current || 0) - Number(row.previous || 0), 0)
      return {
        consumption: summary.consumption + consumption,
        amount: summary.amount + consumption * activeConfig.rate,
      }
    },
    { consumption: 0, amount: 0 },
  )

  const handleReadingChange = (rowId, value) => {
    setServices((currentServices) => ({
      ...currentServices,
      [activeService]: currentServices[activeService].map((row) =>
        row.id === rowId ? { ...row, current: value } : row,
      ),
    }))
  }

  const cancelDocument = () => {
    if (documentStatus === 'draft') {
      setDocumentStatus('none')
    }
  }

  return (
    <AppLayout
      onLogout={onLogout}
      navItems={[{ label: 'Formato mensual', icon: ClipboardList, active: true }]}
    >
      <div className="operator-page">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Electrico encargado</p>
            <h1>Lectura mensual de servicios</h1>
          </div>
          <div className={`document-state is-${documentStatus}`}>
            {documentStatus === 'none' && 'Sin crear'}
            {documentStatus === 'draft' && 'Borrador'}
            {documentStatus === 'published' && 'Publicado'}
          </div>
        </header>

        <section className="operator-summary">
          <div>
            <span>Periodo</span>
            <strong>{currentPeriod}</strong>
          </div>
          <div>
            <span>Encargado</span>
            <strong>Carlos Ramirez</strong>
          </div>
          <div>
            <span>Regla del mes</span>
            <strong>Un formato activo</strong>
          </div>
        </section>

        {!hasDocument ? (
          <section className="empty-document-panel">
            <FileSpreadsheet size={42} aria-hidden="true" />
            <h2>No hay formato creado para {currentPeriod}</h2>
            <p>
              El electrico puede crear el documento del mes actual una sola vez y guardarlo como
              borrador antes de publicarlo.
            </p>
            <button
              className="primary-action create-document-action"
              type="button"
              onClick={() => setDocumentStatus('draft')}
            >
              <Plus size={18} aria-hidden="true" />
              Crear formato del mes
            </button>
          </section>
        ) : (
          <section className="service-editor excel-document">
            <div className="editor-toolbar">
              <div className="service-tabs" role="tablist" aria-label="Servicios">
                {Object.entries(serviceConfig).map(([serviceKey, service]) => {
                  const Icon = serviceIcons[serviceKey]
                  return (
                    <button
                      className={`service-tab ${activeService === serviceKey ? 'is-active' : ''}`}
                      key={serviceKey}
                      type="button"
                      onClick={() => setActiveService(serviceKey)}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {service.label}
                    </button>
                  )
                })}
              </div>

              <div className="document-actions">
                <button
                  className="secondary-action"
                  disabled={isPublished}
                  type="button"
                  onClick={cancelDocument}
                >
                  <X size={17} aria-hidden="true" />
                  Cancelar
                </button>
                <button
                  className="secondary-action"
                  disabled={isPublished}
                  type="button"
                  onClick={() => setDocumentStatus('draft')}
                >
                  <Save size={17} aria-hidden="true" />
                  Guardar
                </button>
                <button
                  className="primary-action publish-action"
                  disabled={isPublished}
                  type="button"
                  onClick={() => setDocumentStatus('published')}
                >
                  <Send size={17} aria-hidden="true" />
                  Publicar
                </button>
              </div>
            </div>

            <div className="excel-sheet">
              <div className="sheet-title">
                <h2>PARQUE NACIONAL DEL CAFE</h2>
                <p>LECTURA DE CONTADORES</p>
              </div>

              <table className="excel-table">
                <thead>
                  <tr className="excel-meta-row">
                    <th colSpan="3">Formato mensual</th>
                    <th>#</th>
                    <th>25/04/2026</th>
                    <th>25/05/2026</th>
                    <th>Consumo</th>
                    <th>Valor consumo</th>
                  </tr>
                  <tr className="service-band">
                    <th colSpan="8">{activeConfig.label.toUpperCase()}</th>
                  </tr>
                  <tr>
                    <th>NIT</th>
                    <th>Cliente</th>
                    <th>Local comercial</th>
                    <th>#</th>
                    <th>Lectura anterior</th>
                    <th>Lectura actual</th>
                    <th>Consumo</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRows.map((row) => {
                    const consumption = Math.max(Number(row.current || 0) - Number(row.previous || 0), 0)
                    const amount = consumption * activeConfig.rate

                    return (
                      <tr key={row.id}>
                        <td>{row.nit}</td>
                        <td>{row.client}</td>
                        <td>
                          <strong>{row.location}</strong>
                        </td>
                        <td className="row-number">{row.id}</td>
                        <td>{formatNumber(row.previous)}</td>
                        <td>
                          <input
                            aria-label={`Lectura actual ${row.location}`}
                            className="reading-input"
                            disabled={isPublished}
                            inputMode="numeric"
                            value={row.current}
                            onChange={(event) => handleReadingChange(row.id, event.target.value)}
                          />
                        </td>
                        <td>
                          {formatNumber(consumption)} {activeConfig.unit}
                        </td>
                        <td>{formatCurrency(amount)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6">TOTAL CONSUMO</td>
                    <td>
                      {formatNumber(totals.consumption)} {activeConfig.unit}
                    </td>
                    <td>{formatCurrency(totals.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  )
}
