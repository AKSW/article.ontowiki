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
var articleData = articleData || {
};
$(document).ready(function () {
    EditAction_Event.ready();
});
var EditAction_Event = (function () {
    function EditAction_Event() { }
    EditAction_Event.ready = function ready() {
        EditAction_Main.setupTabSwitcher();
    }
    EditAction_Event.onClick_SwitchEditor = function onClick_SwitchEditor() {
        $("#article-Edit-TabPreview").hide().css("z-index", "1");
        $("#article-EditorContent").css("z-index", "10").fadeIn(150);
    }
    EditAction_Event.onClick_SwitchPreview = function onClick_SwitchPreview() {
        $("#article-EditorContent").hide().css("z-index", "1");
        $("#article-Edit-TabPreview").css("z-index", "10").fadeIn(150);
        var converter = new Showdown.converter();
        $("#article-Edit-TabPreview").html(converter.makeHtml($("#article-EditorContent").val()));
    }
    return EditAction_Event;
})();
var EditAction_Main = (function () {
    function EditAction_Main() { }
    EditAction_Main.setupTabSwitcher = function setupTabSwitcher() {
        $("#article-Edit-SwitchEditor").click(EditAction_Event.onClick_SwitchEditor);
        $("#article-Edit-SwitchPreview").click(EditAction_Event.onClick_SwitchPreview);
        $("#article-Edit-TabPreview").hide();
    }
    return EditAction_Main;
})();
