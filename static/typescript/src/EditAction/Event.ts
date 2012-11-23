/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />
/// <reference path="..\DeclarationSourceFiles\showdown.d.ts" />

/**
 * Make variables accessible for TypeScript
 */
var articleData = articleData || {};

articleData ["_showEditorOrPreview"] = "preview"; 
articleData ["_article-EditorContent"] = ""; 

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
         * Set standard values for ajax related stuff.
         */
        System.setupAjax ();
        
        /**
         * Switcher between editor and preview
         */
        EditAction_Main.setupTabSwitcher ();
        
        /**
         * 
         */
        $("#article-SaveBtn").click (EditAction_Event.onClick_SaveBtn);
    }
    
    /**
     * Switch between editor and preview view
     */
    static onClick_SwitchEditorPreview () {
                
        /**
         * Switch to preview
         */
        if("preview" == articleData["_showEditorOrPreview"]){
            
            // show markdown from editor as HTML
            var converter = new Showdown.converter();
            articleData ["_article-EditorContent"] = $("#article-EditorContent").val();    
            
            $("#article-Edit-SwitchEditorPreview")
                .attr ("src", articleData ["imagesPath"] + "editorBtn.png");
            
            $("#article-invisibleContainer")
                .html ("")
                .append ($("#article-visibleContainer").html());
            
            $("#article-visibleContainer")
                .html ("")
                .append ( $("<div id=\"article-Edit-TabPreview\"></div>") );
            
            $("#article-Edit-TabPreview").html ( 
                converter.makeHtml(articleData ["_article-EditorContent"]) 
            );
            
            $("#article-Edit-TabPreview") 
                .fadeIn ( 150 );
            
            articleData["_showEditorOrPreview"] = "editor";
            
        /**
         * Switch to editor
         */
        } else { // = editor
        
            $("#article-visibleContainer")
                .html ("")
                .append ( $("#article-invisibleContainer").html() );
                
            $("#article-EditorContent").html ( articleData ["_article-EditorContent"] );
        
            $("#article-EditorContent")
                .fadeIn (150);
                
            $("#article-Toolbar")
                .fadeIn (150);
                
            $("#article-Edit-SwitchEditorPreview")
                .attr ("src", articleData ["imagesPath"] + "previewBtn.png");
                
            articleData["_showEditorOrPreview"] = "preview";
        }
    }

    /**
     * 
     */
    static onClick_SaveBtn () {
        Article.save (
            articleData ["r"],
            $("#article-EditorContent").val()
        );
    }
}
