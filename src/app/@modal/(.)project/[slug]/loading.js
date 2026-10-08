export default function ProjectModalLoading() {
  return (
    <div
      role="status"
      aria-label="Loading project"
      className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden bg-black"
    >
      <span aria-hidden="true">...</span>
      <span className="sr-only">Loading project…</span>
    </div>
  )
}
