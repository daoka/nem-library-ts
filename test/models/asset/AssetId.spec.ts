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
import {AssetId} from "../../../src/models/asset/AssetId";

describe("AssetId", () => {

  it("should create a assetId object", () => {
    const namespaceId = "nem";
    const name = "coin";

    const assetId = new AssetId(namespaceId, name);

    expect(assetId.namespaceId).to.be.equal(namespaceId);
    expect(assetId.name).to.be.equal(name);
  });

  it("should two assets be equal", () => {
    const asset = new AssetId("nem", "coin");
    expect(asset.equals(asset)).to.be.true;
  });

  it("should two assets be different with different namespaceId", () => {
    const asset = new AssetId("nem", "coin");
    const otherasset = new AssetId("xem", "coin");
    expect(asset.equals(otherasset)).to.be.false;
  });

  it("should two assets be different with different name", () => {
    const asset = new AssetId("nem", "coin");
    const otherasset = new AssetId("nem", "xem");
    expect(asset.equals(otherasset)).to.be.false;
  });

  it("should return assetId description", () => {
    const asset = new AssetId("nem", "coin");
    expect(asset.description()).to.be.equal("nem:coin");
  });

  it("should return the asset to string", () => {
    const asset = new AssetId("nem", "coin");
    expect(asset.toString()).to.be.equal("nem:coin");
    expect("" + asset).to.be.equal("nem:coin");
  });
});
