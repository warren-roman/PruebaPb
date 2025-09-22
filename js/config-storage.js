
{ /* Storage */

    function SetConfigMenu() {
        window.configStorage = window.configStorage || {};
        window.configStorageValues = window.configStorageValues || JSON.parse(localStorage.getItem("configStorageValues")) || {};
        var group = (element, name, config) => {
            for(var key in config) {
                var pKey = `${name}-${key}`;
                var value = config[key];
                var content = [];
                if  (value instanceof Array) {
                    content = [...value];
                    value = content.shift();
                    for(var index = 0; index < content.length; index++) {
                        content[index] = _(content[index]);
                    }
                }
                if (typeof(value) == "string") {
                    element.__(value, [{ id: pKey, change: (e) => {
                        window.configStorageValues[e.target.id] = e.target.value;
                        localStorage.setItem("configStorageValues", JSON.stringify(window.configStorageValues))
                    } }, content, window.configStorageValues[pKey],]);
                    element.__("br");
                }
                else if (typeof(value) == "object" && value) {
                    var summary = _("summary", key);
                    var details = _("details", [summary]);
                    element._(details);
                    element.__("br");
                    group(details, pKey, value);
                }
            }
        };
        var result = _("div");
        group(result, "root", window.configStorage);
        return result;
    }
}

/* Page Example */
/*
    window.configStorage = {
        theme: ["select.;label=Tema", "option.;value=day;text=día", "option.;value=nite;text=noche"],
        language: "input.;placeholder=;label=idioma",
        general: {
            color: "input.;type=color;value=#994422",
            color2: "input.;type=color;value=#447755",
        }
    }

    window.addEventListener("load", () => { document.body._(SetConfigMenu()); });
}
*/
