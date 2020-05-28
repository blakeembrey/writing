---
title: Syntax Highlighted Diffs For Everyone
date: 2014-12-26 00:30
author: Blake Embrey
layout: article
npm: highlighter
github: blakeembrey/highlighter
---

This is a recount, of sorts, on how I added syntax highlighting to diffs on my blog and turned it into a module for anyone to use. The module is made for syntax highlighting Markdown files straight out of the box (supporting [marked](https://github.com/chjj/marked) style highlight callbacks). Check out GitHub and npm for the final result.

Two weeks ago, [GitHub announced](https://github.com/blog/1932-syntax-highlighted-diffs) a new feature - syntax highlighting of diffs. A couple of months earlier, I wrote a detailed [introduction to Metalsmith](/articles/2014/09/building-a-blog-with-metalsmith/) where I used diffs to show the readers what changed at each step. Before I published it I discovered that the diff highlighting by [Highlight.js](https://highlightjs.org/) left the addition and deletion marks inline, which degraded the reading experience. Determined to push live, I forged through and [manually highlighted each line](https://github.com/blakeembrey/blakeembrey.com/commit/206bbb0e047bfe24f92d25d847986ebed6548e06#diff-15ac5cd3ab657e091ee4aa5456e97ddeR68) myself.

Fixing that monstrosity sat on my backlog for months. Finally, I gathered enough time and mental bandwidth to go back and figure out a better solution. It took three complete rewrites over the course of a conference (and then some) to come up with the current solution. This article is more about the thought process over the week than it is about implementing this yourself. That part should be easy for you, just install from npm.

## First Attempt

The first attempt was simple. I googled around and discovered very little information on the topic, so I implemented the only way I saw mentioned. I syntax highlighted the code first, then I run over the generated markup and matched for diff-like syntax ([code here](https://github.com/blakeembrey/blakeembrey.com/blob/dfcedefc853cc01ba33539c9b9b2576b1c23aceb/config/markdown.js)) and wrap those lines in `<span>`s based on the type of change.

I knew it wouldn't work everywhere, but it allowed me to refactor the original article and remove all the horrible markup. Plus it was simple, I was done within the hour. I opted to use the existing language tag in Markdown to indicate that it was also a diff, since I couldn't come up with a cleaner solution (E.g. `<language>.diff`). But I still wanted a something smarter, something that would work everywhere. This solution had faults when the diff markup messed with the syntax highlighting. So I continued.

## Second Attempt

The next attempt was more complex. I figured I could match each line type (addition/deletion/metadata/null) and group them together. Then, I would highlight the addition and deletions separately (with null changes filling the spaces). With the two syntax highlighting results, I could go over the code line by line and pick from either the addition or deletion result based on the line type. However, [this code](https://github.com/blakeembrey/blakeembrey.com/blob/1d0a377e9cdea332045bb6f6074fe29848920746/config/markdown.js) was brittle. What if a `<span>` ran over multiple lines?

### Attempt 2.5

I kept at this solution for a while longer and I added a regex to match open and closing `<span>`s. Then, I pushed each open `<span>` onto an array and popped it off with each closing `</span>`. If there were any left in each section, I'd close them with a `</span>` and open them again in the next section. This was brilliant and clever, I thought, and I needed to publish it. In fact, it wasn't until I was refactoring this into a module that I realised what a deep grave I was digging myself.

## Final Attempt

My third and final attempt started where the last one left off. I knew the grouping was the correct approach, but the highlighter needed a better approach. I recalled that I was only using the `value` property of the returned syntax highlighting object, so I thought it was about time to read some documentation. Lo and behold, I discovered the [third and fourth arguments](http://highlightjs.readthedocs.org/en/latest/api.html#highlight-name-value-ignore-illegals-continuation) of Highlight.js.

The third argument was interesting, I could try to ignore illegal characters in the code. I though this might work when the syntax highlighter started in an invalid position. The holy grail, however, was the fourth argument. It would accept a continuation stack, which meant I could probably leave the syntax highlighting incomplete and start it again later. I hoped that this would also close the `</span>`s for me, and it did!

I used the previous grouping solution and iterated over each group keeping track of the previously highlighted stack (both addition or deletion). It worked out perfectly and I wrapped each highlighted group in a `<span>` with its diff type as the class (E.g. `<span class="diff-addition">`). I attempted to use the `ignore_illegals` argument, but it failed in a JSON example (starting at a property of an object) so I had to disable it again.

The [result of my labour](https://github.com/blakeembrey/highlighter) can be viewed below. Diff syntax highlighting in all its glory - the exact same block of code GitHub uses in [their example](https://github.com/blog/1932-syntax-highlighted-diffs)!

```cs
@@ -164,29 +164,34 @@
         [Fact]
         public void AddRangeBalanceTest()
         {
+            int randSeed = (int)DateTime.Now.Ticks;
+            Console.WriteLine("Random seed: {0}", randSeed);
+            var random = new Random(randSeed);
+
+            int expectedTotalSize = 0;
+
             var list = ImmutableList<int>.Empty;

-            // Add batches of 32, 128 times, giving 4096 items
-            int batchSize = 32;
+            // Add some small batches, verifying balance after each
             for (int i = 0; i < 128; i++)
             {
-                list = list.AddRange(Enumerable.Range(batchSize * i + 1, batchSize));
-                list.Root.VerifyBalanced();
+                int batchSize = random.Next(32);
+                Console.WriteLine("Adding {0} elements to the list", batchSize);
+                list = list.AddRange(Enumerable.Range(expectedTotalSize+1, batchSize));
+                VerifyBalanced(list);
+                expectedTotalSize += batchSize;
             }

             // Add a single large batch to the end
-            list = list.AddRange(Enumerable.Range(4097, 61440));
-            Assert.Equal(Enumerable.Range(1, 65536), list);
-
-            list.Root.VerifyBalanced();
-
-            // Ensure that tree height is no more than 1 from optimal
-            var root = list.Root as IBinaryTree<int>;
+            int largeBatchSize = random.Next(32768) + 32768;
+            Console.WriteLine("Adding {0} elements to the list", largeBatchSize);
+            list = list.AddRange(Enumerable.Range(expectedTotalSize + 1, largeBatchSize));
+            VerifyBalanced(list);
+            expectedTotalSize += largeBatchSize;

-            var optimalHeight = Math.Ceiling(Math.Log(root.Count, 2));
+            Assert.Equal(Enumerable.Range(1, expectedTotalSize), list);
-            Console.WriteLine("Tree depth is {0}, optimal is {1}", root.Height, optimalHeight);
-            Assert.InRange(root.Height, optimalHeight, optimalHeight + 1);
+            list.Root.VerifyHeightIsWithinTolerance();
         }

         [Fact]
```

The result was extremely satisfying. I coded and refactored over the course of a few days to discover a brilliant solution built directly into the library for me. Is this the final solution, or will there still more to refactor?
