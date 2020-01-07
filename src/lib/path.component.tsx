import { useContext, useLayoutEffect, useEffect, useRef } from 'react';
import MapCanvasContext from './map-canvas.context';
import { FeatureObject, PathEventHandler, DrawInstructions, SUPPORTED_EVENTS } from './types';

type Props = {
  draw: DrawInstructions;
  feature: FeatureObject;
  onMouseMove?: PathEventHandler;
  onClick?: PathEventHandler;
};

function sortCanvasCtxProps(a: [string, string], b: [string, string]) {
  if (a[0] === 'stroke') {
    if (b[0] === 'fill') {
      return 0;
    }
    return 1;
  }
  if (a[0] === 'fill') {
    if (b[0] === 'stroke') {
      return 0;
    }
    return 1;
  }
  if (a[0] < b[0]) {
    return -1;
  }
  if (a[0] > b[0]) {
    return 1;
  }
  return 0;
}

function useDrawPath(path: Path2D, draw: DrawInstructions) {
  const { ctx } = useContext(MapCanvasContext);
  useLayoutEffect(() => {
    if (ctx) {
      ctx.beginPath();
      Object.entries(draw)
        .sort(sortCanvasCtxProps)
        .forEach(([prop, value]) => {
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

function useEventHandlers(props: Props) {
  const { registerHandler } = useContext(MapCanvasContext);
  const eventHandlerSubscriptions = useRef<Array<() => boolean>>([]);

  useEffect(() => {
    const _registeredEventHandlers = eventHandlerSubscriptions.current;
    Object.entries(SUPPORTED_EVENTS).forEach(([eventProp, eventType]) => {
      // @ts-ignore
      const eventHandler = props[eventProp];
      if (eventProp) {
        const subscription = registerHandler(eventType, props.feature, eventHandler);
        // @ts-ignore
        _registeredEventHandlers.push(subscription);
      }
    });
    return () => {
      if (_registeredEventHandlers.length > 0) {
        _registeredEventHandlers.forEach(unregister => {
          unregister();
        });
      }
    };
  }, [props, registerHandler]);
}

function Path(props: Props) {
  useEventHandlers(props);
  useDrawPath(props.feature.path, props.draw);

  return null;
}

export default Path;
