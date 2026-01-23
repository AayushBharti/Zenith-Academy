import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-black-100 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="font-semibold text-base text-blue-500">404</p>
        <h1 className="mt-4 font-bold text-3xl tracking-tight sm:text-5xl dark:text-gray-100">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 dark:text-gray-100">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            className="rounded-md bg-blue-600 px-3.5 py-2.5 font-semibold text-sm text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-solid focus-visible:outline-offset-2"
            href="/"
          >
            Go back home
          </Link>
          <a className="font-semibold text-sm dark:text-gray-400" href="/">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
