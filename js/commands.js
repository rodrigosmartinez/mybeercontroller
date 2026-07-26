function enviarParametros() {

    const dados = {
        setpoint: Number(document.getElementById("setpoint").value),
        hysterese: Number(document.getElementById("hysterese").value),
        timedelay: Number(document.getElementById("timedelay").value),
        ontime: Number(document.getElementById("ontime").value),
        offtime: Number(document.getElementById("offtime").value),
        stirrer: Number(document.getElementById("stirrer").value)
    };
    
    const confirmar = confirm(
        "Confirme os valores antes de enviar:\n\n" +
        JSON.stringify(dados, null, 2)
    );

    if (!confirmar) {

        alert("Envio cancelado.");

        return;
    }

    db.ref("comandos")
        .set(dados)
        .then(() => {
            alert("Enviado com sucesso!");
        })
        .catch((err) => {
            alert("Erro:\n\n" + err.message);
        });
}
