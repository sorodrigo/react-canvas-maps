import { useEffect, useState } from 'react';
import { Topology } from 'topojson-specification';
import { feature } from 'topojson';
import { URLFeatures } from './types';

export function useURLFeatures(url: string): URLFeatures {
  const [features, setFeatures] = useState<URLFeatures>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then((tj: Topology) => {
        const gj = feature(tj, tj.objects[Object.keys(tj.objects)[0]]);
        // @ts-ignore
        setFeatures(gj.features);
      });
  }, [url]);

  return features;
}
