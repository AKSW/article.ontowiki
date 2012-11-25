/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />
/// <reference path="..\DeclarationSourceFiles\showdown.d.ts" />

/**
 * Make variables accessible for TypeScript
 */
var articleData = articleData || {};

articleData ["_showEditorOrPreview"] = "preview"; 
articleData ["_article-EditorContent"] = ""; 

var BBEditor_Main = BBEditor_Main || {};

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
        
        /**
         * 
         */
        $("#article-EditorContent").html (articleData["rDescription"]);
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
            
            /**
             * 
             */
            BBEditor_Main.initializeBBEditor (
                articleData ["BBEditor"]["textareaId"],
                articleData ["BBEditor"]["toolbarId"],
                articleData ["imagesPath"],
                articleData ["BBEditor"]["toolbarEntries"]
            );
        
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
    static onClick_SaveBtn () : void {
        Article.save (
            articleData ["r"],
            $("#article-EditorContent").val(),
            EditAction_Event.onComplete_SaveArticle
        );
    }
    
    /**
     * 
     */
    static onComplete_SaveArticle (entries:string) : void {
        $("#article-Edit-SavingSuccessNotif")
            .fadeIn ( 300 )
            .delay ( 1000 )
            .fadeOut ( 500 );
    }
}
