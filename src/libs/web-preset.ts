const HAS_WINDOW = typeof window !== 'undefined'
const HAS_DOCUMENT = typeof document !== 'undefined'

/**
 * Due to bug https://bugs.chromium.org/p/chromium/issues/detail?id=678075,
 * it's not reliable to detect if the browser is currently online or offline
 * based on `navigator.onLine`.
 * As a work around, we always assume it's online on first load, and change
 * the status upon `online` or `offline` events.
 */
let online = true
const isOnline = () => online

const isDocumentVisible = () => {
  if (HAS_DOCUMENT && document.visibilityState !== undefined) {
    return document.visibilityState !== 'hidden'
  }
  // always assume it's visible
  return true
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const registerOnFocus = (cb: () => void) => {
  if (
    HAS_WINDOW &&
    window.addEventListener !== undefined &&
    HAS_DOCUMENT &&
    document.addEventListener !== undefined
  ) {
    // focus revalidate
    document.addEventListener('visibilitychange', () => cb(), false)
    window.addEventListener('focus', () => cb(), false)
  }
}

const registerOnReconnect = (cb: () => void) => {
  if (HAS_WINDOW && window.addEventListener !== undefined) {
    // reconnect revalidate
    window.addEventListener(
      'online',
      () => {
        online = true
        cb()
      },
      false
    )

    // nothing to revalidate, just update the status
    window.addEventListener('offline', () => (online = false), false)
  }
}

export default {
  isOnline,
  isDocumentVisible,
  fetcher,
  registerOnFocus,
  registerOnReconnect
}
