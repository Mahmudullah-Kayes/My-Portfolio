import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-500 to-blue-500">
          404
        </h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-slate-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 