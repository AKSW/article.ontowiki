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
    static save (r:string, label:string, content:string, callback:any) {
        var newResourceKey = articleData["insertUpdateInformation"]["namedGraphUri"] + "NewResource/" + articleData["insertUpdateInformation"]["md5Hash"];
        var newResourceTypeUri = articleData["insertUpdateInformation"]["newResourceTypeUri"];
        var contentPropertyUri = articleData["insertUpdateInformation"]["contentPropertyUri"];
        var contentDatatype = articleData["insertUpdateInformation"]["contentDatatype"];
        var insert = {};
        insert [newResourceKey] = {
            "http://www.w3.org/2000/01/rdf-schema#label": [{
                "value": label,
                "type": "literal"
            }]
        };
        
        insert[newResourceKey][newResourceTypeUri] = [{}];
        
        insert[newResourceKey][newResourceTypeUri][0]["value"] =
            articleData["insertUpdateInformation"]["newResourceClassUri"];
        insert[newResourceKey][newResourceTypeUri][0]["type"] = "uri";
        
        
        insert[newResourceKey][contentPropertyUri] = [{}];
        
        insert[newResourceKey][contentPropertyUri][0]["value"] = content;
        insert[newResourceKey][contentPropertyUri][0]["type"] = "literal";
        insert[newResourceKey][contentPropertyUri][0]["datatype"] = contentDatatype;
        
        insert = $.toJSON(insert);
        var namedGraphUri = articleData["insertUpdateInformation"]["namedGraphUri"];
        var url = articleData["insertUpdateInformation"]["serviceUpdateURL"];

        $.ajax({
            url: url,
            data: {
                "named-graph-uri": namedGraphUri,
                "insert": insert
            }
          }
        )
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
