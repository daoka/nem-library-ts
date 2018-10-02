/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 NEM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {Observable, of} from "rxjs";
import {AssetHttp} from "../infrastructure/AssetHttp";
import {AssetProperties} from "../models/asset/AssetDefinition";
import {AssetLevyType} from "../models/asset/AssetLevy";
import {AssetTransferable} from "../models/asset/AssetTransferable";
import {XEM} from "../models/asset/XEM";
import {map} from "rxjs/operators";

/**
 * Mosaic service
 */
export class AssetService {

  /**
   * assetHttp
   */
  private assetHttp: AssetHttp;

  /**
   * constructor
   * @param assetHttp
   */
  constructor(assetHttp: AssetHttp) {
    this.assetHttp = assetHttp;

  }

  /**
   * Calculate levy for a given assetTransferable
   * @param assetTransferable
   * @returns {any}
   */
  public calculateLevy(assetTransferable: AssetTransferable): Observable<number> {
    if (assetTransferable.levy == undefined) return of(0);
    if (assetTransferable.levy.assetId.equals(XEM.MOSAICID)) {
      return of(
        this.levyFee(assetTransferable, new AssetProperties(XEM.DIVISIBILITY, XEM.INITIALSUPPLY, XEM.TRANSFERABLE, XEM.SUPPLYMUTABLE)),
      );
    } else {
      return this.assetHttp.getAssetDefinition(assetTransferable.levy.assetId)
        .pipe(map((levyMosaicDefinition) => {
          return this.levyFee(assetTransferable, levyMosaicDefinition.properties);
        }))
    }
  }

  /**
   * @internal
   * @param assetTransferable
   * @param levyProperties
   * @returns number
   */
  private levyFee(assetTransferable: AssetTransferable, levyProperties: AssetProperties): number {
    let levyValue;

    if (assetTransferable.levy!.type == AssetLevyType.Absolute) {
      levyValue = assetTransferable.levy!.fee;
    } else {
      levyValue = assetTransferable.relativeQuantity() * assetTransferable.levy!.fee / 10000;
    }

    const o = parseInt(levyValue, 10);

    if (!o) {
      if (levyProperties.divisibility === 0) {
        return 0;
      } else {
        return parseFloat("0." + o.toFixed(levyProperties.divisibility).split(".")[1]);
      }
    }

    return o / Math.pow(10, levyProperties.divisibility);
  }
}
