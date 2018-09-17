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

import {Observable} from "rxjs/Observable";
import {AssetHttp} from "../infrastructure/AssetHttp";
import {AssetProperties} from "../models/asset/AssetDefinition";
import {AssetLevyType} from "../models/asset/AssetLevy";
import {AssetTransferable} from "../models/asset/AssetTransferable";
import {XEM} from "../models/asset/XEM";
/**
 * Mosaic service
 */
export class MosaicService {

  /**
   * mosaicHttp
   */
  private mosaicHttp: AssetHttp;

  /**
   * constructor
   * @param mosaicHttp
   */
  constructor(mosaicHttp: AssetHttp) {
    this.mosaicHttp = mosaicHttp;

  }

  /**
   * Calculate levy for a given mosaicTransferable
   * @param mosaicTransferable
   * @returns {any}
   */
  public calculateLevy(mosaicTransferable: AssetTransferable): Observable<number> {
    if (mosaicTransferable.levy == undefined) return Observable.of(0);
    if (mosaicTransferable.levy.assetId.equals(XEM.MOSAICID)) {
      return Observable.of(
        this.levyFee(mosaicTransferable, new AssetProperties(XEM.DIVISIBILITY, XEM.INITIALSUPPLY, XEM.TRANSFERABLE, XEM.SUPPLYMUTABLE)),
      );
    } else {
      return this.mosaicHttp.getAssetDefinition(mosaicTransferable.levy.assetId).map((levyMosaicDefinition) => {
        return this.levyFee(mosaicTransferable, levyMosaicDefinition.properties);
      });
    }
  }

  /**
   * @internal
   * @param mosaic
   * @param levy
   * @returns {any}
   */
  private levyFee(mosaicTransferable: AssetTransferable, levyProperties: AssetProperties): number {
    let levyValue;

    if (mosaicTransferable.levy!.type == AssetLevyType.Absolute) {
      levyValue = mosaicTransferable.levy!.fee;
    } else {
      levyValue = mosaicTransferable.relativeQuantity() * mosaicTransferable.levy!.fee / 10000;
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
