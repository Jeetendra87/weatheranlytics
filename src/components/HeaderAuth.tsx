import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export function HeaderAuth() {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
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
        className="h-11 shrink-0 cursor-pointer rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-sky-50"
      >
        Login / Sign up
      </button>
    );
  }

  return (
    <Link
      to="/profile"
      className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-sky-50"
    >
      {user?.picture && (
        <img src={user.picture} alt="" className="h-6 w-6 rounded-full" />
      )}
      <span>Profile</span>
    </Link>
  );
}
