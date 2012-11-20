/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />

class EditAction_Main {
    
    /**
     * 
     */
    static setupTabSwitcher () : void {
        
        $("#article-Edit-SwitchEditorPreview").click (EditAction_Event.onClick_SwitchEditorPreview);
        
        $("#article-Edit-TabPreview").hide();
    }
}
