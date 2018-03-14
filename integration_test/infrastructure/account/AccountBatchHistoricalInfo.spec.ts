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
import nock = require("nock");
import {AccountHttp} from "../../../src/infrastructure/AccountHttp";
import {Address} from "../../../src/models/account/Address";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";

describe("AccountBatchHistoricalInfo", () => {
  let addresses: Address[];
  let accountHttp: AccountHttp;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    addresses = [new Address("TALICEROONSJCPHC63F52V6FY3SDMSVAEUGHMB7C"), new Address("TALIC37D2B7KRFHGXRJAQO67YWOUWWA36OU46HSG")];
    accountHttp = new AccountHttp();
    nock("http://104.128.226.60:7890")
        .post("/account/historical/get/batch", {
            accounts: [
                { account: "TALICEROONSJCPHC63F52V6FY3SDMSVAEUGHMB7C" },
                { account: "TALIC37D2B7KRFHGXRJAQO67YWOUWWA36OU46HSG" }
            ],
            startHeight: 100000,
            endHeight: 100001,
            incrementBy: 1,
        })
      .once()
      .replyWithFile(200, __dirname + "/responses/account_historical_batch.json");
  });

  after(() => {
    NEMLibrary.reset();
    nock.cleanAll();
  });

  it("should receive the historical info", (done) => {
    accountHttp.getBatchHistoricalAccountData(addresses, 100000, 100001, 1)
      .subscribe(
        (x) => {
          expect(x).to.have.length(2);
          expect(x[0]).to.have.length(2);
          expect(x[0][0].address.plain()).to.equal("TALICEROONSJCPHC63F52V6FY3SDMSVAEUGHMB7C");
          done();
        },
      );
  });
});
