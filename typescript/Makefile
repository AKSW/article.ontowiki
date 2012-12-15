help:
	@echo "Article - Build Javascript files out of TypeScript files"
	@echo "     make install-typescript .............. install npm and typescript over npm"
	@echo "     make build-javascript ................ build javascript files"

build-javascript:	
	@echo "Build Javascript files, out of TypeScript files ..."
	@echo " "
	@echo "Build ../public/javascript/BBEditor.js ... "
	tsc --out ../public/javascript/BBEditor.js @tsc_arguments/BBEditor.txt
	@echo " "
	@echo "Build ../public/javascript/EditAction.js ... "
	tsc --out ../public/javascript/EditAction.js @tsc_arguments/EditAction.txt

install-typescript:
	sudo apt-get install npm && sudo npm install -g typescript
