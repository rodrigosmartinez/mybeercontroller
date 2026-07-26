// ========================================
// MyBeerController - Dashboard
// ========================================

function iniciarFirebase() {

    // Gráfico - dados do /historico
    db.ref("historico").limitToLast(50).on("value", snapshot => {

        const data = snapshot.val();
        if (!data) return;

        let history = [];

        Object.keys(data).sort().forEach(key => {

            const item = data[key];
            const date = new Date(item.timestamp || Date.now());

            const hora =
                date.getHours() + ":" +
                String(date.getMinutes()).padStart(2, "0");

            history.push([
                hora,
                Number(item.temp_out_filtered),
                Number(item.temp_in_filtered),
                Number(item.setpoint),
                Number(item.hysterese)
            ]);
        });

        drawChart(history);
    });


    // Cards - dados do /status
    db.ref("status").on("value", snapshot => {

        const status = snapshot.val();

        console.log("STATUS RECEBIDO:", status);

        if (!status) return;

        atualizarCards(status);
    });
}


// Atualiza os valores dos cards

function atualizarCards(status) {

    function decimal(valor) {
        return (valor !== undefined && valor !== null)
            ? Number(valor).toFixed(1)
            : "";
    }


    function inteiro(valor) {
        return (valor !== undefined && valor !== null)
            ? parseInt(valor)
            : "";
    }


    let textoStatus = "STANDBY";

    if (status.status_control == 1)
        textoStatus = "REFRIGERANDO";

    else if (status.status_control == 0)
        textoStatus = "AQUECENDO";


    const statusElement = document.getElementById("status_control");

    if (statusElement) {

        statusElement.innerText = textoStatus;

        if (textoStatus === "REFRIGERANDO")
            statusElement.style.color = "#00bfff";

        else if (textoStatus === "AQUECENDO")
            statusElement.style.color = "#ff4d4d";

        else
            statusElement.style.color = "#ccc";
    }


    document.getElementById("setpoint").value =
        decimal(status.setpoint);

    document.getElementById("hysterese").value =
        decimal(status.hysterese);

    document.getElementById("timedelay").value =
        inteiro(status.timedelay);

    document.getElementById("ontime").value =
        inteiro(status.ontime);

    document.getElementById("offtime").value =
        inteiro(status.offtime);


    document.getElementById("temp_in").value =
        decimal(status.temp_in_filtered) + " °C";

    document.getElementById("temp_out").value =
        decimal(status.temp_out_filtered) + " °C";
}


// Google Charts

google.charts.load("current", {
    packages: ["corechart", "line"]
});

google.charts.setOnLoadCallback(iniciarFirebase);
