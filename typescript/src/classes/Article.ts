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
        var oldLabel = articleData["rLabel"];
        var oldDescription = articleData["rDescription"];
        var newResourceTypeUri = articleData["insertUpdateInformation"]["newResourceTypeUri"];
        var contentPropertyUri = articleData["insertUpdateInformation"]["contentPropertyUri"];
        var contentDatatype = articleData["insertUpdateInformation"]["contentDatatype"];
        var resourceLabelUri = articleData["insertUpdateInformation"]["resourceLabelUri"];
        var resourceLabelDataType = articleData["insertUpdateInformation"]["resourceLabelDataType"];
        var resourceLabelLang = articleData["insertUpdateInformation"]["resourceLabelLang"];
        
        var del = {};
        del [newResourceKey] = {};
        
        // label
        del[newResourceKey][resourceLabelUri] = [{}];
        
        del[newResourceKey][resourceLabelUri][0]["value"] = oldLabel;
        del[newResourceKey][resourceLabelUri][0]["type"] = "literal";
        
        if("" != resourceLabelDataType)
            del[newResourceKey][resourceLabelUri][0]["datatype"] = resourceLabelDataType;
        if("" != resourceLabelLang)
            del[newResourceKey][resourceLabelUri][0]["lang"] = resourceLabelLang;
        
        // content
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
        Article.deleteExistingContent (url, namedGraphUri, del);


        /**
         * INSERT
         */        

        // Label
        var insert = {};
        insert[newResourceKey] = {};
        
        insert[newResourceKey][resourceLabelUri] = [{}];
        
        insert[newResourceKey][resourceLabelUri][0]["value"] = label;
        insert[newResourceKey][resourceLabelUri][0]["type"] = "literal";        
        insert[newResourceKey][resourceLabelUri][0]["datatype"] = resourceLabelDataType;
        insert[newResourceKey][resourceLabelUri][0]["lang"] = resourceLabelLang;
        
        // Type
        insert[newResourceKey][newResourceTypeUri] = [{}];
        
        insert[newResourceKey][newResourceTypeUri][0]["value"] =
            articleData["insertUpdateInformation"]["newResourceClassUri"];
        insert[newResourceKey][newResourceTypeUri][0]["type"] = "uri";
        
        
        // Content
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
        })
        .done( function (entries) {
            callbackOnSuccess (entries);
        });
        
        // save new old data
        articleData ["rLabel"] = label;
        articleData ["rDescription"] = content;
    }
    
    /**
     * 
     */
    static deleteExistingContent (url:string, namedGraphUri, delObj) {
        $.ajax({
            url: url,
            data: {
                "named-graph-uri": namedGraphUri,
                "delete": delObj
            }
          }
        )
        .error( function (xhr, ajaxOptions, thrownError) {
            System.out ( "Article > save > error" );
            System.out ( "response text: " + xhr.responseText );
            System.out ( "error: " + thrownError );
        })
        .done( function (entries) {
        });
    }
}
