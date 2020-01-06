import React, { ReactElement } from 'react';
import { useFeatureObjects } from './feature-objects.hook';
import { URLFeatures, FeatureObject } from './types';

type Props = {
  features: URLFeatures;
  children: (features: FeatureObject[]) => ReactElement[];
};

function MapFeatures(props: Props) {
  const objects = useFeatureObjects(props.features);

  return <>{props.children(objects)}</>;
}

export default MapFeatures;
