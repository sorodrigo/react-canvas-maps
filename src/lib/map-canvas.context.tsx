import { createContext } from 'react';

export default createContext<{
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  registerHandler: (type: string, feature: any, handler: any) => void;
}>({
  ctx: null,
  width: 0,
  height: 0,
  registerHandler: () => {}
});
