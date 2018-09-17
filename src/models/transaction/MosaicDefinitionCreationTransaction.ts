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

import {MosaicDefinitionCreationTransactionDTO} from "../../infrastructure/transaction/MosaicDefinitionCreationTransactionDTO";
import {TransactionDTO} from "../../infrastructure/transaction/TransactionDTO";
import {NEMLibrary} from "../../NEMLibrary";
import {Address} from "../account/Address";
import {PublicAccount} from "../account/PublicAccount";
import {AssetDefinition} from "../asset/AssetDefinition";
import {NetworkTypes} from "../node/NetworkTypes";
import {TimeWindow} from "./TimeWindow";
import {Transaction} from "./Transaction";
import {TransactionInfo} from "./TransactionInfo";
import {TransactionTypes} from "./TransactionTypes";

/**
 * Before a asset can be created or transferred, a corresponding definition of the asset has to be created and published to the network.
 * This is done via a asset definition creation transaction.
 */
export class MosaicDefinitionCreationTransaction extends Transaction {
  /**
   * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
   */
  public readonly fee: number;

  /**
   * The fee for the creation of the asset.
   */
  public readonly creationFee: number;

  /**
   * The public account to which the creation fee is tranferred.
   */
  public readonly creationFeeSink: Address;

  /**
   * The actual asset definition.
   */
  public readonly mosaicDefinition: AssetDefinition;

  /**
   * @internal
   * @param timeWindow
   * @param version
   * @param creationFee
   * @param creationFeeSink
   * @param assetDefinition
   * @param fee
   * @param signature
   * @param sender
   * @param transactionInfo
   */
  constructor(timeWindow: TimeWindow,
              version: number,
              creationFee: number,
              creationFeeSink: Address,
              mosaicDefinition: AssetDefinition,
              fee: number,
              signature?: string,
              sender?: PublicAccount,
              transactionInfo?: TransactionInfo) {
    super(TransactionTypes.MOSAIC_DEFINITION_CREATION, version, timeWindow, signature, sender, transactionInfo);
    this.creationFeeSink = creationFeeSink;
    this.creationFee = creationFee;
    this.mosaicDefinition = mosaicDefinition;
    this.fee = fee;
  }

  /**
   * Create DTO of AssetDefinitionCreationTransaction
   * @returns {AssetDefinitionCreationTransactionDTO}
   */
  public toDTO(): TransactionDTO {
    const version = this.networkVersion ? this.networkVersion : this.version;
    return this.serializeDTO({
      type: this.type,
      fee: this.fee,
      version,
      signer: this.signer ? this.signer.publicKey : undefined,
      signature: this.signature,
      deadline: this.timeWindow.deadlineToDTO(),
      timeStamp: this.timeWindow.timeStampToDTO(),
      creationFee: this.creationFee,
      creationFeeSink: this.creationFeeSink.plain(),
      mosaicDefinition: this.mosaicDefinition.toDTO(),
    } as MosaicDefinitionCreationTransactionDTO);
  }

  /**
   * Create a AssetDefinitionCreationTransaction object
   * @param timeWindow
   * @param assetDefinition
   * @returns {AssetDefinitionCreationTransaction}
   */
  public static create(timeWindow: TimeWindow,
                       mosaicDefinition: AssetDefinition): MosaicDefinitionCreationTransaction {
    const fee = Math.floor(3 * 0.05 * 1000000);
    let creationFeeSink;
    if (NEMLibrary.getNetworkType() === NetworkTypes.TEST_NET) {
      creationFeeSink = new Address("TBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSJBR-5OLC");
    } else if (NEMLibrary.getNetworkType() === NetworkTypes.MAIN_NET) {
      creationFeeSink = new Address("NBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSIUX-6TRS");
    }
    const creationFee = Math.floor(10 * 1000000);
    return new MosaicDefinitionCreationTransaction(
      timeWindow, 1, creationFee, creationFeeSink, mosaicDefinition, fee,
    );
  }
}
