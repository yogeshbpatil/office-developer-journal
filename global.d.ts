declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module 'bootstrap/dist/js/bootstrap.bundle.min.js';
