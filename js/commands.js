function enviarParametros() {

    const dados = {};

    const setpoint = Number(document.getElementById("setpoint").value);
    if (setpoint !== ultimoStatus.setpoint)
        dados.setpoint = setpoint;

    const hysterese = Number(document.getElementById("hysterese").value);
    if (hysterese !== ultimoStatus.hysterese)
        dados.hysterese = hysterese;

    const timedelay = Number(document.getElementById("timedelay").value);
    if (timedelay !== ultimoStatus.timedelay)
        dados.timedelay = timedelay;

    const ontime = Number(document.getElementById("ontime").value);
    if (ontime !== ultimoStatus.ontime)
        dados.ontime = ontime;

    const offtime = Number(document.getElementById("offtime").value);
    if (offtime !== ultimoStatus.offtime)
        dados.offtime = offtime;

    const stirrer = Number(document.getElementById("stirrer").value);
    if (stirrer !== ultimoStatus.stirrer)
        dados.stirrer = stirrer;

    if (Object.keys(dados).length === 0) {
        alert("Nenhum parâmetro foi alterado.");
        return;
    }

    db.ref("commands").update(dados);
}
