// ========================================
// Inicialização do Firebase
// ========================================
alert("dashboard.js versão nova carregada");
function iniciarFirebase() {

    // Histórico para o gráfico
    db.ref("historico").limitToLast(50).on("value", snapshot => {

        const data = snapshot.val();
        if (!data) return;

        let history = [];

        Object.keys(data).sort().forEach(key => {

            let item = data[key];

            let date = new Date(item.timestamp || Date.now());

            let hora =
                date.getHours() + ":" +
                String(date.getMinutes()).padStart(2, "0");

            history.push([
                hora,
                item.temp_out_filtered,
                item.temp_in_filtered,
                item.setpoint,
                item.hysterese
            ]);
        });

        drawChart(history);
    });


    // Status atual para os campos da tela
    db.ref("status").on("value", snapshot => {

        const status = snapshot.val();

        if (!status) return;

        atualizarCards(status);
    });
}


// ========================================
// Atualiza os valores da tela
// Dados vindos do /status
// ========================================

function atualizarCards(status) {

    function atualizarInput(id, valor) {

        const input = document.getElementById(id);

        // Não sobrescreve enquanto o usuário digita
        if (document.activeElement === input)
            return;

        input.value = valor;
    }


    function decimal(valor) {

        return valor !== undefined
            ? Number(valor).toFixed(1)
            : "";
    }


    function inteiro(valor) {

        return valor !== undefined
            ? parseInt(valor)
            : "";
    }


    // Status do controlador
    let textoStatus = "STANDBY";

    if (status.status_control == 1)
        textoStatus = "REFRIGERANDO";

    else if (status.status_control == 0)
        textoStatus = "AQUECENDO";


    const elementoStatus =
        document.getElementById("status_control");

    elementoStatus.innerText = textoStatus;


    if (textoStatus === "REFRIGERANDO")
        elementoStatus.style.color = "#00bfff";

    else if (textoStatus === "AQUECENDO")
        elementoStatus.style.color = "#ff4d4d";

    else
        elementoStatus.style.color = "#ccc";


    // Valores atuais
    atualizarInput("setpoint", decimal(status.setpoint));
    atualizarInput("hysterese", decimal(status.hysterese));
    atualizarInput("timedelay", inteiro(status.timedelay));
    atualizarInput("ontime", inteiro(status.ontime));
    atualizarInput("offtime", inteiro(status.offtime));


    document.getElementById("temp_in").value =
        decimal(status.temp_in_filtered) + " °C";

    document.getElementById("temp_out").value =
        decimal(status.temp_out_filtered) + " °C";
}


// ========================================
// Google Charts
// ========================================

google.charts.load("current", {
    packages: ["corechart", "line"]
});

google.charts.setOnLoadCallback(iniciarFirebase);


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
