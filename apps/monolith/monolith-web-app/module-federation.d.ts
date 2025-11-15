// Module Federation type declarations

declare module 'homeRemote/Module' {
  const Module: React.ComponentType;
  export default Module;
}

declare module '@module-federation/enhanced/runtime' {
  export interface RemoteConfig {
    name: string;
    entry: string;
    alias?: string;
  }

  export interface InitConfig {
    name: string;
    remotes?: RemoteConfig[];
    shared?: Record<string, any>;
  }

  export function init(config: InitConfig): Promise<void>;
  export function loadRemote<T = any>(name: string): Promise<T>;
  export function loadShare(name: string): Promise<any>;
  export function registerRemotes(remotes: RemoteConfig[]): void;
}

declare module '@originjs/vite-plugin-federation' {
  import { Plugin } from 'vite';

  export interface FederationOptions {
    name: string;
    filename?: string;
    exposes?: Record<string, string>;
    remotes?: Record<string, string>;
    shared?: Record<string, any>;
  }

  export default function federation(options: FederationOptions): Plugin;
}
