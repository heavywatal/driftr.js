## Directories and Files
SRCS := index.html style.css driftr.js README.md d3/d3.min.js d3/LICENSE x18n/x18n.js x18n/LICENSE

## Targets
.PHONY: all dist sync
.DEFAULT_GOAL := all

all:
	open index.html

dist:
	tar czf drifter.js-$$(git describe --tags || echo v0.0).tar.gz ${SRCS}

sync:
	rsync --include=d3/d3.min.js --exclude='.git*' --exclude='d3/*' --exclude='*.gz' --delete -auv ./ meme:~/Default/driftr
