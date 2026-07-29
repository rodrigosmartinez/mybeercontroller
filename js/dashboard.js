// ========================================
// MyBeerController Dashboard
// Firebase + Chart.js
// ========================================
 
let chart;
let ultimoHeartbeat = 0;
let heartbeatTimer = null;
let controladorConectado = true;

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

    const ref = db.ref("status");

    ref.once("value", snapshot => {

        const dados = snapshot.val();

        if (!dados)
            return;

        Object.entries(dados).forEach(([chave, valor]) => {

            atualizarCampoIndividual(chave, valor);

        });

    });

    ref.on("child_changed", snapshot => {

        atualizarCampoIndividual(
            snapshot.key,
            snapshot.val()
        );

    });

}

// Carregar status
function atualizarCampo(id, valor) {

    const elemento = document.getElementById(id);

    if (elemento.value != valor)
        elemento.value = valor;

}

function atualizarTexto(id, texto) {

    const elemento = document.getElementById(id);

    if (elemento.innerText != texto)
        elemento.innerText = texto;

}


function atualizarCampoIndividual(chave, valor) {

    switch (chave) {

        case "last_update":

            ultimoHeartbeat = valor;
            break;

        case "setpoint":

            atualizarCampo(
                "setpoint",
                formatarNumero(valor)
            );
            break;

        case "hysterese":

            atualizarCampo(
                "hysterese",
                formatarNumero(valor)
            );
            break;

        case "timedelay":

            atualizarCampo(
                "timedelay",
                valor
            );
            break;

        case "ontime":

            atualizarCampo(
                "ontime",
                valor
            );
            break;

        case "offtime":

            atualizarCampo(
                "offtime",
                valor
            );
            break;

        case "stirrer":

            atualizarCampo(
                "stirrer",
                valor
            );
            break;

        case "temp_in_filtered":

            atualizarCampo(
                "temp_in",
                formatarNumero(valor) + " °C"
            );
            break;

        case "temp_out_filtered":

            atualizarCampo(
                "temp_out",
                formatarNumero(valor) + " °C"
            );
            break;

        case "status_control":

            atualizarStatusControle(valor);
            break;

    }

}

function atualizarStatusControle(status) {

    let texto = "STANDBY";

    if (status == 1)
        texto = "REFRIGERANDO";

    else if (status == 2)
        texto = "AQUECENDO";

    atualizarTexto(
        "status_control",
        texto
    );

    const elemento =
        document.getElementById("status_control");

    if (texto == "REFRIGERANDO")
        elemento.style.color = "#00bfff";

    else if (texto == "AQUECENDO")
        elemento.style.color = "#ff4d4d";

    else
        elemento.style.color = "#ccc";

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
