// Inicializar la API de síntesis de voz
let synth = window.speechSynthesis;
let utterance = null; // Objeto SpeechSynthesisUtterance para la lectura
let voicesInfo = { voices: [], isEmpty: true, isLoaded: false } ; // Array para almacenar las voces disponibles
const selectedAttribute = "selected";

function GetVoice(data) {
    if (voicesInfo.isEmpty) populateVoiceList();
    if(voicesInfo.isEmpty || !data) return voicesInfo.default;
    if (typeof(data) === "string") data = { voice: data };
    if (data instanceof SpeechSynthesisVoice) return data;
    if (data.voice instanceof SpeechSynthesisVoice) return data.voice;
    if (voicesInfo.name[data.voice]) return voicesInfo.name[data.voice];
    var voice = voicesInfo.local[data.voice] || voicesInfo.country[data.voice] || voicesInfo.language[data.voice];
    if (!voice) return voicesInfo.default;
    for(var i = 0; i < voice.length; i++) {
        if (data.preferOnline && !voice[i].localService) return voice[i];
        else if (!data.preferOnline && voice[i].localService) return voice[i];
    }
    return data.preferOnline ? voice[0] || voicesInfo.default : voicesInfo.default;
}

// Función para poblar el combobox con las voces del sistema
function populateVoiceList() {
    voicesInfo = { isEmpty: true, isLoaded: false };
    voicesInfo.voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));

    if (voicesInfo.voices.length === 0) {
        showNotification('No se encontraron voces de síntesis de voz en tu sistema.', 'warning');
        return;
    }
    voicesInfo.isEmpty = false;

    voicesInfo.country = {};
    voicesInfo.language = {};
    voicesInfo.local = {};
    voicesInfo.name = {};

    for (let i = 0; i < voicesInfo.voices.length; i++) {
        var v = voicesInfo.voices[i];
        if (v.default) voicesInfo.default = v;
        var lang = v.lang.split("-");
        voicesInfo.local[v.lang] = voicesInfo.local[v.lang] || [];
        voicesInfo.local[v.lang].push(v);
        voicesInfo.language[lang[0]] = voicesInfo.language[lang[0]] || [];
        voicesInfo.language[lang[0]].push(v);
        voicesInfo.country[lang[1]] = voicesInfo.country[lang[1]] || [];
        voicesInfo.country[lang[1]].push(v);
        voicesInfo.name[v.name] = v;
    }
    voicesInfo.isLoaded = true;

    onVoicesLoaded("voicesLoaded");
}

// Event listener para cuando las voces han sido cargadas o cambiadas
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
} else {
    populateVoiceList();
}

// Event listener para el botón "Leer"
function readText(textToRead, options) {
    if (textToRead === '') {
        //showMessage('Por favor, introduce el texto que deseas leer.', 'warning');
        return;
    }

    if (!options?.forced && synth.speaking) synth.cancel();

    const selectedVoice = GetVoice(options);

    if (!selectedVoice) {
        options?.onerror({ Message: "No voice" });
        return;
    }
    utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    // Establecer las propiedades de la voz desde los controles
    utterance.rate = options?.rate || 1.2;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;
    utterance.onstart = options?.onstart || ((e) => { });
    utterance.onend = options?.onend || ((e) => { });
    utterance.onerror = options?.onerror || ((e) => { });
    synth.speak(utterance);
}

// Event listener para el botón "Pausar"
function pauseSynth() {
    if (synth.speaking && !synth.paused) {
        synth.pause();
    }
}

// Event listener para el botón "Reanudar"
function resumeSynth() {
    if (synth.speaking && synth.paused) {
        synth.resume();
    }
}

// Event listener para el botón "Detener"
function stopSynth() {
    if (synth.speaking) {
        synth.cancel();
    }
}

function GetSelected() {
    var selectedItem = document.querySelector(`*[${selectedAttribute}]`);
    return selectedItem;
}

function SelectNext() {
    var selectableItems = [...document.querySelectorAll("*[tts]")];
    var selected = GetSelected();
    selected.removeAttribute(selectedAttribute);
    var index = selectableItems.indexOf(selected) + 1;
    selected = selectableItems[index];
    if (!selected) return selected;
    selected.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selected.setAttribute(selectedAttribute, "");
    return selected;
}

function StartReadingElement(e) {
    readText(e.textContent, {
        voice: "es",
        onend: (sse) => {
            var next = SelectNext();
            if (next) StartReadingElement(next);
        }
    });
}

window.addEventListener("dblclick", (e) => {
    if(!e.target.hasAttribute("tts")) return;
    var selectedItems = document.querySelectorAll(`*[${selectedAttribute}]`);
    for(var itm of [...selectedItems]) { itm.removeAttribute(selectedAttribute); }
    e.target.setAttribute(selectedAttribute, "");
    StartReadingElement(e.target);
});

window.addEventListener("DOMContentLoaded", () => onVoicesLoaded("domLoaded"));

function onVoicesLoaded(altText) {
    try {
        if (!voicesInfo.isLoaded) {
            return;
        }
        var voicesbox = [...document.querySelectorAll("*[voicesbox]")];
        var voices = [...voicesInfo.voices];
        voices.sort((a, b) => (b.localService ? 1 : 0) - (a.localService ? 1 : -1));
        voices.sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : -1));
        for(var box of voicesbox) {
            box.innerHTML = altText;
            for(var voice of voices) {
                var pvoice = document.createElement("p");
                pvoice.textContent = `${voice.default ? "☑️" : "❎" } ${voice.localService ? "💽" : "🌐"} [${voice.lang}] ${voice.name}`;
                box.appendChild(pvoice);
            }
        }
    } catch(e) {
        var errortxt = JSON.stringify(e);
        showNotification(errortxt, 'error');
        var voicesbox = [...document.querySelectorAll("*[voicesbox]")];
        for(var box of voicesbox) {
            box.innerHTML = errortxt;
        }
    }
}
