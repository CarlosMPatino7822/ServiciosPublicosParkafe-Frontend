import { apiRequest } from './apiClient.js'

export function getReadingSheet(periodo) {
  return apiRequest(`/lecturas/planilla?periodo=${encodeURIComponent(periodo)}`)
}

export function createReading(reading) {
  return apiRequest('/lecturas', {
    method: 'POST',
    body: JSON.stringify(reading),
  })
}

export function updateReading(idLectura, reading) {
  return apiRequest(`/lecturas/${idLectura}`, {
    method: 'PUT',
    body: JSON.stringify(reading),
  })
}

