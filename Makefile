preview :
	@echo "Serving the preview site with webpack and Hugo ..."
	npx webpack --mode=development --display=errors-only
	npx webpack --mode=development --display=errors-only --watch &
	hugo serve --buildDrafts --buildFuture --disableFastRender 

build : visualizations
	@echo "\nBuilding the site with Hugo ..."
	hugo --cleanDestinationDir --minify
	@echo "Website finished building."

visualizations : 
	@echo "\nCompiling the visualizations with webpack ..."
	npx webpack
	@echo "Finished compiling the visualizations with webpack."

deploy : build
	@echo "\nDeploying the site with rsync ..."
	rsync --delete --itemize-changes --omit-dir-times \
		--checksum -avz --no-perms \
		public/ athena:/websites/releco/www/ | egrep -v '^\.'
	@echo "Finished deploying the site with rsync."

.PHONY : preview build deploy visualizations
