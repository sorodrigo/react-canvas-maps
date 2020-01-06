import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import MapCanvasContext from './map-canvas.context';

type Props = {
  width: number;
  height: number;
  children: ReactElement;
};

let callbackId: any = null;

function MapCanvas(props: Props) {
  const { height, width, children } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const eventHandlers = useRef<{ [type: string]: Map<any, any> }>({
    mousemove: new Map()
  });
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (ref.current !== null) {
      const _ctx = ref.current.getContext('2d');
      if (_ctx) {
        // @ts-ignore
        _ctx.mozImageSmoothingEnabled = false;
        _ctx.imageSmoothingEnabled = false;
        _ctx.canvas.style.maxWidth = '100%';
        _ctx.lineJoin = 'round';
        _ctx.lineCap = 'round';
        setCtx(_ctx);
      }
    }
  }, []);

  function handleEvent(e: any) {
    // @ts-ignore
    e.persist();
    if (callbackId === null) {
      callbackId = window.requestAnimationFrame(() => {
        const registeredHandlers = eventHandlers.current[e.type];
        unstable_batchedUpdates(() => {
          registeredHandlers.forEach((handler, feature) => handler(e, feature));
        });
        callbackId = null;
      });
    }
  }

  function registerHandler(type: string, feature: any, handler: any) {
    eventHandlers.current[type].set(feature, handler);

    return () => eventHandlers.current[type].delete(feature);
  }

  const contextValue = useMemo(() => ({ ctx, width, height, registerHandler }), [
    ctx,
    height,
    width
  ]);

  return (
    <canvas
      ref={ref}
      className="canvas-root"
      width={width}
      height={height}
      onMouseMove={handleEvent}
    >
      <MapCanvasContext.Provider value={contextValue}>{children}</MapCanvasContext.Provider>
    </canvas>
  );
}

export default MapCanvas;
