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
    static save(r:string, label:string, content:string, callbackOnSuccess:any, callbackOnError:any) {
        $.ajax({
            url: articleData["articleUrl"] + "savearticle/",
            data: {
                "r": r,
                "label": label,
                "content": content
            }
        })
        .error( function (xhr, ajaxOptions, thrownError) {
            System.out ( "Article > save > error" );
            System.out ( "response text: " + xhr.responseText );
            System.out ( "error: " + thrownError );
            callbackOnError(xhr.responseText);
        })
        .done( function (entries) {
            callbackOnSuccess (entries);
        });
    }
}
