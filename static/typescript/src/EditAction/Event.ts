/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />
/// <reference path="..\DeclarationSourceFiles\showdown.d.ts" />

/**
 * Make variables accessible for TypeScript
 */
var articleData = articleData || {};

/**
 * Event section
 */
$(document).ready(function(){
    EditAction_Event.ready ();
});

class EditAction_Event {
    /**
     * After document is ready
     */
    static ready () {
        
        /**
         * 
         */
        EditAction_Main.setupTabSwitcher ();
    }
    
    /**
     * Switch to editor view
     */
    static onClick_SwitchEditor () {
        $("#article-Edit-TabPreview")
            .hide()
            .css ("z-index", "1");
            
        $("#article-EditorContent")
            .css ( "z-index", "10" )
            .fadeIn (150);
            
        $("#article-Toolbar")
            .css ( "z-index", "10" )
            .fadeIn (150);
    }
    
    /**
     * Switch to preview
     */
    static onClick_SwitchPreview () {
        $("#article-EditorContent")
            .hide()
            .css ("z-index", "1");
            
        $("#article-Toolbar")
            .hide()
            .css ("z-index", "1");
            
        $("#article-Edit-TabPreview")
            .css ( "z-index", "10" )
            .fadeIn (150);
            
        // show markdown from editor as HTML
        var converter = new Showdown.converter();
        $("#article-Edit-TabPreview").html ( 
            converter.makeHtml($("#article-EditorContent").val()) 
        );
    }
}
