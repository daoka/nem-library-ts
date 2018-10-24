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

import {expect} from "chai";
import {PublicAccount} from "../../../src/models/account/PublicAccount";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";
import { Address, Account } from "../../../src/models";
import { TestVariables } from "../../config/TestVariables.spec";

describe("PublicAccount", () => {
  const recipientAccount: string = "TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA";
  const publicKey: string = "a4f9d42cf8e1f7c6c3216ede81896c4fa9f49071ee4aee2a4843e2711899b23a";
  const signedMessageRecipientAccount = new Address(TestVariables.TEST_ADDRESS);
  const signedMessagePrivateKey = TestVariables.TEST_PRIVATE_KEY;
  const signedMessagePublicKey = TestVariables.TEST_PUBLIC_KEY;
  let message;
  let signatureMessage;
  let signedMessagePublicAccount;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    const account = Account.createWithPrivateKey(signedMessagePrivateKey)
    message = "Nem is Awesome";
    signatureMessage = account.signMessage(message).toString();
    signedMessagePublicAccount = new PublicAccount(signedMessageRecipientAccount, signedMessagePublicKey);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should generate the address given a public key", () => {
    const receiverAccount = PublicAccount.createWithPublicKey(publicKey);
    expect(receiverAccount.address.plain()).to.be.equal(recipientAccount);
    expect(receiverAccount.publicKey).to.be.equals(publicKey);
  });

  it("should generate the main address given a public key", () => {
    NEMLibrary.reset();
    NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
    const receiverAccount = PublicAccount.createWithPublicKey(publicKey);
    expect(receiverAccount.address.plain()).to.be.equal("NCJZJHAV63RE2JSKN27DFIHZRXIHAI736U4HGCZW");
    expect(receiverAccount.publicKey).to.be.equals(publicKey);
    NEMLibrary.reset();
  });

  it("should return true when signedMessage is signed with correct privateKey",()=> {
    expect(signedMessagePublicAccount.verifySignedMessage(message,signatureMessage)).to.be.true;
  });

  it("should return false when signedMessage is signed with other privateKey",()=> {
    const failureSignatureMessage = "e2be0d43c6b09f37ddce4807cad2c2fbf0fc6a3483f5de7bbd8c026d59c5e4e569380e459c6d6562630abbc12984d5fb9598d807561967e9094cd3a9bd2false";
    expect(signedMessagePublicAccount.verifySignedMessage(message,failureSignatureMessage)).to.be.false;
  });
});
