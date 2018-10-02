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
import {AccountHttp} from "../infrastructure/AccountHttp";
import {AssetHttp} from "../infrastructure/AssetHttp";
import {Address} from "../models/account/Address";
import {Asset} from "../models/asset/Asset";
import {AssetDefinition} from "../models/asset/AssetDefinition";
import {AssetTransferable} from "../models/asset/AssetTransferable";
import {XEM} from "../models/asset/XEM";
import {flatMap, map, toArray} from "rxjs/operators";

/**
 * Service to get account owned mosaics
 */
export class AccountOwnedAssetService {
  /**
   * accountHttp
   */
  private accountHttp: AccountHttp;

  /**
   * assetHttp
   */
  private assetHttp: AssetHttp;

  /**
   * constructor
   * @param accountHttp
   * @param assetHttp
   */
  constructor(accountHttp: AccountHttp, assetHttp: AssetHttp) {
    this.accountHttp = accountHttp;
    this.assetHttp = assetHttp;
  }

  /**
   * Account owned assets definitions
   * @param address
   * @returns {Observable<AssetDefinition[]>}
   */
  public fromAddress(address: Address): Observable<AssetTransferable[]> {
    return this.accountHttp.getAssetsOwnedByAddress(address)
      .pipe(
        flatMap((_) => _),
        flatMap((mosaic: Asset) => {
          if (XEM.MOSAICID.equals(mosaic.assetId)) return of(new XEM(mosaic.quantity / Math.pow(10, 6)));
          else {
            return this.assetHttp.getAssetDefinition(mosaic.assetId)
              .pipe(
                map((assetDefinition) => {
                  return AssetTransferable.createWithAssetDefinition(assetDefinition, mosaic.quantity / Math.pow(10, assetDefinition.properties.divisibility));
                })
              );
          }
        }),
        toArray()
      )
  }
}
