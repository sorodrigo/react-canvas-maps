import React, { useState, useEffect } from 'react';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { Topology } from 'topojson-specification';
import MapCanvas from './lib/map-canvas.component';
import MapFeatures from './lib/map-features.component';

import './App.css';

const URL =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

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

function App() {
  const features = useURLFeatures();

  return (
    <main className="container">
      <p className="notice">New update! Every polygon defines it's own events using React components API!</p>
      <MapCanvas height={600} width={900}>
        <MapFeatures features={features} />
      </MapCanvas>
    </main>
  );
}

export default App;
