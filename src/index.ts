export type PathStyle = 'posix' | 'win32';
export interface PathParts {
  readonly root: string;
  readonly segments: readonly string[];
  readonly absolute: boolean;
}
function validate(path: string): void {
  if (typeof path !== 'string' || path.includes('\0'))
    throw new TypeError('Path must be a string without NUL');
}
export function parsePortablePath(path: string, style: PathStyle = 'posix'): PathParts {
  validate(path);
  const normalized = style === 'win32' ? path.replace(/\\/g, '/') : path;
  let root = '';
  let rest = normalized;
  let absolute = false;
  if (style === 'win32') {
    const drive = /^([A-Za-z]:)(\/)?/.exec(normalized);
    const unc = /^(\/\/[^/]+\/[^/]+)(?:\/|$)/.exec(normalized);
    if (unc) {
      root = unc[1]!;
      rest = normalized.slice(unc[0].length);
      absolute = true;
    } else if (drive) {
      root = `${drive[1]!.toUpperCase()}${drive[2] ? '/' : ''}`;
      rest = normalized.slice(drive[0].length);
      absolute = Boolean(drive[2]);
    } else if (normalized.startsWith('/')) {
      root = '/';
      rest = normalized.replace(/^\/+/, '');
      absolute = true;
    }
  } else if (normalized.startsWith('/')) {
    root = '/';
    rest = normalized.replace(/^\/+/, '');
    absolute = true;
  }
  const segments: string[] = [];
  for (const segment of rest.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..' && segments.length > 0 && segments[segments.length - 1] !== '..')
      segments.pop();
    else if (segment === '..' && absolute) continue;
    else segments.push(segment);
  }
  return Object.freeze({ root, segments: Object.freeze(segments), absolute });
}
export function normalizePortablePath(path: string, style: PathStyle = 'posix'): string {
  const parts = parsePortablePath(path, style);
  const body = parts.segments.join('/');
  if (parts.root) return `${parts.root}${body}` || parts.root;
  return body || '.';
}
export function resolvePortablePath(
  base: string,
  path: string,
  style: PathStyle = 'posix',
): string {
  const target = parsePortablePath(path, style);
  if (target.absolute) return normalizePortablePath(path, style);
  const root = parsePortablePath(base, style);
  const joined = `${root.root}${root.segments.join('/')}${root.segments.length ? '/' : ''}${path}`;
  const resolved = parsePortablePath(joined, style);
  if (!root.absolute && resolved.segments[0] === '..') return resolved.segments.join('/');
  return (
    `${resolved.root}${resolved.segments.join('/')}` || (resolved.absolute ? resolved.root : '.')
  );
}
export function relativePortablePath(from: string, to: string, style: PathStyle = 'posix'): string {
  const a = parsePortablePath(from, style);
  const b = parsePortablePath(to, style);
  const fold =
    style === 'win32' ? (value: string) => value.toLowerCase() : (value: string) => value;
  if (fold(a.root) !== fold(b.root) || a.absolute !== b.absolute)
    return normalizePortablePath(to, style);
  let common = 0;
  while (
    common < a.segments.length &&
    common < b.segments.length &&
    fold(a.segments[common]!) === fold(b.segments[common]!)
  )
    common++;
  return (
    [...Array(a.segments.length - common).fill('..'), ...b.segments.slice(common)].join('/') || '.'
  );
}
