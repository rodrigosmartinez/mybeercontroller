function iniciarFirebase() {

    db.ref('historico').limitToLast(50).on('value', snapshot => {

        const data = snapshot.val();
        if (!data) return;

        let history = [];
        let keys = Object.keys(data);
        keys.sort();

        for (let k of keys) {
            let item = data[k];

            let date = new Date(item.timestamp || Date.now());
            let hora = date.getHours() + ":" + String(date.getMinutes()).padStart(2, '0');

            history.push([
                hora,
                item.temp_out_filtered,
                item.temp_in_filtered,
                item.setpoint,
                item.hysterese,
                item.status_control,
                item.timedelay,
                item.ontime,
                item.offtime
            ]);
        }

        let last = history[history.length - 1];

        atualizarCards(last);
        drawChart(history);
    });
}

function atualizarCards(last) {

    
    function atualizarInput(id, valor) {
    
        const input = document.getElementById(id);
    
        // Não atualiza se o usuário estiver editando este campo
        if (document.activeElement === input)
            return;
    
        input.value = valor;
    }
    
    function f1(v){ return (v !== undefined) ? parseFloat(v).toFixed(1) : ""; }
    function f0(v){ return (v !== undefined) ? parseInt(v) : ""; }

    let status = "STANDBY";
    if (last[5] == 1) status = "REFRIGERANDO";
    else if (last[5] == 0) status = "AQUECENDO";

    let el = document.getElementById("status_control");
    el.innerText = status;

    if (status === "REFRIGERANDO") el.style.color = "#00bfff";
    else if (status === "AQUECENDO") el.style.color = "#ff4d4d";
    else el.style.color = "#ccc";

    atualizarInput("setpoint", f1(last[3]));
    atualizarInput("hysterese", f1(last[4]));
    atualizarInput("timedelay", f0(last[6]));
    atualizarInput("ontime", f0(last[7]));
    atualizarInput("offtime", f0(last[8]));

    document.getElementById("temp_in").value = f1(last[2]) + " °C";
    document.getElementById("temp_out").value = f1(last[1]) + " °C";
}


google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(iniciarFirebase);
