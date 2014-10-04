---
title: Building a Blog with Metalsmith
date: 2014-10-04 13:15
author: Blake Embrey
template: article.jade
---

[Metalsmith](http://www.metalsmith.io/) is a newer addition to static site generator space, released at the beginning of this year. It's written in JavaScript and provides an extremely simple plugin system for composing files using a chain of functions. What's the big deal? The fact that everything is a plugin makes it incredibly easy to understand what is actually happening under the hood and extend it when you want to add new functionality.

## Getting Started

For this tutorial, I have converted the blog you're currently reading to Metalsmith. This tutorial will also be suitable if you're starting a new statically generated blog from scratch. First, we'll create our new project directory, then create a `src` subdirectory. You will also want to initialise a new `package.json` to hold and version dependencies by running `npm init` in the command line.

You can ignore the `entry file` and `test command` prompts:

```json
{
  "name": "example-blog",
  "version": "0.0.0",
  "description": "Example blog.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Blake Embrey",
  "license": "MIT"
}
```

Now that we've got a valid `package.json`, we will want to install `metalsmith` locally to get started. Run `npm install metalsmith --save` and you'll notice it's automatically added to our `package.json`. With that being our initial dependency, we need to create a root `build.js` file which will be the starting point for our blog.

```javascript
var metalsmith = require('metalsmith');

metalsmith(__dirname)
  .source('src')
  .destination('build')
  .build(function (err) {
    if (err) throw err;
  });
```

## Adding articles

At this point, we already have a working metalsmith instance - it just doesn't do anything yet. There aren't any files in `src` and no plugins are being used to process data yet. First things first, let's create an `articles` (or any other name you see fit) directory under `src`. Inside that folder, we'll create our first markdown file named whatever we want - just make sure the extension is `.md`. Personally, I opted for a `year/month/slug/index.md` format for storing articles.

```
---
title: Example title.
date: 2014-09-29 23:00
author: Blake Embrey
template: article.jade
---

Example content.
```

Nothing exciting so far. If we build the blog using `node build.js`, we'll be have a new `build` directory with the contents copied from the `src` directory. Now, if you look at the markdown file you'll notice the first part is missing. This is because the text between three dashes at the beginning of a file is considered YAML front matter (file metadata). We can access and manipulate this data in our plugins and it will always be parsed and removed from all files.

## Processing Markdown

The next step would be to add markdown processing into our build script. This will allow us to turn the all our markdown into HTML documents. To do this, we'll install the [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) (using `npm install metalsmith-markdown --save`). We also want syntax highlighting of our code samples, so we can also install `highlight.js`.

```javascript
var markdown  = require('metalsmith-markdown');
var highlight = require('highlight.js');

metalsmith(__dirname)
  .source('src')
  .use(markdown({
    gfm: true,
    tables: true,
    highlight: function (code, lang) {
      if (lang) {
        return highlight.highlight(lang, code).value;
      }

      return code;
    }
  }))
  ...
```

Running the build script now will result in your markdown file becoming a html file. If you add a code block using backticks, you'll also see syntax highlighting automatically added (just make sure you specify the language). In fact, it's even possible to auto-highlight code snippets when you omit the language, but I opted not to do that. It's just a matter of changing the last line to `return highlight.highlightAuto(code).value`.

## Templates

Now it's time to start making things look pretty by adding templates. We'll start out with the article template, since we already have an article to work with. Let's install [metalsmith-templates](https://github.com/segmentio/metalsmith-templates) and create a `templates` directory. Inside the templates directory, we can create your first template file - since I'm using [jade](https://github.com/visionmedia/jade) I have created `article.jade`. Here's a simple example:

```jade
html(lang='en')
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
    meta(name='viewport', content='width=device-width')
    title= title
    link(rel='author', href='https://google.com/+BlakeEmbrey')
  body
    h1= title
    div.timestamp= date
    article!= contents
```

With our template built, we should include the plugin. Since I'm using jade, I'll need to install `jade` using `npm install jade --save`.

```javascript
var templates = require('metalsmith-templates');

metalsmith(__dirname)
  ...
  .use(templates({
    engine: 'jade',
    directory: 'templates'
  }))
  ...
```

Running our build again should now give us a complete HTML file in place of our markdown file, since we have already specified the template in our metadata. Notice that in the template, we have access to variables such as `contents`, `date` and `title` without having to define them. This is because the data was populated from our inline metadata, while `contents` is our files content. All plugins can interact, manipulate and add to this data.

## Pretty Permalinks

You can add pretty permalinks to your blog using [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks). Although you have the option for setting pattern to rewrite URLs, I actually just opted to use it without any options set since it will fix up paths to look permalink-like by default and always add the fancy path to the `path` metadata property.

```javascript
var permalinks = require('metalsmith-permalinks');

metalsmith(__dirname)
  ...
  .use(permalinks())
  ...
```

## Collections

Perfect, so far we've got nice fancy URLs and our blog posts rendering. Next we'll want to group all our articles together into a collection for rendering on the homepage. This also links the between each other so we can do things like link to "next" and "previous" posts. As you've probably realised, we can install a plugin for this purpose - [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) using `npm install metalsmith-collections --save`. Once installed, we need to add it to our `build.js`.

```javascript
var collections = require('metalsmith-collections');

metalsmith(__dirname)
  ...
  .use(collections({
    articles: {
      pattern: 'articles/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  ...
```

The snippet above will match all the Markdown files in the `articles`, then sort them chronological order with the most recent one at the beginning - just like a blog. The collection itself is stored as global Metalsmith metadata under `collections.articles`. Make sure you add the collections plugin before our templates or markdown plugins, since they are always run in the order they are defined.

## Homepage

Now that we have a collection of all our posts, let's create a homepage. Using your template engine of choice, we'll add a new template file to our templates directory. For example, I'm creating `index.jade`.

```jade
html(lang='en')
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
    meta(name='viewport', content='width=device-width')
    title= 'Home'
    link(rel='author', href='https://google.com/+BlakeEmbrey')
  body
    each article in collections.articles
      article.content-article
        header
          span.timestamp= article.date
          h2
            a(href='/' + article.path)= article.title
```

Now we're talking! Let's render this template by creating an `index.md` file in the root of our `src` directory. This will act using metadata to render our template.

```
---
template: index.jade
---
```

With that complete, we can run our build again and stare in awe at our beautiful homepage. At this point we might want to start serving the `build` folder too, so I just did `npm install -g serve` and run `serve build` to view the directory.

## Adding Global Metadata

You may have noticed that it'd be handy to add some global metadata or modules to use like `moment.js`. I hear you, so you can install [metalsmith-define](https://github.com/aymericbeaumet/metalsmith-define) to add this. With that included, we can now add global metadata anywhere along our Metalsmith chain.

```javascript
var define = require('metalsmith-define');

metalsmith(__dirname)
  ...
  .use(define({
    blog: {
      uri: 'http://blakeembrey.com',
      title: 'Blake Embrey',
      description: 'Hello world.'
    },
    owner: {
      uri: 'http://blakeembrey.me',
      name: 'Blake Embrey'
    },
    moment: require('moment')
  }))
  ...
```

In the above snippet, I defined some information about our blog and the owner. I also added [moment](http://momentjs.com/) since it'll be really handy for formatting our dates. I might quickly go back to our previous template now and wrap our date output in `moment(date).format('MMMM D, YYYY')` for prettier dates.

## Pagination

Wow, we're nearly done already. Let's add one thing every good blog deserves, pagination of articles on the homepage. To get started with this, we'll install [metalsmith-collections-paginate](https://github.com/blakeembrey/metalsmith-collections-paginate) since it works directly with our collections and templates. We can also remove `index.md` from the source directory, since this plugin will generate it for us.

```
var paginate = require('metalsmith-collections-paginate');

metalsmith(__dirname)
  ...
  .use(paginate({
    articles: {
      perPage: 5,
      first: 'index.html',
      template: 'index.jade'
    }
  }))
  ...
```

The options are set by using the same names as our collections in the previous steps. We can set the limit of files per page, the first page output location and our template for rendering the file. We this defined, we need to make some tweaks and improvements to our `index.jade` template.

```jade
html(lang='en')
  head
    meta(charset='utf-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
    meta(name='viewport', content='width=device-width')
    title= 'Home'
    link(rel='author', href='https://google.com/+BlakeEmbrey')
  body
    each article in paginate.files
      article.content-article
        header
          span.timestamp= moment(file.date).format('MMMM D, YYYY')
          h2
            a(href='/' + article.path)= article.title
  nav
    if paginate.previous
      a.btn(href='/' + paginate.previous.path)
        | Newer
    if paginate.next
      a.btn(href='/' + paginate.next.path)
        | Older
```

Notice that we changed our loop to iterate over `paginate.files` instead. We also added "next" and "previous" buttons to the homepage. For the plugin to work properly, it needs to be included after our collections plugin and before the permalinks and templates plugins. This works because we need access to the collections metadata in the plugin, but need our generated files to have a path and content created.

## Article Snippets

Another thing that all good blogs seem to have are content snippets. For this, we'll install [metalsmith-snippet](https://github.com/blakeembrey/metalsmith-snippet) which allows us to access a short snippet of HTML files in templates. Let's add the plugin to our `build.js` file.

```javascript
var snippet = require('metalsmith-snippet');

metalsmith(__dirname)
  ...
  .use(snippet())
  ...
```

This will automatically generate a snippet for all our articles based on a number of characters. Make sure it comes after the markdown parsing though. With this enabled, we can add `article.snippet` to our homepage template and print out our article summaries.

## Enable XML Feed

Next up, we will enable an XML feed for our blog. This will allow people to subscribe to our blog for new articles in feed readers. To do this, we'll need to create a template for our feed. Here's mine:

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

The snippet above is creating a new XML document. We add a bunch of metadata properties to the XML feed for describing various things, then iterate over all the articles and output each article as an XML `item`. The one new thing you might notice is the global `date` variable, which is added by [metalsmith-build-date](https://github.com/segmentio/metalsmith-build-date).

## Adding Comments

One important aspect of a blog is having a place for readers to leave their comments and thoughts, with the goal of continuing the discussion beyond the original article. For a static site, our comment systems are little more limited to JavaScript implementations that provide their own backend for storage. Personall, I tend to gravitate toward [disqus](http://disqus.com/). Let's add the site snippet to the bottom of `article.jade`.

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

Now that we've got our static site running, we need to find a way to distribute it to the masses. For this, we can host it anywhere statically with no hassle, but I opted to use [Github Pages](https://pages.github.com/). What does this even require though? First, I added a `CNAME` file in the root of my `src` directory - this is needed for Github to allow a custom domain.

```
blakeembrey.com
```

Next, I created a simple deploy script and added it to my `package.json`.

```json
  ...
  "scripts": {
    "build": "node build.js",
    "deploy": "npm run build && cd build && git init . && git add . && git commit -m \"Deploy\"; git push \"git@github.com:blakeembrey/blakeembrey.com.git\" master:gh-pages --force && rm -rf .git"
  },
  ...
```

The script runs the build script (`scripts.build`), changes to the build directory and initializes the directory with git. Creating a single "Deploy" commit, we push the directory to our `gh-pages` branch of Github where it'll be automatically hosted.

## Extra Goodies

So I implemented a couple of bonus things with this blog during development - [metalsmith-autoprefixer](https://github.com/esundahl/metalsmith-autoprefixer) for adding browser prefixes to my CSS and [metalsmith-redirect](https://github.com/aymericbeaumet/metalsmith-redirect) for maintaining backwards compatibility with my old URLs.

## Live!

And with that, let's get this blog live. All I need to do now is execute `npm run deploy`, which will run our deploy script and push to Github. All code for this blog and article is [open source](https://github.com/blakeembrey/blakeembrey.com).
