export default function Button({ children, ...props }) {
  return (
    <button
      type="button"
      className="rounded bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
      {...props}
    >
      {children}
    </button>
  )
}
