import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePortablePath,
  parsePortablePath,
  relativePortablePath,
  resolvePortablePath,
} from '../dist/esm/index.js';
test('normalizes posix dot segments lexically', () => {
  assert.equal(normalizePortablePath('/a//b/../c'), '/a/c');
});
test('preserves leading parents in relative paths', () => {
  assert.equal(normalizePortablePath('../../a/../b'), '../../b');
});
test('normalizes drive roots and separators', () => {
  assert.equal(normalizePortablePath('c:\\\\a\\\\..\\\\b', 'win32'), 'C:/b');
});
test('parses a windows UNC share root', () => {
  assert.equal(parsePortablePath('\\\\server\\share\\a', 'win32').root, '//server/share');
});
test('resolves against the supplied lexical base', () => {
  assert.equal(resolvePortablePath('/work/app', '../data'), '/work/data');
});
test('computes paths relative to a base', () => {
  assert.equal(relativePortablePath('/a/b', '/a/c/file'), '../c/file');
});
test('compares windows segments case insensitively', () => {
  assert.equal(relativePortablePath('C:\\\\App', 'c:\\\\app\\\\src', 'win32'), 'src');
});
test('rejects NUL bytes', () => {
  assert.throws(() => normalizePortablePath('a\0b'));
});
