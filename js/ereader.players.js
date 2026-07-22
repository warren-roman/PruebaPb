function reloadPlayerColors(hn, sn, ln) {
    hn = hn || Math.random() * 1234;
    sn = sn || Math.random() * 5678;
    ln = ln || Math.random() * 9000;
    var players = document.querySelectorAll("*[dline]");
    var ptypes = {};
    var ps = document.getElementById("players");
    if (!ps) {
      document.head.appendChild(ps = document.createElement("style"));
      ps.setAttribute("id", "players");
    }
    console.log(players);
    var ihtm = "";
    for(var player of [...players]) {
        var pname = player.getAttribute("dline");
        if (ptypes[pname]) continue;
        var h = generarNumero(pname, hn, 0, 360);
        var s = generarNumero(pname, sn, 30, 180) / 100;
        var l = generarNumero(pname, ln, 30, 40);
        ptypes[pname] = `.pagearea *[dline="${pname}"] { --player-color: oklch(${l}% ${s} ${h}) }\r\n`;
        ihtm += ptypes[pname];
    }
    ps.innerHTML = ihtm;
}
