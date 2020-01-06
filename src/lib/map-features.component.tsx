import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Feature } from 'geojson';
import { geoPath } from 'd3-geo';
import { geoEqualEarth } from 'd3';
import Path from './path.component';
import MapCanvasContext from './map-canvas.context';

type URLFeatures = Feature[] | null;

const EqualEarth = geoEqualEarth().center([20, 0]);
const path = geoPath(EqualEarth);

function useFeatureObjects(features: URLFeatures) {
  const [objects, setObjects] = useState<Array<{ properties: any; path: Path2D }>>([]);
  useEffect(() => {
    if (features) {
      setObjects(
        features.flatMap((feature: any) => {
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

type Props = {
  features: URLFeatures;
};

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

function MapFeatures(props: Props) {
  const objects = useFeatureObjects(props.features);
  const { ctx, width, height } = useContext(MapCanvasContext);
  const [hovered, setHovered] = useState<{ [iso: string]: boolean }>({});

  const onMouseMove = (e: MouseEvent, feature: any) => {
    if (ctx) {
      if (
        ctx.isPointInPath(feature.path, e.clientX, e.clientY) &&
        !hovered[feature.properties.ISO_A2]
      ) {
        ctx?.clearRect(0, 0, width, height);
        setHovered(_hovered => ({ ..._hovered, [feature.properties.ISO_A2]: true }));
      } else if (
        !ctx.isPointInPath(feature.path, e.clientX, e.clientY) &&
        hovered[feature.properties.ISO_A2]
      ) {
        ctx?.clearRect(0, 0, width, height);
        setHovered(_hovered => ({ ..._hovered, [feature.properties.ISO_A2]: false }));
      }
    }
  };

  return (
    <>
      {objects.map(obj => (
        <Path
          feature={obj}
          draw={getDraw(obj, hovered)}
          key={obj.properties.NAME}
          onMouseMove={onMouseMove}
        />
      ))}
    </>
  );
}

export default MapFeatures;
