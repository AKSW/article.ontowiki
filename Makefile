default:
	@echo "Article - CLi"
	@echo " make install-typescript > install npm and typescript over npm"
	@echo " make build-javascript > build javascript files"
	
build-javascript:	
	@echo "Build Javascript files, out of TypeScript files ..."
	@echo " "
	@echo "Build static/javascript/BBEditor.js ... "
	tsc --out static/javascript/BBEditor.js @static/typescript/tsc_arguments/BBEditor.txt
	@echo " "
	@echo "Build static/javascript/EditAction.js ... "
	tsc --out static/javascript/EditAction.js @static/typescript/tsc_arguments/EditAction.txt

install-typescript:
	sudo apt-get install npm && sudo npm install -g typescript
