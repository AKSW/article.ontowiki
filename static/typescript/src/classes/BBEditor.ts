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
     * Based on given entries it will build the editor toolbar
     */
    public outputToolbar ( entries:Object[] ) : void {
                
        $("#" + this.toolbarId).html ("");
        
        var img:any = null;
        
        for ( var i in entries ) {
            
            img = $("<img/>");
            img.attr ( "class",     this.css_Button )
               .attr ( "src",       this.imagePath + entries[i]["image"] )
               .attr ( "name",      entries [i]["name"] )
               .attr ( "title",     entries [i]["title"] );
               
            this.setToolbarItemClickEvent ( img, entries[i]["type"] );
            
            $("#" + this.toolbarId ).append ( img );
        }
    }
    
    /**
     * 
     */
    public setToolbarItemClickEvent ( img:any, type:string ) : void {
        
        var clickedFunction = function(){},
            defaultText = "", openingTag:string = "", closingTag:string = "",
            textareaId = this.textareaId;
        
        /**
         * if you have surrounding tags
         */
        if(-1 != $.inArray (type, ["bold", "italic", "bolditalic", "codeLine", "codeBlock"])) {
                
            // set opening and closing tag based on given type
            switch ( type ) {
                case "bold":
                    openingTag = "**"; 
                    defaultText = "bold text";
                    closingTag = "**"; 
                    break;
                    
                case "italic":
                    openingTag = "*"; 
                    defaultText = "italic text";
                    closingTag = "*"; 
                    break;
                
                case "codeLine":
                    openingTag = "`"; 
                    defaultText = "code line"; 
                    closingTag = "`"; 
                    break;
                    
                case "codeBlock":
                    openingTag = "\n```"; 
                    defaultText = "\n code block \n"; 
                    closingTag = "```\n"; 
                    break;
                
                default: System.out ( "Type not valid!\n" + type );
            }
            
            /**
             * Define function
             */
            clickedFunction = function() {
            
                var textarea = $("#" + textareaId);
                
                // save whole length of textarea content
                var len = textarea.val ().toString(); len = len ["length"];
                
                // save start and end position of selected text
                var start = textarea[0]["selectionStart"];
                var end = textarea[0]["selectionEnd"];
                
                // save current scroll position
                var scrollTop = textarea.scrollTop();
                var scrollLeft = textarea.scrollLeft();
                
                // save selected text
                var sel:string = textarea.val ().toString().substring(start, end);
                
                if ( undefined == sel || "" == sel ) {
                    sel = defaultText;
                } 
        
                // put opening and closing tags around selected text
                var rep = openingTag + sel + closingTag;
                
                // integrate tags + selected text into existing textfield content
                textarea.val ( 
                    textarea.val ().toString().substring(0,start) 
                    + rep 
                    + textarea.val ().toString().substring(end,len) 
                );
                
                // scroll back to saved position
                textarea[0]["scrollTop"] = scrollTop;
                textarea[0]["scrollLeft"] = scrollLeft;
            };
        } 
        
        /**
         * If you have only a simple tag to include
         */
        else if (-1 != $.inArray (type, ["list", "h1", "h2", "h3", "h4"])) {
            
            // set opening and closing tag based on given type
            switch ( type ) {                
                case "list":
                    openingTag = "\n* "; 
                    break;
                
                case "h1":
                    openingTag = "# "; 
                    break;
                
                case "h2":
                    openingTag = "## "; 
                    break;
                
                case "h3":
                    openingTag = "### "; 
                    break;
                    
                case "h4":
                    openingTag = "#### "; 
                    break;
                
                case "quote":
                    openingTag = "> "; 
                    break;
                
                default: System.out ( "Type not valid!\n" + type );
            }
            
            /**
             * Define function
             */
            clickedFunction = function() {
            
                var textarea = $("#" + textareaId);
                
                // save current scroll position
                var scrollTop = textarea.scrollTop(), scrollLeft = textarea.scrollLeft();
                
                // integrate tags + selected text into existing textfield content
                textarea.val ( textarea.val () + openingTag );
                
                // save length of textarea content
                var len = textarea.val ().toString(); len = len ["length"];
                                
                // scroll back to saved position
                textarea[0]["scrollTop"] = scrollTop;
                textarea[0]["scrollLeft"] = scrollLeft;
                
                // Set cursor to the last position
                System.setSelectionRange ( document.getElementById(textareaId), len, len );
            };
        }
        
        // set click event function
        img.click(clickedFunction);
    }
}
