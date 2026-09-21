import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-6xl font-bold text-earth-900 mb-4">404</h1>
        <p className="text-xl text-earth-600 mb-8">Page Not Found</p>
        <p className="text-earth-500 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
        >
          Back to Home
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
