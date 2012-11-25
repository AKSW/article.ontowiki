/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />

class Article {
    
    /**
     * 
     */
    constructor () {
    }
    
    /**
     * Save content for given resource
     */
    static save (r:string, content:string, callback:any) {
        $.ajax({
            url: articleData["articleUrl"] + "savearticle/",
            data: {
                "r": r,
                "content": content
            }
        })
        .error( function (xhr, ajaxOptions, thrownError) {
            System.out ( "Article > save > error" );
            System.out ( "response text: " + xhr.responseText );
            System.out ( "error: " + thrownError );
        })
        .done( function (entries) { 
            callback (entries);
        });
    }
}
