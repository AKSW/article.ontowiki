/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />
/// <reference path="..\DeclarationSourceFiles\showdown.d.ts" />

/**
 * Make variables accessible for TypeScript
 */
var articleData = articleData || {};

articleData ["_showEditorOrPreview"] = "editor"; 

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
     * Switch between editor and preview view
     */
    static onClick_SwitchEditorPreview () {
        
        /**
         * Switch to preview
         */
        if("preview" == articleData["_showEditorOrPreview"]){
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
            
            $("#article-Edit-SwitchEditorPreview")
                .attr ("src", articleData ["imagesPath"] + "previewBtn.png");
            
            articleData["_showEditorOrPreview"] = "editor";
            
        /**
         * Switch to editor
         */
        } else { // = editor
        
            $("#article-Edit-TabPreview")
                .hide()
                .css ("z-index", "1");
                
            $("#article-EditorContent")
                .css ( "z-index", "10" )
                .fadeIn (150);
                
            $("#article-Toolbar")
                .css ( "z-index", "10" )
                .fadeIn (150);
                
            $("#article-Edit-SwitchEditorPreview")
                .attr ("src", articleData ["imagesPath"] + "editorBtn.png");
                
            articleData["_showEditorOrPreview"] = "preview";
        }
    }
}
