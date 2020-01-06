import React, { useState } from 'react';
import MapCanvas from './lib/map-canvas.component';
import MapFeatures from './lib/map-features.component';
import Path from './lib/path.component';
import { useURLFeatures } from './lib/url-features.hook';

import './App.css';

const URL =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const colorsByContinent: any = {
  Asia: '#4000cc',
  'South America': '#007b1e',
  'North America': '#007b1e',
  Europe: '#aa2f00',
  Africa: '#eed800',
  Oceania: '#00c0ee',
  Antarctica: '#ee8a00'
};

function getDraw(feature: any, hovered: any) {
  if (hovered[feature.properties.ISO_A2]) {
    return {
      stroke: true,
      lineWidth: 1,
      strokeStyle: '#fff'
    };
  }

  return {
    lineWidth: 1,
    strokeStyle: '#000',
    stroke: true,
    fillStyle: colorsByContinent[feature.properties.CONTINENT] || '#000',
    fill: true
  };
}

function App() {
  const features = useURLFeatures(URL);
  const [hovered, setHovered] = useState<{ [iso: string]: boolean }>({});

  const onMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>,
    feature: any,
    { ctx, width, height }: any
  ) => {
    if (ctx) {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const localX = e.clientX - rect.x;
      const localY = e.clientY - rect.y;
      if (ctx.isPointInPath(feature.path, localX, localY) && !hovered[feature.properties.ISO_A2]) {
        ctx?.clearRect(0, 0, width, height);
        setHovered(_hovered => ({ ..._hovered, [feature.properties.ISO_A2]: true }));
      } else if (
        !ctx.isPointInPath(feature.path, localX, localY) &&
        hovered[feature.properties.ISO_A2]
      ) {
        ctx?.clearRect(0, 0, width, height);
        setHovered(_hovered => ({ ..._hovered, [feature.properties.ISO_A2]: false }));
      }
    }
  };

  return (
    <main className="container">
      <p className="notice">
        New update! Every polygon defines its own events using React components API!
      </p>
      <MapCanvas height={600} width={900}>
        <MapFeatures features={features}>
          {objects =>
            objects.map(obj => (
              <Path
                feature={obj}
                draw={getDraw(obj, hovered)}
                key={obj.properties.NAME}
                onMouseMove={onMouseMove}
              />
            ))
          }
        </MapFeatures>
      </MapCanvas>
    </main>
  );
}

export default App;
