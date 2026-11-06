import { normalizePortablePath, type PathStyle, type PathParts } from '@lp-labs/portable-paths';
const style: PathStyle = 'win32';
const path: string = normalizePortablePath('C:\\work\\..\\data', style);
const parts: PathParts = { root: '/', segments: ['x'], absolute: true };
// @ts-expect-error path style is a supported discriminant.
normalizePortablePath('x', 'native');
void [path, parts];
