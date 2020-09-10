import { readdir } from 'fs/promises'
import { join, basename } from 'path'

async function* dirs(path = '.') {
  yield path
  for (const dirent of await readdir(path, { withFileTypes: true }))
    if (dirent.isDirectory()) {
      yield* dirs(join(path, dirent.name))
    } else {
      yield join(path, dirent.name)
    }
}

async function* empty() {
  // empty
}

async function toArray(iter = empty()) {
  const r = []
  for await (const x of iter) r.push(x)
  return r
}

// eslint-disable-next-line no-unused-vars
async function search(iter = empty(), test = (_) => false) {
  for await (const p of iter)
    if (test(p)) {
      return p
    }
}

async function searchByName(iter = empty(), query = '') {
  return search(iter, (p) => basename(p) === query)
}

export { dirs, toArray, search, searchByName }
