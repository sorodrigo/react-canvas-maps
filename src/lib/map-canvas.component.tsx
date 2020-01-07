import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import MapCanvasContext from './map-canvas.context';
import { FeatureObject, MapCanvasContextValue, SUPPORTED_EVENTS, PathEventHandler } from './types';
import { geoEqualEarth } from 'd3-geo';

type Props = {
  width: number;
  height: number;
  children: ReactElement;
  style?: React.CSSProperties;
};

type EventHandlersMap = {
  [type in SUPPORTED_EVENTS]: Map<FeatureObject, PathEventHandler>;
};

function MapCanvas(props: Props) {
  const { height, width, children, style } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const eventHandlers = useRef<EventHandlersMap>({
    mousemove: new Map(),
    click: new Map()
  });
  const callbackId = useRef<number | null>(null);
  const [ctx, setCtx] = useState<MapCanvasContextValue['ctx']>(null);

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

    return () => {
      if (callbackId.current) {
        window.cancelAnimationFrame(callbackId.current);
      }
    };
  }, []);

  function registerHandler(
    type: SUPPORTED_EVENTS,
    feature: FeatureObject,
    handler: PathEventHandler
  ) {
    eventHandlers.current[type].set(feature, handler);

    return () => eventHandlers.current[type].delete(feature);
  }

  const contextValue = useMemo(
    () => ({ ctx, width, height, registerHandler, projection: geoEqualEarth().center([20, 0]) }),
    [ctx, height, width]
  );

  function handleEvent(e: React.MouseEvent<HTMLCanvasElement>) {
    e.persist();
    const eventType = e.type as SUPPORTED_EVENTS;
    if (callbackId.current === null && Object.values(SUPPORTED_EVENTS).includes(eventType)) {
      callbackId.current = window.requestAnimationFrame(() => {
        const registeredHandlers = eventHandlers.current[eventType];
        unstable_batchedUpdates(() => {
          registeredHandlers.forEach((handler, feature) => handler(e, feature, contextValue));
        });
        callbackId.current = null;
      });
    }
  }

  return (
    <canvas
      ref={ref}
      style={style}
      width={width}
      height={height}
      className="canvas-root"
      onClick={handleEvent}
      onMouseMove={handleEvent}
    >
      <MapCanvasContext.Provider value={contextValue}>{children}</MapCanvasContext.Provider>
    </canvas>
  );
}

export default MapCanvas;
