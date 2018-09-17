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
import {NamespaceHttp} from "../../../src/infrastructure/NamespaceHttp";

import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";

describe("NamespacesPageable", () => {
  let namespaceHttp: NamespaceHttp;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    namespaceHttp = new NamespaceHttp([{protocol: "http", domain: "bigalice2.nem.ninja"}]);
    nock("http://bigalice2.nem.ninja:7890")
      .get("/namespace/root/page")
      .thrice()
      .replyWithFile(200, __dirname + "/responses/namespace_page_1.json")
      .get("/namespace/root/page?id=2436")
      .thrice()
      .replyWithFile(200, __dirname + "/responses/namespace_page_2.json")
      .get("/namespace/root/page?id=2476&pageSize=10")
      .thrice()
      .replyWithFile(200, __dirname + "/responses/namespace_page_3.json")
      .get("/namespace/root/page?id=2462&pageSize=10")
      .thrice()
      .replyWithFile(200, __dirname + "/responses/namespace_page_4.json")
  });

  after(() => {
    NEMLibrary.reset();
    nock.cleanAll();
  });

  it("should receive the first file", (done) => {
    namespaceHttp.getRootNamespaces()
      .subscribe(
        (x) => {
          expect(x).to.have.length(25);
          expect(x[0].id).to.be.equal(2475);
          expect(x[x.length - 1].id).to.be.equal(2436);
          done();
        }
      );
  });

  it("should receive the second json file", (done) => {
    namespaceHttp.getRootNamespaces(2436)
      .subscribe(
        (x) => {
          expect(x).to.have.length(25);
          expect(x[0].id).to.be.equal(2435);
          expect(x[x.length - 1].id).to.be.equal(2399);
          done();
        }
      );
  });

  it("should be able to iterate the responses", (done) => {
    const pageable = namespaceHttp.getRootNamespacesPaginated({id: undefined, pageSize: undefined});
    let first = true;
    pageable.subscribe(
      (x) => {
        if (first) {
          expect(x).to.be.length(25);
          expect(x[0].id).to.be.equal(2475);
          first = false;
          pageable.nextPage();
        } else {
          expect(x[0].id).to.be.equal(2435);
          done();
        }
      }
    );
  });

  it("should be able to iterate the responses with id and pageSize", (done) => {
    const pageable = namespaceHttp.getRootNamespacesPaginated({id: 2476, pageSize: 10});
    let first = true;
    pageable.subscribe(
      (x) => {
        if (first) {
          expect(x).to.be.length(10);
          expect(x[0].id).to.be.equal(2475);
          expect(x[x.length - 1].id).to.be.equal(2462);
          first = false;
          pageable.nextPage();
        } else {
          expect(x).to.be.length(10);
          expect(x[0].id).to.be.equal(2461);
          expect(x[x.length - 1].id).to.be.equal(2445);
          done();
        }
      }
    );
  });
});
