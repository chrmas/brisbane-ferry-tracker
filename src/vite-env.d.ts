/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_GTFS_RT_URL: string
  readonly VITE_GTFS_TRIP_UPDATES_URL: string
  readonly VITE_GTFS_STATIC_URL: string
  readonly VITE_BCC_TERMINALS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
