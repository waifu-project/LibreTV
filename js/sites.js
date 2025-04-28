const REMOTE_SITES = "https://raw.githubusercontent.com/waifu-project/v1/refs/heads/main/yoyo.json"
const CACHE_KEY = "__SITES"

let API_SITES = {}

async function fetchRemoteData() {
  /** @type {Array<{name: string, nsfw: boolean, api: { root: string, path: string }}>} */
  const data = await (await fetch(REMOTE_SITES)).json()
  return data
}

const $randomID = ()=> Math.random().toString(36).substring(2,7)

async function fetchRemoteConfig() {
  /** @type {Record<string, { api: string, name: string, detail: string, filterAdRule?: string}>} */
  const result = {}
  const sites = await fetchRemoteData()
  for (const site of sites) {
    const id = $randomID()
    const api = site.api.root + site.api.path
    result[id] = { api, name: site.name, adult: site.nsfw }
  }
  return result
}

async function fetchRemoteConfigWithCache() {
  const cache = localStorage.getItem(CACHE_KEY)
  let result = []
  if (!cache) {
    result = await fetchRemoteConfig()
    localStorage.setItem(CACHE_KEY, JSON.stringify(result))
  } else {
    result = JSON.parse(localStorage.getItem(CACHE_KEY)) || []
  }
  return result
}