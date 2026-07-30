export function Metric({ label, value, tone = 'neutral' }) {
  return (
    <article className={`metric-card is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
