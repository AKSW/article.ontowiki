/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />

class BBEditor {
    
    private css_Button:string;
    private imagePath:string;
    private textareaId:string;
    private toolbarId:string;
    
    /**
     * 
     */
    constructor ( textareaId:string, toolbarId:string, imagePath:string ) {
        this.imagePath = imagePath;
        this.textareaId = textareaId;
        this.toolbarId = toolbarId;
        this.css_Button = "BBEditor_Button";
    }
    
    /**
     * 
     */
    public outputToolbar ( entries:Object[] ) : void {
                
        $("#" + this.toolbarId).html ("");
        
        var img:any = null;
        
        for ( var i in entries ) {
            
            img = $("<img/>");
            img.attr ( "class",     this.css_Button )
               .attr ( "src",       this.imagePath + entries[i]["image"] )
               .attr ( "name",      entries [i]["name"] )
               .attr ( "title",     entries [i]["title"] )
               .attr ( "onclick",   entries [i]["onClick"] );
            
            $("#" + this.toolbarId ).append ( img );
        }
    }
}
