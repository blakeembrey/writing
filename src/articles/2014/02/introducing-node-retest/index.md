---
title: Introducing Retest
date: 2014-02-11 23:30
author: Blake Embrey
layout: article.pug
---

If you've looked into testing your API in node before, you've probably run across [supertest](https://github.com/visionmedia/supertest) by the prolific TJ Holowaychuk. So have I and it's truly a fantastic library for testing APIs. However, I found it to be lacking a couple of features I sorely needed. And to my surprise, I struggled to find another request testing module in the node ecosystem.

The reason I wrote [retest](https://github.com/blakeembrey/retest) is actually fairly simple. I needed to do away with the verbose chaining syntax and I had no need for the assertions built into supertest. Although I also could have written a HTTP request layer for retest, I decided to go with [request](https://github.com/mikeal/request). It's an extremely useful and well tested library for making requests, with numerous features already built-in that make it perfect for tests.

## How Do I Use It?

I based the implementation on combining the usefulness of supertest with the conciseness of request, so it's extremely straightforward to get started. First we create a test request instance by wrapping an express application.

```javascript
var retest  = require('retest');
var express = require('express');
var app     = express();

// Creates a request instance for interacting with our application. If the
// application is not already listening on a port number, it will be bound to
// an ephemeral port.
var request = retest(app);
```

The `request` variable is now a wrapped instance of request, made to make requests relative to your app. You can even pass other objects to create your `request` instance.

```javascript
// Create a request instance for a remote server.
var request = retest('http://google.com');

// Listen to a normal http(s) server.
var server  = https.createServer({ ... }, app);
var request = retest(server);
```

Now that we have our request instance, we can make requests using the options supported by [request](https://github.com/mikeal/request#requestoptions-callback). That's a load of functionality built-in, so I'll give you a chance to peruse it later. For a basic demo, we'll make a request to the root of our server.

```javascript
request('/', function (err, res) {
  // We have access to the response body here. Or an error if something broke.
});
```

That was simple. We just made the first request to our API. Now we can look at turning this into a test. I'm using Mocha and Chai, but it should make sense if you've never used them.

```javascript
it('should respond with "success"', function (done) {
  request('/', function (err, res) {
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.equal('success');
    done(err);
  });
});
```

## What Else Does Retest Do?

Retest is a fairly thin wrapper around request, since so much functionality already exists in the core module. You can already pipe data to and from your requests, authenticate using OAuth or send custom query strings, bodies and headers. However, one useful feature of retest is automatic request and response body parsing.

If your request specifies a JSON or URL-encoded content type and has a body, it will be automatically serialized.

```javascript
app.post('/', function (req, res) {
  res.send(req.body);
});

retest(app).post('/', {
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    test: 'data'
  }
}, function (err, res) {
  // The response would be the JSON-encoded data. If the request `Content-Type`
  // was set to `application/x-www-form-urlencoded`, we would expect the
  // response body to equal `test=data`.
  expect(res.body).to.equal('{"test":"data"}');
});
```

Even the response body can be parsed. If the response `Content-Type` is set to either JSON or URL-encoding, it will be parsed and set as `res.body`.

Another feature borrowed from supertest is `retest.agent`. Using the agent function returns an instance of request that is using a single cookie jar. This lets cookies persist between API requests.

## Why Remove Chaining and Assertions?

The reason behind removing the chaining syntax is a result of my recent work with generator functions. Once I started writing my code using generators, I found it disconnecting to writing my tests using callbacks. So I implemented [co-retest](https://github.com/blakeembrey/co-retest) which returns thunks. Combine this with [co-mocha](https://github.com/blakeembrey/co-mocha) and now we can write a really elegant API test suite.

```javascript
it('should respond with "success"', function* () {
  var res = yield request('/');

  expect(res.statusCode).to.equal(200);
  expect(res.body).to.equal('success');
});
```

It's important to note that generators are only available in node 0.11 and needs to be enabled using the `--harmony-generators` flag.
