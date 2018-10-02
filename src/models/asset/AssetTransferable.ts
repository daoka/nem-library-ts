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

import {Asset} from "./Asset";
import {AssetDefinition, AssetProperties} from "./AssetDefinition";
import {AssetId} from "./AssetId";
import {AssetLevy} from "./AssetLevy";

/**
 * Asset transferable model
 */
export class AssetTransferable {
  /**
   * Create a AssetTransferable object with mosaic definition
   * @param assetDefinition
   * @param amount
   * @returns {AssetTransferable}
   */
  public static createWithAssetDefinition(assetDefinition: AssetDefinition, amount: number) {
    return new AssetTransferable(assetDefinition.id, assetDefinition.properties, amount, assetDefinition.levy);
  }

  /**
   * Create AssetTransferable with an absolute quantity
   * @param assetId
   * @param properties
   * @param quantity
   * @param levy
   * @returns {AssetTransferable}
   */
  public static createAbsolute(assetId: AssetId, properties: AssetProperties, quantity: number, levy?: AssetLevy) {
    return new AssetTransferable(
      assetId,
      properties,
      quantity,
      levy,
    );
  }

  /**
   * Create AssetTransferable with an relative quantity
   * @param assetId
   * @param properties
   * @param quantity
   * @param levy
   * @returns {AssetTransferable}
   */
  public static createRelative(assetId: AssetId, properties: AssetProperties, quantity: number, levy?: AssetLevy) {
    return new AssetTransferable(
      assetId,
      properties,
      quantity * Math.pow(10, properties.divisibility),
      levy,
    );
  }

  /**
   * AssetId
   */
  public readonly assetId: AssetId;

  /**
   * Amount
   */
  public readonly quantity: number;

  /**
   * Asset definition properties
   */
  public readonly properties: AssetProperties;

  /**
   * Levy
   */
  public readonly levy?: AssetLevy;

  /**
   * constructor
   * @param mosaicId
   * @param properties
   * @param quantity
   * @param levy
   */
  constructor(mosaicId: AssetId, properties: AssetProperties, quantity: number, levy?: AssetLevy) {
    this.assetId = mosaicId;
    this.properties = properties;
    this.levy = levy;
    this.quantity = quantity;
  }

  /**
   * @returns {number}
   */
  public relativeQuantity(): number {
    return this.quantity / Math.pow(10, this.properties.divisibility);
  }

  /**
   * @returns {number}
   */
  public absoluteQuantity(): number {
    return this.quantity;
  }
}
