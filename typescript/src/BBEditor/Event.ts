/// <reference path="..\DeclarationSourceFiles\JSON.d.ts" />
/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />

/**
 * Make variables accessible for TypeScript
 */
var articleData = articleData || {};

/**
 * Event section
 */
$(document).ready(function(){
    BBEditor_Event.ready ();
});

class BBEditor_Event {
    /**
     * After document is ready
     */
    static ready () {
                
        /**
         * 
         */
        BBEditor_Main.initializeBBEditor (
            articleData ["BBEditor"]["textareaId"],
            articleData ["BBEditor"]["toolbarId"],
            articleData ["articleImagesUrl"],
            articleData ["BBEditor"]["toolbarEntries"]
        );
    }
}
