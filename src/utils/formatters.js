export function formatNumber(value) {
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(value || 0))
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
