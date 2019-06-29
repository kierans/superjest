# superjest

> A set of Hamjest matchers for user with superagent

## Usage

`superagent` and `hamjest` are peer dependencies, so users of `superjest` need to install those modules too.

```bash
$ npm install superagent hamjest superjest
```

### Using with superagent

Perform the assertions at the end of the request, however you like to user superagent.

```javascript
it("requests google homepage", function(done) {
  superagent
   .get("https://www.google.com")
   .end((err, resp) => {
     assertThat(resp, hasStatusCode(200));
 
     done();
   });
 });
```

