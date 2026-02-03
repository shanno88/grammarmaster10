/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PADDLE_VENDOR_ID?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PADDLE_ENV?: 'sandbox' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
