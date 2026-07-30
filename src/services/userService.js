import { apiRequest } from './apiClient.js'

export function listUsers() {
  return apiRequest('/usuarios')
}

export function createUser(user) {
  return apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export function updateUser(cedula, user) {
  return apiRequest(`/usuarios/${cedula}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  })
}

export function deleteUser(cedula) {
  return apiRequest(`/usuarios/${cedula}`, {
    method: 'DELETE',
  })
}

