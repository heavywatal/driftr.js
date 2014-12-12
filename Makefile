## Directories and Files
SRCS := index.html style.css driftr.js README.md LICENSE.txt d3/d3.min.js d3/LICENSE x18n/lib/x18n.js x18n/LICENSE
PACKAGE := $(notdir $(shell pwd))
DISTFILES := $(addprefix $(PACKAGE)/,$(SRCS))
VERSION := $(shell git describe --tags || echo v0.0)

## Targets
.PHONY: all dist sync
.DEFAULT_GOAL := all

all:
	open index.html

clean:
	$(RM) *.tar.gz *.zip

dist:
	tar -C .. -czf $(PACKAGE)-$(VERSION).tar.gz $(DISTFILES)
	cd .. && zip $(PACKAGE)/$(PACKAGE)-$(VERSION).zip $(DISTFILES)

sync:
	rsync --include=d3/d3.min.js --exclude='.git*' --exclude='d3/*' --exclude='*.gz' --delete -auv ./ meme:~/Default/driftr
