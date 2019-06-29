"use strict";

// noinspection NpmUsedModulesInstalled
const AssertionError = require("assertion-error");
const { assertThat, equalTo, instanceOf, throws } = require("hamjest");
const { hasCharset, hasContentLength, hasContentType, hasLocation, hasStatusCode, hasHeader,
		isRedirectedTo, html, json, text } = require("../src/matchers");

describe("matchers", function() {
	let resp;

	beforeEach(function() {
		resp = {
			statusCode: 200,
			headers: {
				"content-type": "application/json",
				"content-length": 12
			}
		}
	});

	describe("status code", function() {
		it("matches status code", function() {
			assertThat(resp, hasStatusCode(200));
		});
	});

	describe("headers", function() {
		it("checks for header presence", function() {
			assertThat(resp, hasHeader("content-length"));
		});

		it("applies matcher", function() {
			assertThat(resp, hasHeader("content-type", equalTo("application/json")));
		});
	});

	describe("content types", function() {
		const types = {
			"application/json": json,
			"text/plain": text,
			"text/html": html
		};

		it("should fail when no content type header", function() {
			delete resp.headers["content-type"];

			const fn = () => { assertThat(resp, hasContentType(equalTo(json()))); };

			assertThat(fn, throws(instanceOf(AssertionError)));
		});

		Object.keys(types).sort().forEach((type) => {
			it(`matches ${type} content type`, function () {
				const matcher = types[type];

				// include the charset so that we avoid making mistakes matching the header
				resp.headers["content-type"] = type + "; charset=utf-8";

				assertThat(resp, hasContentType(equalTo(matcher())));
			});
		});

		it("should detect charset", function() {
			resp.headers["content-type"] = "text/plain; charset=utf-8";
			assertThat(resp, hasCharset(equalTo("utf-8")));

			// due to charset module treating "utf-8" as a special case.
			resp.headers["content-type"] = "text/plain; charset=utf-16";
			assertThat(resp, hasCharset(equalTo("utf-16")));
		});
	});

	describe("content length", function() {
		let contentLength;

		beforeEach(function() {
			contentLength = resp.headers["content-length"];
		});

		it("should fail when no content length header", function() {
			delete resp.headers["content-length"];

			const fn = () => { assertThat(resp, hasContentLength(equalTo(contentLength))); };

			assertThat(fn, throws(instanceOf(AssertionError)));
		});

		it("matches content length", function () {
			assertThat(resp, hasContentLength(equalTo(contentLength)));
		});
	});

	describe("redirection", function() {
		const location = "http://www.google.com";

		beforeEach(function() {
			resp.statusCode = 302;
			resp.headers = {
				"location": location
			};
		});

		it("should fail when no location header", function() {
			delete resp.headers["location"];

			const fn = () => { assertThat(resp, hasLocation(equalTo(location))); };

			assertThat(fn, throws(instanceOf(AssertionError)));
		});

		it("matches location", function () {
			assertThat(resp, hasLocation(equalTo(location)));
		});

		it("checks redirection", function () {
			assertThat(resp, isRedirectedTo(location));
		});
	});
});
