function enviarParametros() {

    const dados = {
        setpoint: parseFloat(document.getElementById("setpoint").value),
        hysterese: parseFloat(document.getElementById("hysterese").value),
        timedelay: parseInt(document.getElementById("timedelay").value),
        ontime: parseInt(document.getElementById("ontime").value),
        offtime: parseInt(document.getElementById("offtime").value),
        stirrer: parseInt(document.getElementById("stirrer").value),
        timestamp: Date.now()
    };

    console.log("Enviando:", dados);

    firebase.database().ref("comandos").set(dados)
        .then(() => alert("Enviado!"))
        .catch(err => console.error(err));
}
