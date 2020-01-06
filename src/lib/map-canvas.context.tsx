import { createContext } from 'react';
import { geoEqualEarth } from 'd3';
import { MapCanvasContextValue } from './types';

export default createContext<MapCanvasContextValue>({
  ctx: null,
  width: 0,
  height: 0,
  projection: geoEqualEarth().center([20, 0]),
  registerHandler: () => () => false
});
