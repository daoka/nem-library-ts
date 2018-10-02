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

import {MosaicLevyDTO} from "../../infrastructure/asset/MosaicLevyDTO";
import {Address} from "../account/Address";
import {AssetId} from "./AssetId";

/**
 * 1: The levy is an absolute fee. The field 'fee' states how many sub-units of the specified mosaic will be transferred to the recipient.
 * 2: The levy is calculated from the transferred xem. The field 'fee' states how many percentiles of the transferred quantity will transferred to the recipient.
 */
export enum AssetLevyType {
  Absolute = 1,
  Percentil = 2,
}

/**
 *
 * A mosaic definition can optionally specify a levy for transferring those mosaics. This might be needed by legal entities needing to collect some taxes for transfers.
 */
export class AssetLevy {

  /**
   * 	The levy type
   */
  public readonly type: AssetLevyType;

  /**
   * The recipient of the levy.
   */
  public readonly recipient: Address;

  /**
   * The mosaic in which the levy is paid.
   */
  public readonly assetId: AssetId;

  /**
   * The fee. The interpretation is dependent on the type of the levy
   */
  public readonly fee: number;

  /**
   * constructor
   * @param type
   * @param recipient
   * @param assetId
   * @param fee
   */
  constructor(
    type: AssetLevyType,
    recipient: Address,
    assetId: AssetId,
    fee: number,
  ) {
    this.type = type;
    this.recipient = recipient;
    this.assetId = assetId;
    this.fee = fee;
  }

  /**
   * @internal
   */
  public toDTO(): MosaicLevyDTO {
    return {
      mosaicId: this.assetId,
      recipient: this.recipient.plain(),
      type: this.type,
      fee: this.fee,
    };
  }

  /**
   * @internal
   * @param dto
   * @returns {AssetLevy}
   */
  public static createFromMosaicLevyDTO(dto: MosaicLevyDTO): AssetLevy {
    return new AssetLevy(
      dto.type,
      new Address(dto.recipient),
      AssetId.createFromMosaicIdDTO(dto.mosaicId),
      dto.fee);
  }

}
