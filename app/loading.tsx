export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <span className="size-full gird place-items-center">Loading...</span>
      </div>
    </div>
  )
}
