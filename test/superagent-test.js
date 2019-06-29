"use strict";

const nock = require("nock");
const superagent = require('superagent');

const { assertThat } = require("hamjest");
const { hasStatusCode } = require("../src/matchers");

describe("superagent", function() {
	afterEach(function() {
		nock.cleanAll();
	});

	it("should be able to use matchers with superagent", function(done) {
		const url = "http://localhost:1002";

		nock(url)
			.get("/")
			.reply(200, "Hello from nock");

		superagent
			.get(url + "/")
			.end((err, resp) => {
				assertThat(resp, hasStatusCode(200));

				done();
			});
	});
});
