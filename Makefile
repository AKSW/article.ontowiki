help:
	@echo "Article - CLI"
	@echo "     make install-typescript .............. install npm and typescript over npm"
	@echo "     make build-javascript ................ build javascript files"
	@echo ""
	@echo "Article - CS"
	@echo "     make cs-check ........................ Run complete code checking with detailed output"

build-javascript:	
	@echo "Build Javascript files, out of TypeScript files ..."
	@echo " "
	@echo "Build public/javascript/BBEditor.js ... "
	tsc --out public/javascript/BBEditor.js @public/typescript/tsc_arguments/BBEditor.txt
	@echo " "
	@echo "Build public/javascript/EditAction.js ... "
	tsc --out public/javascript/EditAction.js @public/typescript/tsc_arguments/EditAction.txt

install-typescript:
	sudo apt-get install npm && sudo npm install -g typescript

default: help

# coding standard

# #### config ####
# cs-script path
MSOURCE = $(CURDIR)/../../application/tests/CodeSniffer/Makefile
CSSPATH = $(shell dirname $(MSOURCE))/

cs-check:
	$(CSSPATH)cs-scripts.sh -c "-s --report=full *.php */*/*.php"
