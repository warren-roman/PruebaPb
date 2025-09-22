const hexString = "0123456789ABCDEF";
function utf8_to_b64(str) { return window.btoa(decodeURI(encodeURIComponent(str))); }
function b64_to_utf8(str) { return decodeURIComponent(encodeURI(window.atob(str))); }
function Rnd() {
    var a = arguments, r = Math.random();
    var m = a[0];
    switch (a.length) {
        case 0: return r; // random decimal
        case 1:
            if (typeof (m) === "string" || m instanceof Array) return m[Rnd(m.length - 1)]; // random in array
            return Math.floor(r * (m + 1)); // random max value
        default: var d = a[1] - m + 1; return Math.floor(r * d) + m;// random between
    }
}
function newGuid() {
    var a = arguments, response = "", l = [8, 4, 4, 4, 12], s = 0;
    var m = a[0];
    switch (a.length) {
        case 0: m = "";
        case 1:
            if (typeof (m) === "number") l = [m];
            break;
        default:
            if (typeof (m) !== "number") s = 1;
            l = arguments;
    }
    for (var idx = s; idx < l.length; idx++) {
        if (idx != s) response += m;
        for (var itm = 0; itm < l[idx]; itm++) { response += Rnd(hexString); }
    }
    return response;
}

function _qs() { return document.querySelector.apply(document, arguments); }
function _qsa() { return document.querySelectorAll.apply(document, arguments); }

HTMLElement.prototype.qs = function () { return this.querySelector.apply(this, arguments); };
HTMLElement.prototype.qsa = function () { return this.querySelectorAll.apply(this, arguments); };
HTMLElement.prototype.cs = function () { return this.closest.apply(this, arguments); };

HTMLElement.prototype.setValue = function (value) { this.setAttribute("value", value); };
HTMLSelectElement.prototype.setValue = function (value) {
    var items = [...this.childNodes];
    this.setAttribute("value", value);
    this.selectedIndex = items.findIndex(i => i.value == value);
};

function isInputElement(element) {
    for (var wCCiE of [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement]) {
        if (element instanceof wCCiE) return true;
    }
    return false;
}
function isPrimitive(value) { return (typeof (value) === "string" || typeof (value) === "number" || typeof (value) === "boolean"); }

function isLabelOnRightSide(element) {
    if (element.tagName != "INPUT") return false;
    var type = element.getAttribute("type");
    if (type == "checkbox" || type == "radio") return true;
    return false;
}

const defaultTagName = "div";
function _(tag, content) {
    tag = typeof (tag) === "string" ? tag : defaultTagName;
    var tagData = tag.split(".");
    var tagName = tagData[0] ? tagData[0] : defaultTagName;
    var result = document.createElement(tagName);
    for (var classIndex = 1; classIndex < tagData.length; classIndex++) {
        var className = tagData[classIndex];
        if (classIndex = tagData.length - 1) {
            var propertiesData = className.split(";");
            className = className[0];
            for (var propertyIndex = 1; propertyIndex < propertiesData.length; propertyIndex++) {
                var propertyData = propertiesData[propertyIndex].split("=");
                var name = propertyData[0];
                var value = propertyData[1];
                if (name === "text" || name === "textContent") result.innerText = value;
                else if (name === "htm" || name === "html") result.innerHTML = value;
                else if (result.tagName != "LABEL" && (name === "label" || name === "lbl")) result.labelElement = _("label", value);
                else if (name == "value" && isInputElement(result)) result.setValue(value);
                else result.setAttribute(name, value);
            }
        }
        if (!className) continue;
        result.classList.add(className);
    }
    for (var index = 1; index < arguments.length; index++) {
        result._(arguments[index]);
    }
    if (result.labelElement) {
        var id = null;
        if (!result.hasAttribute("id") && !result.hasAttribute("name")) {
            result.setAttribute("id", id = newGuid());
        } else {
            id = result.getAttribute("id") || result.getAttribute("name");
        }
        result.labelElement.setAttribute("for", id);
        var rSide = isLabelOnRightSide(result);
        return rSide ? [result, result.labelElement] : [result.labelElement, result];
    }
    return result;
}

HTMLElement.prototype.__ = function (tag, content) { this._(_(tag, content)); }
HTMLElement.prototype._ = function (content) {
    var $this = this;
    for (let content of arguments) {
        if (content instanceof Array) {
            for(var item of content) { $this._(item); }
        } else if (content instanceof HTMLElement) {
            $this.appendChild(content);
        } else if (isPrimitive(content)) {
            if (isInputElement($this)) $this.setValue(content);
            //else if ($this.tagName == "SELECT") console.log([...$this.childNodes]); // $this.selectedIndex = 9;
            else $this.innerHTML = content;
        } else if (typeof (content) === "object" && content) {
            for (var key in content) {
                var value = content[key];
                if (typeof(value) === "function") $this.addEventListener(key, value);
                else if (key == "value" && isInputElement($this)) $this.setValue(content);
                else $this.setAttribute(key, value);
            }
        } else if (content === null) $this.innerHTML = "";
    }
    return $this;
};

// EOF
