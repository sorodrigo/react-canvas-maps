import React, { useState, useEffect, useRef, RefObject } from 'react';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { Topology } from 'topojson-specification';
import { geoPath } from 'd3-geo';
import { geoEqualEarth } from 'd3';
import './App.css';

const URL =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';
const EqualEarth = geoEqualEarth().center([20, 0]);
const path = geoPath(EqualEarth);

type URLFeatures = Feature[] | null;

function useURLFeatures(): URLFeatures {
  const [features, setFeatures] = useState<URLFeatures>(null);

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then((tj: Topology) => {
        const gj = feature(tj, tj.objects[Object.keys(tj.objects)[0]]);
        // @ts-ignore
        setFeatures(gj.features);
      });
  }, []);

  return features;
}

function useDrawFeatures(
  features: URLFeatures,
  { width, height }: Props
): [RefObject<HTMLCanvasElement>, (e: any) => void] {
  const ref = useRef<HTMLCanvasElement>(null);
  const paths = useRef<Array<Path2D>>([]);
  const requestId = useRef<number | null>(null);

  function init() {
    if (features && ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        // @ts-ignore
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.canvas.style.maxWidth = '100%';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        paths.current = features.flatMap((feature: any) => {
          const d = path(feature);
          if (d) {
            return new Path2D(d);
          }
          return [];
        });
        draw();
      }
    }
  }

  function drawEvent(ctx: CanvasRenderingContext2D, path: Path2D, event: MouseEvent) {
    switch (event.type) {
      case 'mousemove':
        ctx.fillStyle = '#ee400b';
        ctx.fill(path);
        break;
      case 'click':
        ctx.fillStyle = '#521fee';
        ctx.fill(path);
        break;
    }
  }

  function draw(event?: MouseEvent) {
    if (features && ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        // reset canvas
        ctx.clearRect(0, 0, width, height);
        requestId.current = null;

        paths.current.forEach(path => {
          ctx.beginPath();
          ctx.lineWidth = 0.5;
          if (event && ctx.isPointInPath(path, event.clientX, event.clientY)) {
            drawEvent(ctx, path, event);
          } else {
            ctx.strokeStyle = '#000';
            ctx.stroke(path);
          }
        });
      }
    }
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  function update(e: MouseEvent) {
    // @ts-ignore
    e.persist();
    if (!requestId.current) {
      requestId.current = window.requestAnimationFrame(() => draw(e));
    }
  }

  return [ref, update];
}

type Props = {
  width: number;
  height: number;
};

function App(props: Props) {
  const features = useURLFeatures();
  const [ref, update] = useDrawFeatures(features, props);

  return (
    <main className="container">
      <canvas
        onMouseMove={update}
        onClick={update}
        ref={ref}
        className="canvas-root"
        width={props.width}
        height={props.height}
      />
    </main>
  );
}

export default App;
