import { parsePortablePath, relativePortablePath, type PathParts } from '@lp-labs/portable-paths';
const parts: PathParts = parsePortablePath('/a');
const relative: string = relativePortablePath('/a/b', '/a/c');
// @ts-expect-error style must be posix or win32.
parsePortablePath('x', 'windows');
void [parts, relative];
