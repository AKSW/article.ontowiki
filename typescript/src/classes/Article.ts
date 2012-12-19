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
    static save (r:string, label:string, content:string, callbackOnSuccess:any, callbackOnError:any) {
        var newResourceKey = articleData["r"];
        var oldDescription = articleData["rDescription"];
        var newResourceTypeUri = articleData["insertUpdateInformation"]["newResourceTypeUri"];
        var contentPropertyUri = articleData["insertUpdateInformation"]["contentPropertyUri"];
        var contentDatatype = articleData["insertUpdateInformation"]["contentDatatype"];
        
        var del = {};
        del [newResourceKey] = {};
        
        del[newResourceKey][contentPropertyUri] = [{}];
        
        del[newResourceKey][contentPropertyUri][0]["value"] = oldDescription;
        del[newResourceKey][contentPropertyUri][0]["type"] = "literal";
        del[newResourceKey][contentPropertyUri][0]["datatype"] = contentDatatype;
        
        del = $.toJSON(del);
        var namedGraphUri = articleData["insertUpdateInformation"]["namedGraphUri"];
        var url = articleData["insertUpdateInformation"]["serviceUpdateURL"];

        /**
         * DELETE
         */
        $.ajax({
            url: url,
            data: {
                "named-graph-uri": namedGraphUri,
                "delete": del
            }
          }
        )
        .error( function (xhr, ajaxOptions, thrownError) {
            System.out ( "Article > save > error" );
            System.out ( "response text: " + xhr.responseText );
            System.out ( "error: " + thrownError );
            // callbackOnError(xhr.responseText);
        })
        .done( function (entries) {
            console.log ("delete ");
            console.log (entries);
            // callbackOnSuccess (entries);
        });



        /**
         * INSERT
         */        
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
