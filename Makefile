default:
	@echo "Article - CLi"
	@echo " make install-typescript > install npm and typescript over npm"
	@echo " make build-javascript > build javascript files"
	
build-javascript:	
	@echo "Build Javascript files, out of TypeScript files ..."
	@echo " "
	@echo "Build public/javascript/BBEditor.js ... "
	tsc --out public/javascript/BBEditor.js @public/typescript/tsc_arguments/BBEditor.txt
	@echo " "
	@echo "Build public/javascript/EditAction.js ... "
	tsc --out public/javascript/EditAction.js @public/typescript/tsc_arguments/EditAction.txt
	@echo " "
	@echo "Build public/javascript/IndexAction.js ... "
	tsc --out public/javascript/IndexAction.js @public/typescript/tsc_arguments/IndexAction.txt

install-typescript:
	sudo apt-get install npm && sudo npm install -g typescript
