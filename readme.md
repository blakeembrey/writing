# Blake Embrey

This is the personal blog of Blake Embrey, but feel free to fork and reuse the design and implementation for your own blog. The blog is statically generated and deployed to Github pages using Wintersmith.

## Preview

Wintersmith has a preview utility built in to its core. To use it, the preview script has been defined in the `package.json`.

```sh
npm run preview
```

## Deployment

To deploy the application, a simple deploy script has been defined in the `package.json`. It will generate a fresh `build` directory and force push the entire contents of the directory to the Github repo, `gh-pages` branch. This allows Github to host the site statically for us, and we don't need to even have a server deployed.

```sh
npm run deploy
```

## License

MIT
