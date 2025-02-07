/**
 * @module ol/source
 */

import LRUCache from '../structs/LRUCache.js';
import {getIntersection} from '../extent.js';

export {default as BingMaps} from './BingMaps.js';
export {default as CartoDB} from './CartoDB.js';
export {default as Cluster} from './Cluster.js';
export {default as DataTile} from './DataTile.js';
export {default as GeoTIFF} from './GeoTIFF.js';
export {default as IIIF} from './IIIF.js';
export {default as Image} from './Image.js';
export {default as ImageArcGISRest} from './ImageArcGISRest.js';
export {default as ImageCanvas} from './ImageCanvas.js';
export {default as ImageMapGuide} from './ImageMapGuide.js';
export {default as ImageStatic} from './ImageStatic.js';
export {default as ImageWMS} from './ImageWMS.js';
export {default as OSM} from './OSM.js';
export {default as Raster} from './Raster.js';
export {default as Source} from './Source.js';
export {default as Stamen} from './Stamen.js';
export {default as Tile} from './Tile.js';
export {default as TileArcGISRest} from './TileArcGISRest.js';
export {default as TileDebug} from './TileDebug.js';
export {default as TileImage} from './TileImage.js';
export {default as TileJSON} from './TileJSON.js';
export {default as TileWMS} from './TileWMS.js';
export {default as UrlTile} from './UrlTile.js';
export {default as UTFGrid} from './UTFGrid.js';
export {default as Vector} from './Vector.js';
export {default as VectorTile} from './VectorTile.js';
export {default as WMTS} from './WMTS.js';
export {default as XYZ} from './XYZ.js';
export {default as Zoomify} from './Zoomify.js';

/**
 * Creates a sources function from a tile grid. This function can be used as value for the
 * `sources` property of the {@link module:ol/layer/Layer~Layer} subclasses that support it.
 * @param {import("../tilegrid/TileGrid.js").default} tileGrid Tile grid.
 * @param {function(import("../tilecoord.js").TileCoord): import("./Source.js").default} factory Source factory.
 * This function takes a {@link module:ol/tilecoord~TileCoord} as argument and is expected to return a
 * {@link module:ol/source/Source~Source}. **Note**: The returned sources should have a tile grid with
 * a limited set of resolutions, matching the resolution range of a single zoom level of the pyramid
 * `tileGrid` that `sourcesFromTileGrid` was called with.
 * @return {function(import("../extent.js").Extent, number): Array<import("./Source.js").default>} Sources function.
 * @api
 */
export function sourcesFromTileGrid(tileGrid, factory) {
  const sourceCache = new LRUCache(32);
  const tileGridExtent = tileGrid.getExtent();
  return function (extent, resolution) {
    sourceCache.expireCache();
    if (tileGridExtent) {
      extent = getIntersection(tileGridExtent, extent);
    }
    const z = tileGrid.getZForResolution(resolution);
    const wantedSources = [];
    tileGrid.forEachTileCoord(extent, z, (tileCoord) => {
      const key = tileCoord.toString();
      if (!sourceCache.containsKey(key)) {
        const source = factory(tileCoord);
        sourceCache.set(key, source);
      }
      wantedSources.push(sourceCache.get(key));
    });
    return wantedSources;
  };
}
