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
            "cache": false,
            "crossDomain": true,
            "dataType": "json",
            "type": "POST"
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
    Article.save = function save(r, content) {
        $.ajax({
            url: articleData["articleUrl"] + "savearticle/",
            data: {
                "r": r,
                "content": content
            }
        }).error(function (xhr, ajaxOptions, thrownError) {
            System.out("Article > save > error");
            System.out("response text: " + xhr.responseText);
            System.out("error: " + thrownError);
        }).done(function (entries) {
            console.log(entries);
        });
    }
    return Article;
})();
var articleData = articleData || {
};
articleData["_showEditorOrPreview"] = "preview";
articleData["_article-EditorContent"] = "";
$(document).ready(function () {
    EditAction_Event.ready();
});
var EditAction_Event = (function () {
    function EditAction_Event() { }
    EditAction_Event.ready = function ready() {
        System.setupAjax();
        EditAction_Main.setupTabSwitcher();
        $("#article-SaveBtn").click(EditAction_Event.onClick_SaveBtn);
    }
    EditAction_Event.onClick_SwitchEditorPreview = function onClick_SwitchEditorPreview() {
        if("preview" == articleData["_showEditorOrPreview"]) {
            var converter = new Showdown.converter();
            articleData["_article-EditorContent"] = $("#article-EditorContent").val();
            $("#article-Edit-SwitchEditorPreview").attr("src", articleData["imagesPath"] + "editorBtn.png");
            $("#article-invisibleContainer").html("").append($("#article-visibleContainer").html());
            $("#article-visibleContainer").html("").append($("<div id=\"article-Edit-TabPreview\"></div>"));
            $("#article-Edit-TabPreview").html(converter.makeHtml(articleData["_article-EditorContent"]));
            $("#article-Edit-TabPreview").fadeIn(150);
            articleData["_showEditorOrPreview"] = "editor";
        } else {
            $("#article-visibleContainer").html("").append($("#article-invisibleContainer").html());
            $("#article-EditorContent").html(articleData["_article-EditorContent"]);
            $("#article-EditorContent").fadeIn(150);
            $("#article-Toolbar").fadeIn(150);
            $("#article-Edit-SwitchEditorPreview").attr("src", articleData["imagesPath"] + "previewBtn.png");
            articleData["_showEditorOrPreview"] = "preview";
        }
    }
    EditAction_Event.onClick_SaveBtn = function onClick_SaveBtn() {
        Article.save(articleData["r"], $("#article-EditorContent").val());
    }
    return EditAction_Event;
})();
var EditAction_Main = (function () {
    function EditAction_Main() { }
    EditAction_Main.setupTabSwitcher = function setupTabSwitcher() {
        $("#article-Edit-SwitchEditorPreview").click(EditAction_Event.onClick_SwitchEditorPreview);
    }
    return EditAction_Main;
})();
