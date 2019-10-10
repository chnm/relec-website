preview :
	hugo serve --buildDrafts --buildFuture --disableFastRender

build :
	hugo --cleanDestinationDir --minify

deploy : build
	rsync --delete --itemize-changes --omit-dir-times \
		--checksum -avz --no-perms \
		public/ athena:/websites/releco/www/ | egrep -v '^\.'

.PHONY : preview build deploy
