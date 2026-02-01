import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export function Profile() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sky-50 text-slate-800">
        <header className="border-b border-sky-200/60 bg-white/90 shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link to="/" className="text-xl font-bold text-sky-800 hover:text-sky-600">
              ☀️ Weather Analytics
            </Link>
            <Link
              to="/"
              className="cursor-pointer rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50"
            >
              Back to Home
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-800">Profile</h1>
          <p className="mb-8 text-slate-600">Sign in with Google to access your profile.</p>
          <button
            type="button"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  connection: 'google-oauth2',
                  prompt: 'select_account',
                },
              })
            }
            className="cursor-pointer rounded-xl bg-sky-600 px-8 py-3 font-semibold text-white transition hover:bg-sky-700"
          >
            Login / Sign up
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <header className="border-b border-sky-200/60 bg-white/90 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold text-sky-800 hover:text-sky-600">
            ☀️ Weather Analytics
          </Link>
          <Link
            to="/"
            className="cursor-pointer rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50"
          >
            Back to Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Profile</h1>
        <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex justify-center">
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name ?? 'Profile'}
                className="h-20 w-20 rounded-full border-2 border-sky-200"
              />
            )}
          </div>
          <p className="mb-1 text-sm text-slate-500">Name</p>
          <p className="mb-4 font-semibold text-slate-800">{user?.name ?? '—'}</p>
          <p className="mb-1 text-sm text-slate-500">Email</p>
          <p className="font-semibold text-slate-800">{user?.email ?? '—'}</p>
          <button
            type="button"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="mt-6 w-full cursor-pointer rounded-xl border border-red-200 bg-white py-3 font-semibold text-red-600 transition hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}
