// ========================================
// MyBeerController Dashboard
// Firebase + Chart.js
// ========================================

let chart;
let ultimoHeartbeat = 0;
let heartbeatTimer = null;
let controladorConectado = true;
let ultimoStatus = {};

// Inicialização

function iniciarFirebase() {

    carregarHistorico();

    carregarStatus();

    if (heartbeatTimer === null)
        heartbeatTimer = setInterval(verificarHeartbeat, 1000);

}


// Atualiza status wifi
function verificarHeartbeat() {

    const elemento = document.getElementById("controller_status");

    if (!ultimoHeartbeat) {

        elemento.innerHTML = "🟡 Verificando conexão...";
        elemento.style.color = "#ffaa00";
        return;

    }

    const diff = Date.now() - ultimoHeartbeat;

    if (diff <= 30000) {

        elemento.innerHTML = "🟢 Controlador conectado";
        elemento.style.color = "#00cc44";

        controladorConectado = true;
        habilitarBotao(true);

    }
    else {

        elemento.innerHTML = `🔴 Controlador desconectado há ${formatarTempo(diff)}`;

        elemento.style.color = "#ff3333";
        
        if (controladorConectado) {
            controladorConectado = false;
            limparCards();
            habilitarBotao(false);
        }
        
    }

}

// ========================================
// Cards
// Origem: /status
// ========================================

function carregarStatus() { 
    db.ref("status").on("value", snapshot => { 
     
     const status = snapshot.val(); 
     
     if (!status) 
     return;
     
     atualizarCards(status); 
    
    }); 
 
}

// Atualiza os cards
function atualizarCards(status) {

    ultimoHeartbeat = status.last_update || 0;
    ultimoStatus = { ...status };

    document.getElementById("setpoint").value =
        formatarNumero(status.setpoint);

    document.getElementById("hysterese").value =
        formatarNumero(status.hysterese);

    document.getElementById("timedelay").value =
        status.timedelay;

    document.getElementById("ontime").value =
        status.ontime;

    document.getElementById("offtime").value =
        status.offtime;

    document.getElementById("stirrer").value =
        status.stirrer;

    document.getElementById("temp_in").value =
        `${formatarNumero(status.temp_in_filtered)} °C`;

    document.getElementById("temp_out").value =
        `${formatarNumero(status.temp_out_filtered)} °C`;

    let texto = "STANDBY";

    if (status.status_control == 1)
        texto = "REFRIGERANDO";
    else if (status.status_control == 2)
        texto = "AQUECENDO";

    document.getElementById("status_control").innerText =
        texto;

    const elemento = document.getElementById("status_control");

    if (texto === "REFRIGERANDO")
        elemento.style.color = "#00bfff";
    else if (texto === "AQUECENDO")
        elemento.style.color = "#ff4d4d";
    else
        elemento.style.color = "#ccc";

    const sd = document.getElementById("sd_card");
    const txt = document.getElementById("sd_card_text");
    
    sd.checked = !!status.telegram;
    
    txt.innerHTML = sd.checked ? "ON" : "OFF";
    txt.style.color = sd.checked ? "#00ff66" : "#ff4444";

    const telegram = document.getElementById("telegram");
    const txt = document.getElementById("telegram_text");
    
    telegram.checked = !!status.sd_card;
    
    txt.innerHTML = telegram.checked ? "ON" : "OFF";
    txt.style.color = telegram.checked ? "#00ff66" : "#ff4444";
    
}

// ========================================
// Histórico
// Origem: /historico
// ========================================

function carregarHistorico() {


    db.ref("historico")
        .limitToLast(100)
        .on("value", snapshot => {


            const dados = snapshot.val();


            if (!dados)
                return;


            let labels = [];
            let tempIn = [];
            let tempOut = [];
            let setpoint = [];


            Object.keys(dados)
                .sort()
                .forEach(key => {


                    const item = dados[key];


                    const data =
                        new Date(item.timestamp);


                    labels.push(
                        data.toLocaleTimeString()
                    );


                    tempIn.push(
                        Number(item.temp_in_filtered)
                    );


                    tempOut.push(
                        Number(item.temp_out_filtered)
                    );


                    setpoint.push(
                        Number(item.setpoint)
                    );

                });


            atualizarGrafico(
                labels,
                tempIn,
                tempOut,
                setpoint
            );

        });

}



// ========================================
// Criação do gráfico
// ========================================

function atualizarGrafico(
    labels,
    tempIn,
    tempOut,
    setpoint
) {


    const ctx =
        document.getElementById("grafico");


    if (chart)
        chart.destroy();



    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "Temp. Interna",
                    data: tempIn,
                    tension: 0.3
                },

                {
                    label: "Temp. Externa",
                    data: tempOut,
                    tension: 0.3
                },

                {
                    label: "Setpoint",
                    data: setpoint,
                    tension: 0.3
                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            scales: {

                y: {

                    title: {

                        display: true,

                        text: "Temperatura °C"

                    }

                }

            }

        }

    });

}

// ========================================
// Limpar cards
// ========================================

function limparCards() {

    document.getElementById("setpoint").value = "--";
    document.getElementById("hysterese").value = "--";
    document.getElementById("timedelay").value = "--";
    document.getElementById("ontime").value = "--";
    document.getElementById("offtime").value = "--";
    document.getElementById("stirrer").value = "--";
    document.getElementById("temp_in").value = "--";
    document.getElementById("temp_out").value = "--";

    document.getElementById("status_control").innerHTML = "--";
    document.getElementById("status_control").style.color = "#ccc";

}

function habilitarBotao(habilitado) {

    const botao = document.getElementById("btn_enviar");

    botao.disabled = !habilitado;

}

// ========================================
// Funções auxiliares
// ========================================

function formatarNumero(valor) {

    if (valor === undefined || valor === null)
        return "";

    return Number(valor).toFixed(1);

}

function formatarTempo(ms) {

    const totalSegundos = Math.floor(ms / 1000);

    const dias = Math.floor(totalSegundos / 86400);
    const horas = Math.floor((totalSegundos % 86400) / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    const hh = String(horas).padStart(2, "0");
    const mm = String(minutos).padStart(2, "0");
    const ss = String(segundos).padStart(2, "0");

    return `${dias}d ${hh}h ${mm}m ${ss}s`;

}

// Inicia quando o Chart.js estiver carregado

window.onload = () => {

    iniciarFirebase();

};
