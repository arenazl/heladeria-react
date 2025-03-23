// Allow TypeScript to import .tsx files without specifying the extension
declare module '*.tsx' {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export default Component;
}

// Allow TypeScript to import .ts files without specifying the extension
declare module '*.ts' {
  const content: any;
  export default content;
}

// Allow TypeScript to import .js files without specifying the extension
declare module '*.js' {
  const content: any;
  export default content;
}
