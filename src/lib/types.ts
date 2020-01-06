import { Feature } from 'geojson';
import { GeoProjection } from 'd3';
import React from 'react';

export type URLFeatures = Feature[] | null;
export type FeatureObject = { properties: any; path: Path2D };

export type MapCanvasContextValue = {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  registerHandler: (type: SUPPORTED_EVENTS, feature: FeatureObject, handler: PathEventHandler) => () => boolean;
  projection: GeoProjection;
};

export type PathEventHandler = (
  e: React.MouseEvent<HTMLCanvasElement>,
  feature: FeatureObject,
  contextValue: MapCanvasContextValue
) => void;

export enum SUPPORTED_EVENTS {
  onMouseMove = 'mousemove',
  onClick = 'click'
}

export type DrawInstructions = { [contextProp: string]: any; stroke?: boolean; fill?: boolean };
