import { useContext, useLayoutEffect, useEffect } from 'react';
import MapCanvasContext from './map-canvas.context';

function useDrawPath(path: Path2D, draw: any) {
  const { ctx } = useContext(MapCanvasContext);

  useLayoutEffect(() => {
    if (ctx) {
      ctx.beginPath();
      Object.entries(draw).forEach(([prop, value]) => {
        if (!['stroke', 'fill'].includes(prop)) {
          // @ts-ignore
          ctx[prop] = value;
        } else {
          // @ts-ignore
          ctx[prop].call(ctx, path);
        }
      });
      ctx.closePath();
    }
  });
}

type Props = {
  draw: any;
  feature: { path: Path2D; properties: any };
  onMouseMove?: (e: MouseEvent, path: Path2D) => void;
};

function Path(props: Props) {
  const { onMouseMove, feature } = props;
  const { registerHandler } = useContext(MapCanvasContext);
  useDrawPath(props.feature.path, props.draw);
  useEffect(() => {
    if (onMouseMove) {
      // @ts-ignore
      const unregister = registerHandler('mousemove', feature, onMouseMove);
      return unregister;
    }
  }, [onMouseMove, feature, registerHandler]);
  return null;
}

export default Path;
