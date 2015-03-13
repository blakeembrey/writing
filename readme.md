# Blake Embrey

This is the personal blog of Blake Embrey, but feel free to fork and reuse the design and implementation for your own blog. The blog is statically generated using Metalsmith and hosted using Github pages.

## Usage

To create a new article, create the corresponding year and month folder under `src/articles`. This currently hosts all our blog posts.

## Development

During development, you can build the blog using `npm run build`. This will run `build.js` and generate the build directory.

```sh
npm run build
```

## Deployment

To deploy the blog, a simple deploy script has been provided in the `package.json`. It creates the `build` directory, then initializes the folder as a new project in git and force pushed it to the `gh-pages` branch on Github. This allows Github to host the site statically for us and relieves us burden of hosting the content ourselves.

```sh
npm run deploy
```

## License

MIT
