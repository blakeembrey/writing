---
title: ReDoS the web
date: 2024-09-04 12:00
---

## Background

Ten years ago I took over `path-to-regexp` with the release of `v0.1.0`, used in Express.js 4. Between then and now I've released 8 major versions adding, removing, and refining features. If I knew what I knew today, none of those 8 major versions would have been released. That's story for another day.

This story begins with Express 5. As part of reviving Express we're conducting a security audit, and I woke up on day to the revelation that users of `path-to-regexp` (including Express.js, Next.js, and others) may contain vulnerable regular expressions. It has never been reported, but once you know you know.

Any route using two or more parameters between slashes, where the second parameter does not start with `/` or `.`, is currently vulnerable to ReDoS. Express.js uses a vulnerable example in the [routing guide](https://expressjs.com/en/guide/routing.html): `/flights/:from-:to`. The design flaw goes undetected all the way back to the initial commit. Let's look at the regular expression generated for this route:

```js
/^\/flights\/([^\/]+?)-([^\/]+?)\/?$/i
```

This looks reasonable, but if you match against a path like `'/flights/' + '-'.repeat(16_000) + '/x'` it takes 300ms. Holy crap! This _should_ take less than a millisecond. If we tweak it slightly, changing the second parameter from `([^\/]+?)` to `([^\/-]+?)`, it takes just 0.07ms. What's gone wrong?

[OWASP](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) has a clear explanation. When the `/x` is added to the end of the path, it can no longer be matched (due to `$`, end of string), so it backtracks and tries every possible match of `:from-:to`. The more possible matches, the longer it takes.

## Scope

Thankfully the pattern of using more than one parameter within slashes is extremely rare or non-existent. APIs with multiple inputs usually rely on query parameters or operate in the context of a single object ID. That should limit the impact of this exploit and explains why it hasn't been reported before.

### Across JavaScript

The vulnerability exists in every library using regular expressions with multiple parameters in a segment without backtracking prevention. A quick review shows the problem is exploitable in other JavaScript libraries and specifications. Fortunately this is an uncommon pattern to start with, and some libraries avoid the problem by prohibiting multiple parameters in a segment or avoiding regexes.

### Beyond JavaScript

It's possible this vulnerability exists in any other language with regular expressions that backtrack. Libraries such as [RE2](https://github.com/google/re2/wiki/WhyRE2) can be used to guarantee linear time matches and mitigate the problem, but most default regular expression engines are not linear time. Fortunately the fix is easy: restrict backtracking, remove regex from matching, or limit parameters to safe locations.

## Mitigation

For v0.1, I've released a patch that includes automatic backtracking prevention for these exploitable parameters. It will automatically generate `((?!\-|\/).)+?` for the second parameter above (not `-` or `/`). Due to the loose nature of the v0 "parser" this isn't perfect, and will break some routes that use edge cases in the way the regular expression generates.

For version 8, I've removed regex features. I know this is a huge pain for users of the library and apologize in advance. In discussions with the Express TC we decided that any output of `path-to-regexp` that's exploitable is a vulnerability. Since versions < 8 allowed custom regular expressions to be defined using `(...)` and these can combine together to produce ReDoS vectors, the feature has been removed.

All other versions remain vulnerable, and can be mitigated by manually defining the parameters regular expression when two or more parameters exist in a single segment. For example, `/flights/:from-:to(\\w+)`. As long as the first or second parameter does not include `-` in the match, it is safe.

Lastly, feel free to contact me on how to mitigate the vulnerability in versions where users cannot upgrade. My contact information can be found on [GitHub](https://github.com/blakeembrey). The changes necessary in any version will break _something_ for some users and is a trade-off between compatibility and exploitability.

## Other mitigation attempts

### Restrict URL length

Since this exploit gets worse when the URL is longer, restricting the path to some length and throwing a 413 when it exceeds the length would be the simplest mitigation. However, even at 2000 characters in length it's 20x worse than the safe regex. Making matches much shorter than this is bound to break other users.

### Restrict parameter length

Instead of an open ended `+`, use `{1,1000}`. This limits the performance impact (~1ms locally) but could break some users expecting long parameters. It also performs worse than the safe regex.

### RE2

We tried [re2js](https://github.com/le0pard/re2js) and performance was better (~4X) for the long ReDoS URLs, but much worse in every other case. Native bindings would probably be faster but we needed to maintain compatibility as best as possible in Express 4 which is still running node 0.10!

### Rewrite to JavaScript

This was the most promising avenue and provided good performance in limited tests, but I didn't finish. Providing a working mitigation and unblocking Express 5 was higher priority. The one major downside of this is that reintroducing safe regex features in version 8 becomes a lot harder.

## Resources

* [Recheck playground](https://makenowjust-labs.github.io/recheck/playground/) to check for vulnerabilities
