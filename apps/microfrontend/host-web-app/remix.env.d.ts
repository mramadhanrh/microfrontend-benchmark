/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

// CSS Module declarations
declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.css?url' {
  const content: string;
  export default content;
}
