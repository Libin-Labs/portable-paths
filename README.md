# @lp-labs/portable-paths

Lexical POSIX/Windows path parsing, normalization, resolution, and relative-path calculation. All
separators in returned paths are `/`. The library is platform-independent and does not consult the
filesystem, current directory, symlinks, mount points, or permissions; normalized paths are not a
filesystem security boundary.

## Install and quick start

```bash
npm install @lp-labs/portable-paths
```

```js
import {
  normalizePortablePath,
  relativePortablePath,
  resolvePortablePath,
} from '@lp-labs/portable-paths';

const file = resolvePortablePath('/workspace/app', '../data/input.csv');
if (file !== '/workspace/data/input.csv') throw new Error('Lexical resolution failed');
if (relativePortablePath('/workspace/app', file) !== '../data/input.csv')
  throw new Error('Relative path failed');
if (normalizePortablePath('C:\\work\\..\\src', 'win32') !== 'C:/src')
  throw new Error('Windows path failed');
```

Both ESM and CommonJS entry points have TypeScript declarations. There are no runtime or peer dependencies.

## API and path model

- `parsePortablePath(path, style?)` returns immutable `PathParts` (`root`, normalized `segments`,
  and `absolute`). `PathStyle` is `'posix' | 'win32'`; default is POSIX.
- `normalizePortablePath(path, style?)` collapses repeated separators and `.` and resolves `..`
  lexically. Absolute paths clamp `..` at their root; relative paths retain leading parents.
- `resolvePortablePath(base, path, style?)` joins a relative path to an explicit base; an absolute
  target replaces the base.
- `relativePortablePath(from, to, style?)` returns the lexical route from `from` to `to`, or the
  normalized target when roots differ.

Windows drive letters are uppercased, separators accepted as either slash, and segment comparisons
for `relativePortablePath` are case-insensitive. UNC server/share roots are preserved as a root.
Drive-relative paths such as `C:folder` remain relative; they are not treated as `C:/folder`.

## Errors, limits, and customization

Non-string paths and NUL-containing paths throw `TypeError`. Functions accept only the two documented
styles. Returned path components are snapshots, and no global working directory is consulted. For
security-sensitive file access, separately enforce an application-owned root after resolving through
the actual filesystem and account for symlinks, case rules, device names, and races.

## Performance and scope

Each operation is O(number of path segments) time and memory. This is path-string algebra only: there
is no filesystem I/O, URL encoding, glob interpretation, symlink canonicalization, or containment
guarantee. Input length is bounded by the JavaScript string available to the caller.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
