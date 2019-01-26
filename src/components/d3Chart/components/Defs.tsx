import * as React from 'react';
import { Size } from '../models';

export interface DefsProps {
  clipPaths: ClipPath[];
}

interface ClipPath {
  size: Size;
  id: string;
}

/**
 * Prevent drawing chart content in the y axis with setting up a clip path that can be used for the chart content
 * @param {Size} size
 * @returns {any}
 * @constructor
 */
export function Defs({ clipPaths }: DefsProps) {
  return (
    <defs>
      {clipPaths.map(clipPath => (
        <clipPath key={clipPath.id} id={clipPath.id}>
          <rect width={clipPath.size.width} height={clipPath.size.height} />
        </clipPath>
      ))}
    </defs>
  );
}
