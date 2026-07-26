// ========================================
// MyBeerController Dashboard
// Firebase + Chart.js
// ========================================

let chart;


// Inicialização

function iniciarFirebase() {

    carregarHistorico();

    carregarStatus();

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


    document.getElementById("temp_in").value =
        formatarNumero(status.temp_in_filtered) + " °C";


    document.getElementById("temp_out").value =
        formatarNumero(status.temp_out_filtered) + " °C";



    let texto = "STANDBY";


    if (status.status_control == 1)
        texto = "REFRIGERANDO";


    else if (status.status_control == 0)
        texto = "AQUECENDO";


    document.getElementById("status_control").innerText =
        texto;


    const elemento =
        document.getElementById("status_control");


    if (texto === "REFRIGERANDO")
        elemento.style.color = "#00bfff";

    else if (texto === "AQUECENDO")
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
// Funções auxiliares
// ========================================

function formatarNumero(valor) {

    if (valor === undefined || valor === null)
        return "";

    return Number(valor).toFixed(1);

}



// Inicia quando o Chart.js estiver carregado

window.onload = () => {

    iniciarFirebase();

};
