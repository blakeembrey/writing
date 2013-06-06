deploy:
	rm -rf ./build
	wintersmith build
	cd ./build && \
	git init . && \
	git add . && \
	git commit -m "Deploy"; \
	git push "git@github.com:blakeembrey/blakeembrey.com.git" master:gh-pages --force && \
	rm -rf .git
