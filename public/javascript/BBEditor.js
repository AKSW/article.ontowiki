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
var BBEditor = (function () {
    function BBEditor(textareaId, toolbarId, imagePath) {
        this.imagePath = imagePath;
        this.textareaId = textareaId;
        this.toolbarId = toolbarId;
        this.css_Button = "article-BBEditorButton";
    }
    BBEditor.prototype.outputToolbar = function (entries) {
        $("#" + this.toolbarId).html("");
        var img = null;
        for(var i in entries) {
            img = $("<img/>");
            img.attr("class", this.css_Button).attr("src", this.imagePath + entries[i]["image"]).attr("name", entries[i]["name"]).attr("title", entries[i]["title"]);
            this.setToolbarItemClickEvent(img, entries[i]["type"]);
            $("#" + this.toolbarId).append(img);
        }
    };
    BBEditor.prototype.setToolbarItemClickEvent = function (img, type) {
        var clickedFunction = function () {
        };
        var defaultText = "";
        var openingTag = "";
        var closingTag = "";
        var textareaId = this.textareaId;

        if(-1 != $.inArray(type, [
            "bold", 
            "italic", 
            "bolditalic", 
            "codeLine", 
            "codeBlock"
        ])) {
            switch(type) {
                case "bold": {
                    openingTag = "**";
                    defaultText = "bold text";
                    closingTag = "**";
                    break;

                }
                case "italic": {
                    openingTag = "*";
                    defaultText = "italic text";
                    closingTag = "*";
                    break;

                }
                case "codeLine": {
                    openingTag = "`";
                    defaultText = "code line";
                    closingTag = "`";
                    break;

                }
                case "codeBlock": {
                    openingTag = "\n```";
                    defaultText = "\n code block \n";
                    closingTag = "```\n";
                    break;

                }
                default: {
                    System.out("Type not valid!\n" + type);

                }
            }
            clickedFunction = function () {
                var textarea = $("#" + textareaId);
                var len = textarea.val().toString();
                len = len["length"];
                var start = textarea[0]["selectionStart"];
                var end = textarea[0]["selectionEnd"];
                var scrollTop = textarea.scrollTop();
                var scrollLeft = textarea.scrollLeft();
                var sel = textarea.val().toString().substring(start, end);
                if(undefined == sel || "" == sel) {
                    sel = defaultText;
                }
                var rep = openingTag + sel + closingTag;
                textarea.val(textarea.val().toString().substring(0, start) + rep + textarea.val().toString().substring(end, len));
                textarea[0]["scrollTop"] = scrollTop;
                textarea[0]["scrollLeft"] = scrollLeft;
            };
        } else {
            if(-1 != $.inArray(type, [
                "list", 
                "quote", 
                "h1", 
                "h2", 
                "h3", 
                "h4"
            ])) {
                switch(type) {
                    case "list": {
                        openingTag = "\n* ";
                        break;

                    }
                    case "h1": {
                        openingTag = "\n\n# ";
                        break;

                    }
                    case "h2": {
                        openingTag = "\n\n## ";
                        break;

                    }
                    case "h3": {
                        openingTag = "\n\n### ";
                        break;

                    }
                    case "h4": {
                        openingTag = "\n\n#### ";
                        break;

                    }
                    case "quote": {
                        openingTag = "\n\n> ";
                        break;

                    }
                    default: {
                        System.out("Type not valid!\n" + type);

                    }
                }
                clickedFunction = function () {
                    var textarea = $("#" + textareaId);
                    var scrollTop = textarea.scrollTop();
                    var scrollLeft = textarea.scrollLeft();

                    textarea.val(textarea.val() + openingTag);
                    var len = textarea.val().toString();
                    len = len["length"];
                    textarea[0]["scrollTop"] = scrollTop;
                    textarea[0]["scrollLeft"] = scrollLeft;
                    System.setSelectionRange(document.getElementById(textareaId), len, len);
                };
            }
        }
        img.click(clickedFunction);
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
        BBEditor_Main.initializeBBEditor(articleData["BBEditor"]["textareaId"], articleData["BBEditor"]["toolbarId"], articleData["articleImagesUrl"], articleData["BBEditor"]["toolbarEntries"]);
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
