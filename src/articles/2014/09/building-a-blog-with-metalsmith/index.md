---
title: Building a Blog with Metalsmith
date: 2014-10-04 13:15
author: Blake Embrey
template: article.jade
---

[Metalsmith](http://www.metalsmith.io/) is a new addition to static site generator space, only released at the beginning of this year. It's written in JavaScript and provides an extremely simple plugin system for composing files using middleware. The fact that everything is a plugin makes it incredibly easy to understand what is happening under the hood and extend it when you need to add new functionality.

## Getting Started

For this tutorial, I converted the blog you're currently reading to Metalsmith. To start, we'll create a new project directory, then create a `src` directory inside of that. The first thing we need to save the snippet below into a `package.json`, which holds all our blog dependencies.

```json
{
  "name": "example-blog",
  "version": "0.0.0",
  "private": true,
  "description": "Example blog.",
  "author": "Blake Embrey",
  "license": "MIT"
}
```

Now that you have a valid `package.json`, you will need to install `metalsmith` locally to get started. Execute `npm install metalsmith --save` and you'll notice it's been automatically added to the `package.json`. With that as the initial dependency, you need to create a `build.js` file with the content below.

```javascript
var metalsmith = require('metalsmith');

metalsmith(__dirname)
  .source('src')
  .destination('build')
  .build(function (err) {
    if (err) {
      throw err;
    }
  });
```

## Adding articles

Now you have a working Metalsmith instance - it just doesn't do anything yet. There aren't any files in `src` and no plugins are being used to process data yet. First things first, let's create an `articles` (or `posts`, etc.) directory under `src`. This structure will a part of our url (E.g. `/articles/...`). Inside the directory you created, you need to create your first markdown file. The snippet below is a very simple article with metadata.

```
---
title: Example title.
date: 2014-09-29 23:00
author: Blake Embrey
template: article.jade
---

Example content.
```

Nothing exciting so far. If you build the blog by executing `node build.js`, you'll see a new `build` directory with the contents copied from the `src` directory. However, if you look at your markdown article you'll notice the metadata is missing. That is because the parts between the three dashes at the beginning is YAML font-matter (a type of associated metadata). We can access metadata from within any plugin or template, and it can be added to the beginning of any file and automatically be parsed.

## Processing Markdown

The next step would be to add markdown processing into our build script. This will allow us to turn the all our markdown into HTML documents. To do this, we'll install the [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) (using `npm install metalsmith-markdown --save`). If we also want syntax highlighting of code snippets, we can use `highlight.js` (or `highlighter` which offers a simple abstraction for markdown - `npm install highlighter --save`).

```javascript.diff
 var metalsmith  = require('metalsmith');
+var markdown    = require('metalsmith-markdown');
+var highlighter = require('highlighter');

 metalsmith(__dirname)
   .source('src')
+  .use(markdown({
+    gfm: true,
+    tables: true,
+    highlight: highlighter()
+  }))
   .destination('build')
```

Running your build script (`node build.js`) will now result in your markdown file becoming HTML. If you add a code block fenced by three backticks, you'll also get to see syntax highlighting automatically applied (in HTML, still need to add the CSS - consider starting with a theme from the [highlight.js demo](https://highlightjs.org/static/demo/)).

## Templates

Now it's time to start making things look pretty by adding templates. Let's start out with the article template, since you already have an article to work with. Start by installing [metalsmith-templates](https://github.com/segmentio/metalsmith-templates) (`npm install metalsmith-templates --save`) and creating a `templates` directory. Create your first template file inside the templates directory. Since I'm using [jade](https://github.com/visionmedia/jade) I've created an `article.jade` template. Here's a simple example in Jade:

```jade
html(lang='en')
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
    meta(name='viewport', content='width=device-width')
    title= title
  body
    h1= title
    div.timestamp= date
    article!= contents
```

With the template created, you need to include the plugin. And since I'm using jade, I'll need to install `jade` using `npm install jade --save` (for Handlebars use `npm install handlebars --save` and change the engine below). Let's update our `build.js` with the code below.

```javascript.diff
 var metalsmith = require('metalsmith');
 var markdown   = require('metalsmith-markdown');
 var highlight  = require('highlight.js');
+var templates  = require('metalsmith-templates');

 metalsmith(__dirname)
@@ ... @@
+  .use(templates({
+    engine: 'jade',
+    directory: 'templates'
+  }))
   .destination('build')
```

Running `node build.js` again will give you a complete HTML file in place of our markdown file. However, if you're using a different template file you will need to update the markdown metadata. In the template file you have access to the variables such as `contents`, `date` and `title` without having to define them. This is because the metadata is coming from our inline definition and `contents` is our files content. All plugins can interact, manipulate and add to this data.

## Pretty Permalinks

You can add permalinks to your blog by using [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks) (`npm install metalsmith-permalinks --save`). Although you have the option for setting a pattern to rewrite URLs, I opted to use it without any options set. This is so it'll just fix up all my paths to look cleaner anyway, and add the fancy `path` property to the files metadata.

```javascript.diff
@@ ... @@
 var highlight  = require('highlight.js');
 var templates  = require('metalsmith-templates');
+var permalinks = require('metalsmith-permalinks');

 metalsmith(__dirname)
@@ ... @@
+  .use(permalinks())
   .use(templates({
     engine: 'jade',
     directory: 'templates'
   }))
   .destination('build')
```

## Collections

Perfect, so far we've got nice fancy URLs and blog posts rendering. Next we'll want to group all the articles together into a collection for rendering on the homepage. This also links the posts between each other so we can do things like "next" and "previous" links. As you've probably realised, you can install a plugin for this purpose - [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) using `npm install metalsmith-collections --save`. Once installed, add it to the `build.js`.

```javascript.diff
@@ ... @@
 var permalinks  = require('metalsmith-permalinks');
+var collections = require('metalsmith-collections');

 metalsmith(__dirname)
   .source('src')
+  .use(collections({
+    articles: {
+      pattern: 'articles/**/*.md',
+      sortBy: 'date',
+      reverse: true
+    }
+  }))
@@ ... @@
```

The snippet above will match all markdown files in the `articles` directory, then sort them in chronological order with the most recent one at the beginning - just like a blog. The collection itself is stored as global Metalsmith metadata under `collections.articles`. Just make sure you add the collections plugin before our templates and markdown plugins since they always run in order.

## Homepage

Now that we have a collection of all our posts, let's create a homepage. Using your template engine of choice, you can add a new template file to the `templates` directory. For example, I'm creating `index.jade` like below.

```jade
html(lang='en')
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
    meta(name='viewport', content='width=device-width')
    title= 'Home'
  body
    each article in collections.articles
      article.content-article
        header
          span.timestamp= article.date
          h2
            a(href='/' + article.path)= article.title
```

Now we're talking! Let's render this template by creating an `index.html` file in the root of our `src` directory. This will simply act as metadata for rendering our template, as below.

```
---
template: index.jade
---
```

With that complete, you can run the build again (`node build`) and stare in awe at your beautiful homepage. At this point you might want to start serving the `build` folder locally too, so I run `npm install -g serve` and then used `serve build` to view the directory.

## Adding Global Metadata

You may have noticed that it'd be handy to add some generic metadata or modules to reuse in templates. I hear you, so you can install [metalsmith-define](https://github.com/aymericbeaumet/metalsmith-define) (`npm install metalsmith-define`) for this. With that installed, you can now define global metadata anywhere in the metalsmith middleware stack.

```javascript.diff
@@ ... @@
 var collections = require('metalsmith-collections');
+var define      = require('metalsmith-define');

 metalsmith(__dirname)
   .source('src')
+  .use(define({
+    blog: {
+      uri: 'http://blakeembrey.com',
+      title: 'Blake Embrey',
+      description: 'Hello world.'
+    },
+    owner: {
+      uri: 'http://blakeembrey.me',
+      name: 'Blake Embrey'
+    },
+    moment: require('moment')
+  }))
   .use(collections({
     articles: {
       pattern: 'articles/**/*.md',
       sortBy: 'date',
       reverse: true
     }
   }))
@@ ... @@
```

With the above, I have defined some information about the blog and the owner. I also added [moment](http://momentjs.com/) (`npm install moment --save`) because it'll be handy for formatting our dates. I might quickly go back to our article and homepages templates now and wrap our date in `moment(date).format('MMMM D, YYYY')` for prettier dates. In Handlebars, you can create a `formatDate` helper and use moment that way.

## Pagination

Wow, we're nearly done already. Let's add one thing every good blog deserves, pagination of articles. To get started, install [metalsmith-collections-paginate](https://github.com/blakeembrey/metalsmith-collections-paginate) because it works directly with the collections and templates plugins. We can now delete `index.md` from the `src` directory as the plugin will generate it for us.

```javascript.diff
@@ ... @@
 var define      = require('metalsmith-define');
+var paginate    = require('metalsmith-collections-paginate');

@@ ... @@
   .use(collections({
     articles: {
       pattern: 'articles/**/*.md',
       sortBy: 'date',
       reverse: true
     }
   }))
+  .use(paginate({
+    articles: {
+      perPage: 5,
+      first: 'index.html',
+      template: 'index.jade'
+    }
+  }))
@@ ... @@
```

The options are set by using the same name as the corresponding collection in the previous steps. We can set a limit of files per page, the first page location and the template for rendering the files. With this defined, you need to make some tweaks and improvements to the `index.jade` template.

```jade.diff
 html(lang='en')
   head
     meta(charset='utf-8')
     meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
     meta(name='viewport', content='width=device-width')
     title= 'Home'
   body
-    each article in collections.articles
+    each article in paginate.files
       article.content-article
         header
           span.timestamp= moment(article.date).format('MMMM D, YYYY')
           h2
             a(href='/' + article.path)= article.title
+  nav
+    if paginate.previous
+      a.btn(href='/' + paginate.previous.path)
+        | Newer
+    if paginate.next
+      a.btn(href='/' + paginate.next.path)
+        | Older
```

Notice that the loop is changed to iterate over `paginate.files` instead. Also "next" and "previous" buttons are added to the homepage. For the plugin to work properly, it needs to be included after the collections plugin, and before the permalinks and templates plugins. This works because we need access to the collections metadata in the plugin, but need the generated files to have a path and content created using templates.

## Article Snippets

Another thing that all good blogs seem to have are content snippets. For this, you'll install [metalsmith-snippet](https://github.com/blakeembrey/metalsmith-snippet) which allows you to access a short snippet of the HTML files in templates. Let's include the plugin in the `build.js` file.

```javascript.diff
@@ ... @@
 var paginate    = require('metalsmith-collections-paginate');
+var snippet     = require('metalsmith-snippet');

@@ ... @@
+  .use(snippet())
   .use(permalinks())
   .use(templates({
     engine: 'jade',
     directory: 'templates'
   }))
@@ ... @@
```

This will automatically generate a snippet for all the articles based on a number of characters. Make sure it comes after the markdown parsing is done though. With this enabled, we can add `article.snippet` to the homepage template and print out article summaries.

## Enable XML Feed

Next up, we will enable an XML feed for the blog. This will allow people to subscribe to the blog for new articles in feed readers. To do this, you'll need to create a template for our feed. Here's my `feed.jade` template:

```jade
doctype xml
rss(version='2.0',
    xmlns:content='http://purl.org/rss/1.0/modules/content/',
    xmlns:wfw='http://wellformedweb.org/CommentAPI/',
    xmlns:dc='http://purl.org/dc/elements/1.1/'
    xmlns:atom='http://www.w3.org/2005/Atom')
  channel
    title= blog.title
    atom:link(href=blog.uri + '/feed.xml', rel='self', type='application/rss+xml')
    link= blog.uri
    description= blog.description
    pubDate= moment(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    language en
    for article in collections.articles
      - var permalink = blog.uri + '/' + article.path
      item
        title= article.title
        link= permalink
        pubDate= moment(article.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
        guid(isPermaLink='true')= permalink
        author= article.author
        description= article.snippet
```

The snippet above is creating a new XML document. We add a bunch of metadata properties to the XML feed for describing various things, then iterate over all the articles and output each article as an XML `item`. The one new thing you might notice is the global `date` variable, which is added by [metalsmith-build-date](https://github.com/segmentio/metalsmith-build-date) (`npm install metalsmith-build-date` and `.use(date())`). For this template to render, we will create a `feed.xml` in the `src` directory with the content below.

```
---
template: feed.jade
---
```

## Adding Comments

One important aspect of a blog is having a place for readers to leave their comments and thoughts, with the goal of continuing the discussion beyond the original article. For a static site, our comment systems are little more limited to JavaScript implementations that provide their own backend for storage. Personally, I tend to gravitate toward [disqus](http://disqus.com/). Let's add their snippet to the bottom of `article.jade`.

```jade
div#disqus_thread

script.
  //- Disqus code snippet
  (function() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//blakeembrey.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
```

## Deploying to Github Pages

Now that we've got our static site running, we need to find a way to distribute it to the masses. We can host it anywhere statically without any hassle, but I opted to use [Github Pages](https://pages.github.com/). For this to work I added a `CNAME` file to the `src` directory - this is needed for Github to allow a custom domain.

```
blakeembrey.com
```

Next, I created a simple deploy script and added it to my `package.json`.

```json.diff
 {
   "name": "example-blog",
   "version": "0.0.0",
   "private": true,
   "description": "Example blog.",
+  "scripts": {
+    "build": "node build.js",
+    "deploy": "npm run build && cd build && git init . && git add . && git commit -m \"Deploy\"; git push \"git@github.com:blakeembrey/blakeembrey.com.git\" master:gh-pages --force && rm -rf .git"
+  },
   "author": "Blake Embrey",
   "license": "MIT"
 }
```

For the build script above to work for you, you'll need to change the repository (`blakeembrey/blakeembrey.com`) to your Github repository.

## Extra Goodies

I also implemented a couple of bonus things in this blog during development - [metalsmith-autoprefixer](https://github.com/esundahl/metalsmith-autoprefixer) for adding browser prefixes to my CSS and [metalsmith-redirect](https://github.com/aymericbeaumet/metalsmith-redirect) for maintaining backwards compatibility with my old URLs. Check out the [Metalsmith homepage](http://www.metalsmith.io/) to discover more great plugins.

## Live!

And we're done, let's get this blog live. All we need to do now is execute `npm run deploy`, which will run the build and deploy scripts and push to Github. All code and content for this blog and article is [open source](https://github.com/blakeembrey/blakeembrey.com), so feel free to browse for more ideas.
