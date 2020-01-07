import React, { useState } from 'react';
import MapCanvas from './lib/map-canvas.component';
import MapFeatures from './lib/map-features.component';
import Path from './lib/path.component';
import { useURLFeatures } from './lib/url-features.hook';
import { FeatureObject, MapCanvasContextValue } from './lib/types';

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

function getDraw(feature: FeatureObject, hovered: any, clicked: any) {
  let draw: any = {
    lineWidth: 1,
    strokeStyle: '#000',
    stroke: true,
    fillStyle: colorsByContinent[feature.properties.CONTINENT] || '#000',
    fill: true
  };

  if (hovered[feature.properties.ISO_A2]) {
    draw = {
      strokeStyle: '#000',
      stroke: true,
      fillStyle: '#fff',
      fill: true
    };
  }

  if (clicked[feature.properties.ISO_A2]) {
    draw.lineWidth = 5;
    draw.strokeStyle = '#000';
    draw.stroke = true;
  }

  return draw;
}

function getLocalCoordinates(e: React.MouseEvent<HTMLCanvasElement>) {
  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
  return [e.clientX - rect.x, e.clientY - rect.y];
}

function App() {
  const features = useURLFeatures(URL);
  const [hovered, setHovered] = useState<{ [iso: string]: boolean }>({});
  const [clicked, setClicked] = useState<{ [iso: string]: boolean }>({});

  const onMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>,
    feature: FeatureObject,
    { ctx, width, height }: MapCanvasContextValue
  ) => {
    if (ctx) {
      const [localX, localY] = getLocalCoordinates(e);
      if (ctx.isPointInPath(feature.path, localX, localY) && !hovered[feature.properties.ISO_A2]) {
        ctx.clearRect(0, 0, width, height);
        setHovered(_hovered => ({ ..._hovered, [feature.properties.ISO_A2]: true }));
      } else if (
        !ctx.isPointInPath(feature.path, localX, localY) &&
        hovered[feature.properties.ISO_A2]
      ) {
        ctx.clearRect(0, 0, width, height);
        setHovered(_hovered => ({ ..._hovered, [feature.properties.ISO_A2]: false }));
      }
    }
  };

  const onClick = (
    e: React.MouseEvent<HTMLCanvasElement>,
    feature: FeatureObject,
    { ctx, width, height }: MapCanvasContextValue
  ) => {
    if (ctx) {
      const [localX, localY] = getLocalCoordinates(e);
      if (ctx.isPointInPath(feature.path, localX, localY)) {
        ctx.clearRect(0, 0, width, height);
        setClicked(_clicked => ({
          ..._clicked,
          [feature.properties.ISO_A2]: !_clicked[feature.properties.ISO_A2]
        }));
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
                draw={getDraw(obj, hovered, clicked)}
                key={obj.properties.NAME}
                onMouseMove={onMouseMove}
                onClick={onClick}
              />
            ))
          }
        </MapFeatures>
      </MapCanvas>
    </main>
  );
}

export default App;
