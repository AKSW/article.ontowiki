/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />
/// <reference path="..\DeclarationSourceFiles\JSON.d.ts" />

class System {
    
    static contains (haystack:string, needle:string) : bool {
        return -1 === System.strpos ( haystack, needle )
            ? false : true;
    }
    
    /**
     * Counts number of an given object.
     */
    static countProperties ( obj:Object ) : number {
        var keyCount = 0, k = null;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                ++keyCount;
            }
        }
        return keyCount;
    }
    
    /**
     * Copy an given element, but renew the reference so there is no connection to the old one.
     */
    static deepCopy ( elementToCopy : any ) : any {
        var newElement = $.parseJSON ( JSON.stringify ( elementToCopy ) );
        return newElement;
    }
    
    /**
     * Outputs only if context is "development"
     * Should prevent you running into errors if browser doesnt support console.log
     */
    static out ( output: any ) : void {
        if ( typeof console !== "undefined" && typeof console.log !== "undefined" ) {
            
            // If your browser is IE, ...
            if( $.browser && $.browser.msie) {
                
                // output non-object directly
                if ( "object" != typeof output && "array" != typeof output ) {
                    console.log ( output );
                    
                // output objects property by property
                } else {
                    console.log ( " " );
                    var val = null;                    
                    for ( var i in output ) {
                        val = output[i];
                        if ( "object" == typeof val ) {
                            console.log ( " " );
                            console.log ( "subobject" );
                            System.out ( val );
                        } else {
                            console.log ( i + ": " + val );
                        }
                    };
                }
            
            // If your browser a modern one simply output
            } else {
                console.log ( output );
            }
        }
    }
    
    /**
     * Split a given key into units, build a chain and set the given value.
     * For instance: key=foo.bar.foobar will be transformed and evaled as obj[foo][bar][foobar] = value;
     */
    static setObjectProperty ( obj:Object, key:string, separator:string, value:any ) : void {
        var keyList = key.split ( separator ),
            call = "obj ";
        for ( var i in keyList ) {
            call += '["' + keyList [i] + '"]';
            eval ( call + " = " + call + " || {};" );
        }
        eval ( call + " = value;" ); 
    }
    
    /**
     * Copied from http://stackoverflow.com/a/499158
     */
    static setSelectionRange(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }
    
    /**
     * Setup AJAX to save paperwork later on
     */
    static setupAjax () : void {
        $.ajaxSetup({
            "async": true,
            "cache": false
        });
        
        $.support.cors = true;
    }
    
    /**
     * Copied from http://phpjs.org/functions/strpos
     */
    static strpos (haystack:string, needle:string) : number {
        return (haystack + '').indexOf (needle, 0);
    }
    
    /**
     * Copied from http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
     * 
     * Has return for following parameters:
            ## Parameter ##                         ## Returns ## 
            Undefined	                            undefined
            Array	                                array
            Null	                                object
            Boolean	                                boolean
            Number	                                number
            String	                                string
            Object (native and not callable)	    object
            Object (native or host and callable)	function
            Object (host and not callable)	        Implementation-defined
     */
    static toType( ele ) {
        return ({}).toString.call(ele).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }
}
