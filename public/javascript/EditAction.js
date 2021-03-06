var System = (function () {
    function System() { }
    System.contains = function contains(haystack, needle) {
        return -1 === System.strpos(haystack, needle) ? false : true;
    }
    System.countProperties = function countProperties(obj) {
        var keyCount = 0;
        var k = null;

        for(k in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, k)) {
                ++keyCount;
            }
        }
        return keyCount;
    }
    System.deepCopy = function deepCopy(elementToCopy) {
        var newElement = $.parseJSON(JSON.stringify(elementToCopy));
        return newElement;
    }
    System.out = function out(output) {
        if(typeof console !== "undefined" && typeof console.log !== "undefined") {
            if($.browser && $.browser.msie) {
                if("object" != typeof output && "array" != typeof output) {
                    console.log(output);
                } else {
                    console.log(" ");
                    var val = null;
                    for(var i in output) {
                        val = output[i];
                        if("object" == typeof val) {
                            console.log(" ");
                            console.log("subobject");
                            System.out(val);
                        } else {
                            console.log(i + ": " + val);
                        }
                    }
                    ; ;
                }
            } else {
                console.log(output);
            }
        }
    }
    System.setObjectProperty = function setObjectProperty(obj, key, separator, value) {
        var keyList = key.split(separator);
        var call = "obj ";

        for(var i in keyList) {
            call += '["' + keyList[i] + '"]';
            eval(call + " = " + call + " || {};");
        }
        eval(call + " = value;");
    }
    System.setSelectionRange = function setSelectionRange(input, selectionStart, selectionEnd) {
        if(input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        } else {
            if(input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        }
    }
    System.setupAjax = function setupAjax() {
        $.ajaxSetup({
            "async": true,
            "cache": false
        });
        $.support.cors = true;
    }
    System.strpos = function strpos(haystack, needle) {
        return (haystack + '').indexOf(needle, 0);
    }
    System.toType = function toType(ele) {
        return ({
        }).toString.call(ele).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }
    return System;
})();
var Article = (function () {
    function Article() {
    }
    Article.save = function save(r, label, content, callbackOnSuccess, callbackOnError) {
        var newResourceKey = articleData["r"];
        var oldLabel = articleData["rLabel"];
        var oldDescription = articleData["rDescription"];
        var newResourceTypeUri = articleData["insertUpdateInformation"]["newResourceTypeUri"];
        var contentPropertyUri = articleData["insertUpdateInformation"]["contentPropertyUri"];
        var contentDatatype = articleData["insertUpdateInformation"]["contentDatatype"];
        var resourceLabelUri = articleData["insertUpdateInformation"]["resourceLabelUri"];
        var resourceLabelDataType = articleData["insertUpdateInformation"]["resourceLabelDataType"];
        var resourceLabelLang = articleData["insertUpdateInformation"]["resourceLabelLang"];
        var del = {
        };
        del[newResourceKey] = {
        };
        del[newResourceKey][resourceLabelUri] = [
            {
            }
        ];
        del[newResourceKey][resourceLabelUri][0]["value"] = oldLabel;
        del[newResourceKey][resourceLabelUri][0]["type"] = "literal";
        if("" != resourceLabelDataType) {
            del[newResourceKey][resourceLabelUri][0]["datatype"] = resourceLabelDataType;
        }
        if("" != resourceLabelLang) {
            del[newResourceKey][resourceLabelUri][0]["lang"] = resourceLabelLang;
        }
        del[newResourceKey][contentPropertyUri] = [
            {
            }
        ];
        del[newResourceKey][contentPropertyUri][0]["value"] = oldDescription;
        del[newResourceKey][contentPropertyUri][0]["type"] = "literal";
        del[newResourceKey][contentPropertyUri][0]["datatype"] = contentDatatype;
        del = $.toJSON(del);
        var namedGraphUri = articleData["insertUpdateInformation"]["namedGraphUri"];
        var url = articleData["insertUpdateInformation"]["serviceUpdateURL"];
        Article.deleteExistingContent(url, namedGraphUri, del);
        var insert = {
        };
        insert[newResourceKey] = {
        };
        insert[newResourceKey][resourceLabelUri] = [
            {
            }
        ];
        insert[newResourceKey][resourceLabelUri][0]["value"] = label;
        insert[newResourceKey][resourceLabelUri][0]["type"] = "literal";
        insert[newResourceKey][resourceLabelUri][0]["datatype"] = resourceLabelDataType;
        insert[newResourceKey][resourceLabelUri][0]["lang"] = resourceLabelLang;
        insert[newResourceKey][newResourceTypeUri] = [
            {
            }
        ];
        insert[newResourceKey][newResourceTypeUri][0]["value"] = articleData["insertUpdateInformation"]["newResourceClassUri"];
        insert[newResourceKey][newResourceTypeUri][0]["type"] = "uri";
        insert[newResourceKey][contentPropertyUri] = [
            {
            }
        ];
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
        }).error(function (xhr, ajaxOptions, thrownError) {
            System.out("Article > save > error");
            System.out("response text: " + xhr.responseText);
            System.out("error: " + thrownError);
        }).done(function (entries) {
            callbackOnSuccess(entries);
        });
        articleData["rLabel"] = label;
        articleData["rDescription"] = content;
    }
    Article.deleteExistingContent = function deleteExistingContent(url, namedGraphUri, delObj) {
        $.ajax({
            url: url,
            data: {
                "named-graph-uri": namedGraphUri,
                "delete": delObj
            }
        }).error(function (xhr, ajaxOptions, thrownError) {
            System.out("Article > save > error");
            System.out("response text: " + xhr.responseText);
            System.out("error: " + thrownError);
        }).done(function (entries) {
        });
    }
    return Article;
})();
var articleData = articleData || {
};
articleData["_showEditorOrPreview"] = "preview";
articleData["_article-EditorContent"] = "";
var BBEditor_Main = BBEditor_Main || {
};
$(document).ready(function () {
    EditAction_Event.ready();
});
var EditAction_Event = (function () {
    function EditAction_Event() { }
    EditAction_Event.ready = function ready() {
        System.setupAjax();
        $("#article-Edit-SaveBtn").unbind();
        $("#article-Edit-SaveBtn").click(EditAction_Event.onClick_SaveBtn);
        $("#article-Edit-EditorContent").html(articleData["rDescription"]);
        var converter = new Showdown.converter();
        $("#article-Edit-TabPreview").html(converter.makeHtml($("#article-Edit-EditorContent").val()));
        $('#article-Edit-EditorContent').bind('input propertychange', function () {
            var converter = new Showdown.converter();
            $("#article-Edit-TabPreview").html(converter.makeHtml($(this).val()));
        });
    }
    EditAction_Event.onClick_SaveBtn = function onClick_SaveBtn() {
        Article.save(articleData["r"], $("#article-Edit-LabelField").val(), $("#article-Edit-EditorContent").val(), EditAction_Event.onComplete_SavingArticleSuccessfully, EditAction_Event.onComplete_SavingArticleNotPossible);
    }
    EditAction_Event.onComplete_SavingArticleSuccessfully = function onComplete_SavingArticleSuccessfully(entries) {
        $("#article-Edit-SavingSuccessNotif").fadeIn(300).delay(1000).fadeOut(500);
    }
    EditAction_Event.onComplete_SavingArticleNotPossible = function onComplete_SavingArticleNotPossible(errorMessage) {
        $("#article-Edit-SavingNotPossibleNotif").append(" " + errorMessage).fadeIn(500);
    }
    return EditAction_Event;
})();
var EditAction_Main = (function () {
    function EditAction_Main() { }
    return EditAction_Main;
})();
