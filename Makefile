preview :
	hugo serve --buildDrafts --buildFuture --disableFastRender

build : viz-dependencies
	hugo --cleanDestinationDir --minify

deploy : build
	rsync --delete --itemize-changes --omit-dir-times \
		--checksum -avz --no-perms \
		public/ athena:/websites/releco/www/ | egrep -v '^\.'

viz-dependencies : 
	npx snowpack

.PHONY : preview build deploy viz-dependencies
