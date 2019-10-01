preview :
	hugo serve --buildDrafts --buildFuture --disableFastRender

build :
	hugo --cleanDestinationDir --minify

deploy : build
	rsync --dry-run --delete \
		--itemize-changes --omit-dir-times \
		--checksum -avz \
		public/ athena:/websites/releco/www/ | egrep -v '^\.'
