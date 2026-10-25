const AUTH_PATHS = ['/login', '/register'];

export function isSafeRedirect(path: string | null | undefined): path is string {
  if (!path) return false;
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (AUTH_PATHS.some((authPath) => path === authPath || path.startsWith(`${authPath}?`))) {
    return false;
  }
  return true;
}

export function getRedirectFromSearch(search: string): string {
  const params = new URLSearchParams(search);
  const redirect = params.get('redirect');
  return isSafeRedirect(redirect) ? redirect : '/';
}

export function withRedirect(path: string, redirect?: string | null) {
  if (!isSafeRedirect(redirect) || redirect === '/') return path;
  return `${path}?redirect=${encodeURIComponent(redirect)}`;
}

export function loginPath(from: string) {
  return withRedirect('/login', from);
}
