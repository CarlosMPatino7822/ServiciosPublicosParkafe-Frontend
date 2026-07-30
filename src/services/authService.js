import { apiRequest } from './apiClient.js'

export function login({ usuario, password }) {
  return apiRequest('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, password }),
  })
}

export function getRoleKey(idRol) {
  const roleMap = {
    1: 'systemAdmin',
    2: 'electrician',
    3: 'electricalAdmin',
  }

  return roleMap[idRol] ?? 'electrician'
}

