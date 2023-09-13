export {};

declare global {
  namespace Express {
    export interface Request {
      __id?: string;
      __xTimestamp?: number;
      __timestamp?: string;
      __timezone?: string;
      __userAgent?: string;
      __version?: string;
      __repoVersion?: string;
    }
  }
}
