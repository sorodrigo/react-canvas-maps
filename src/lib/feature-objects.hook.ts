import { useContext, useEffect, useState } from 'react';
import { geoPath } from 'd3-geo';
import MapCanvasContext from './map-canvas.context';
import { URLFeatures, FeatureObject } from './types';
import { Feature } from 'geojson';

export function useFeatureObjects(features: URLFeatures): FeatureObject[] {
  const { projection } = useContext(MapCanvasContext);
  const [objects, setObjects] = useState<FeatureObject[]>([]);
  const path = geoPath(projection);
  useEffect(() => {
    if (features) {
      setObjects(
        features.flatMap((feature: Feature) => {
          const d = path(feature);
          if (d) {
            return {
              path: new Path2D(d),
              properties: feature.properties
            };
          }
          return [];
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  return objects;
}
