/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />

class EditAction_Main {
    
    /**
     * 
     */
    static setupTabSwitcher () : void {
        
        $("#article-Edit-SwitchEditor").click (EditAction_Event.onClick_SwitchEditor);
        
        $("#article-Edit-SwitchPreview").click (EditAction_Event.onClick_SwitchPreview);
        
        $("#article-Edit-TabPreview").hide();
    }
}
