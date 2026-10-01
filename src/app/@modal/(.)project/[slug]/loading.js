export default function ProjectModalLoading() {
  return (
    <div
      role="status"
      aria-label="Loading project"
      className="fixed inset-0 z-30 overflow-hidden"
      style={{ backgroundColor: 'rgb(0 0 0 / 80%)' }}
    >
      <div aria-hidden="true" style={{ height: '3rem' }} />
      <div className="h-dvh border-t border-white/20 bg-black" />
      <span className="sr-only">Loading project…</span>
    </div>
  )
}
