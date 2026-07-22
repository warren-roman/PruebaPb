
window.addEventListener('resize', eventEvalDeviceType);

window.addEventListener('DOMContentLoaded', eventEvalDeviceType);

screen.orientation.addEventListener('change', eventEvalDeviceType);

function onCDeviceTypeChanged(type, isFirst) {
    var popoverToChange = [...document.querySelectorAll("*[popovermin]")];
    for(var item of popoverToChange) {
        if (type == "min") item.setAttribute("popover", "");
        else item.removeAttribute("popover");
    }
}

function eventEvalDeviceType() {
    var cdt = window.cdevicetype;
    const rootStyles = window.getComputedStyle(document.documentElement);
    const deviceType = rootStyles.getPropertyValue('--device-type').replaceAll("\"", "").trim();
    window.cdevicetype = deviceType;
    if (!cdt) { onCDeviceTypeChanged(window.cdevicetype, true); return; }
    else if (cdt != window.cdevicetype) { onCDeviceTypeChanged(window.cdevicetype, false); }
}

var themes = ["light", "dark"];
    function setTheme(theme) {
    for(var t of themes) { document.body.classList.remove(t); }
    document.body.classList.add(theme);
}

var viewmodes = ["script", "play", "book", "chat"];
function setViewMode(mode) {
    for(var vm of viewmodes) { document.body.classList.remove(vm); }
    document.body.classList.add(mode);
}

function setPalette(name) {}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerText = message;

  container?.appendChild(notif);

  // Remove after 3 seconds
  setTimeout(() => {
    notif.classList.add('fade-out');
    setTimeout(() => {
      if (notif.parentNode) {
        notif.parentNode.removeChild(notif);
      }
    }, 500); // Wait for transition
  }, 3000);
}
