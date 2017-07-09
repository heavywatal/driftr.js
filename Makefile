## Directories and Files
SRCS := index.html style.css driftr.js README.md LICENSE
PACKAGE := $(notdir $(shell pwd))
DISTFILES := $(addprefix $(PACKAGE)/,$(SRCS))
VERSION := $(shell git describe --tags || echo v0.0)

## Targets
.PHONY: all clean dist
.DEFAULT_GOAL := all

all:
	open index.html

clean:
	$(RM) *.tar.gz *.zip

dist:
	tar -C .. -czf $(PACKAGE)-$(VERSION).tar.gz $(DISTFILES)
	cd .. && zip $(PACKAGE)/$(PACKAGE)-$(VERSION).zip $(DISTFILES)
