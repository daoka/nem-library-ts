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

import {MosaicSupplyChangeTransactionDTO} from "../../infrastructure/transaction/MosaicSupplyChangeTransactionDTO";
import {TransactionDTO} from "../../infrastructure/transaction/TransactionDTO";
import {PublicAccount} from "../account/PublicAccount";
import {AssetId} from "../asset/AssetId";
import {TimeWindow} from "./TimeWindow";
import {Transaction} from "./Transaction";
import {TransactionInfo} from "./TransactionInfo";
import {TransactionTypes} from "./TransactionTypes";

/**
 * The supply type. Supported supply types are:
 * 1: Increase in supply.
 * 2: Decrease in supply.
 */
export enum AssetSupplyType {
  Increase = 1,
  Decrease = 2,
}

/**
 * In case a asset definition has the property 'supplyMutable' set to true, the creator of the asset definition can change the supply, i.e. increase or decrease the supply.
 */
export class AssetSupplyChangeTransaction extends Transaction {
  /**
   * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
   */
  public readonly fee: number;

  /**
   * The asset id.
   */
  public readonly assetId: AssetId;

  /**
   * The supply type.
   */
  public readonly supplyType: AssetSupplyType;

  /**
   * The supply change in units for the asset.
   */
  public readonly delta: number;

  /**
   * @internal
   * @param timeWindow
   * @param version
   * @param assetId
   * @param supplyType
   * @param delta
   * @param fee
   * @param signature
   * @param sender
   * @param transactionInfo
   */
  constructor(timeWindow: TimeWindow,
              version: number,
              assetId: AssetId,
              supplyType: AssetSupplyType,
              delta: number,
              fee: number,
              signature?: string,
              sender?: PublicAccount,
              transactionInfo?: TransactionInfo) {
    super(TransactionTypes.MOSAIC_SUPPLY_CHANGE, version, timeWindow, signature, sender, transactionInfo);
    this.assetId = assetId;
    this.supplyType = supplyType;
    this.delta = delta;
    this.fee = fee;
  }

  /**
   * Create DTO of AssetSupplychangeTransaction
   * @returns TransactionDTO
   */
  public toDTO(): TransactionDTO {
    const version = this.networkVersion ? this.networkVersion : this.version;
    return this.serializeDTO({
      deadline: this.timeWindow.deadlineToDTO(),
      timeStamp: this.timeWindow.timeStampToDTO(),
      signer: this.signer ? this.signer.publicKey : undefined,
      type: this.type,
      version,
      signature: this.signature,
      fee: this.fee,
      mosaicId: this.assetId.toDTO(),
      delta: this.delta,
      supplyType: this.supplyType,
    } as MosaicSupplyChangeTransactionDTO);
  }

  /**
   * Create a AssetSupplyChangeTransaction object
   * @param timeWindow
   * @param assetId
   * @param supplyType
   * @param delta
   * @returns {AssetSupplyChangeTransaction}
   */
  public static create(timeWindow: TimeWindow,
                       assetId: AssetId,
                       supplyType: AssetSupplyType,
                       delta: number): AssetSupplyChangeTransaction {
    const fee = Math.floor(3.0 * 0.05 * 1000000);
    return new AssetSupplyChangeTransaction(timeWindow, 1, assetId, supplyType, delta, fee);
  }
}
