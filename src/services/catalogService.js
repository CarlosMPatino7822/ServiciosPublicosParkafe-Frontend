import { apiRequest } from './apiClient.js'

export function listRoles() {
  return apiRequest('/roles')
}

export function listServices() {
  return apiRequest('/servicios')
}

export function createService(service) {
  return apiRequest('/servicios', {
    method: 'POST',
    body: JSON.stringify(service),
  })
}

export function listConcessionaires() {
  return apiRequest('/concesionarios')
}

export function createConcessionaire(concessionaire) {
  return apiRequest('/concesionarios', {
    method: 'POST',
    body: JSON.stringify(concessionaire),
  })
}

export function listConcessionaireServices() {
  return apiRequest('/concesionario-servicios')
}

export function createConcessionaireService(relation) {
  return apiRequest('/concesionario-servicios', {
    method: 'POST',
    body: JSON.stringify(relation),
  })
}
