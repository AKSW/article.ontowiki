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
var BBEditor = (function () {
    function BBEditor(textareaId, toolbarId, imagePath) {
        this.imagePath = imagePath;
        this.textareaId = textareaId;
        this.toolbarId = toolbarId;
        this.css_Button = "BBEditor_Button";
    }
    BBEditor.prototype.outputToolbar = function (entries) {
        $("#" + this.toolbarId).html("");
        var img = null;
        for(var i in entries) {
            img = $("<img/>");
            img.attr("class", this.css_Button).attr("src", this.imagePath + entries[i]["image"]).attr("name", entries[i]["name"]).attr("title", entries[i]["title"]).attr("onclick", entries[i]["onClick"]);
            $("#" + this.toolbarId).append(img);
        }
    };
    return BBEditor;
})();
var articleData = articleData || {
};
$(document).ready(function () {
    BBEditor_Event.ready();
});
var BBEditor_Event = (function () {
    function BBEditor_Event() { }
    BBEditor_Event.ready = function ready() {
        BBEditor_Main.initializeBBEditor(articleData["BBEditor"]["textareaId"], articleData["BBEditor"]["toolbarId"], articleData["imagesPath"], articleData["BBEditor"]["toolbarEntries"]);
    }
    return BBEditor_Event;
})();
var BBEditor_Main = (function () {
    function BBEditor_Main() { }
    BBEditor_Main.initializeBBEditor = function initializeBBEditor(textareaId, toolbarId, imagePath, entries) {
        var bbe = new BBEditor(textareaId, toolbarId, imagePath);
        bbe.outputToolbar(entries);
    }
    return BBEditor_Main;
})();
