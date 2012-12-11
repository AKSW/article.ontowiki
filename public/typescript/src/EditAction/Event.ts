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
         * 
         */
        $("#article-SaveBtn").click (EditAction_Event.onClick_SaveBtn);
        
        /**
         * 
         */
        $("#article-EditorContent").html (articleData["rDescription"]);
        
        /**
         * Render markdown if something exists
         */
        var converter = new Showdown.converter();
        $("#article-Edit-TabPreview").html (
            converter.makeHtml($("#article-EditorContent").html()) 
        );
        
        $('#article-EditorContent').bind('input propertychange', function() {
            var converter = new Showdown.converter();
            $("#article-Edit-TabPreview")
                .html (converter.makeHtml($(this).val()));
        });
    }

    /**
     * 
     */
    static onClick_SaveBtn () : void {
        Article.save (
            articleData ["r"],
            $("#article-label-field").val(),
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
