function enviarParametros() {

    const dados = {};
    const alteracoes = [];

    // Setpoint
    const setpoint = Number(document.getElementById("setpoint").value);
    if (setpoint !== Number(ultimoStatus.setpoint)) {
        dados.setpoint = setpoint;
        alteracoes.push(`• Setpoint: ${ultimoStatus.setpoint} → ${setpoint}`);
    }

    // Histerese
    const hysterese = Number(document.getElementById("hysterese").value);
    if (hysterese !== Number(ultimoStatus.hysterese)) {
        dados.hysterese = hysterese;
        alteracoes.push(`• Histerese: ${ultimoStatus.hysterese} → ${hysterese}`);
    }

    // Delay
    const timedelay = Number(document.getElementById("timedelay").value);
    if (timedelay !== Number(ultimoStatus.timedelay)) {
        dados.timedelay = timedelay;
        alteracoes.push(`• Delay: ${ultimoStatus.timedelay} → ${timedelay}`);
    }

    // On Time
    const ontime = Number(document.getElementById("ontime").value);
    if (ontime !== Number(ultimoStatus.ontime)) {
        dados.ontime = ontime;
        alteracoes.push(`• On Time: ${ultimoStatus.ontime} → ${ontime}`);
    }

    // Off Time
    const offtime = Number(document.getElementById("offtime").value);
    if (offtime !== Number(ultimoStatus.offtime)) {
        dados.offtime = offtime;
        alteracoes.push(`• Off Time: ${ultimoStatus.offtime} → ${offtime}`);
    }

    // Stirrer
    const stirrer = Number(document.getElementById("stirrer").value);
    if (stirrer < 0 || stirrer > 10) {
        alert("O valor do Stirrer deve estar entre 0 e 10.");
        return;
    }
    if (stirrer !== Number(ultimoStatus.stirrer)) {
        dados.stirrer = stirrer;
        alteracoes.push(`• Stirrer: ${ultimoStatus.stirrer} → ${stirrer}`);
    }

    // SD Card
    const sd_card = document.getElementById("sd_card").checked;
    if (sd_card !== Boolean(ultimoStatus.sd_card)) {
        dados.sd_card = sd_card;
        alteracoes.push(`• SD Card: ${ultimoStatus.sd_card ? "ON" : "OFF"} → ${sd_card ? "ON" : "OFF"}`);
    }

    // Telegram
    const telegram = document.getElementById("telegram").checked;
    if (telegram !== Boolean(ultimoStatus.telegram_enabled)) {
        dados.telegram_enabled = telegram;
        alteracoes.push(`• Alerta Telegram: ${ultimoStatus.telegram_enabled ? "ON" : "OFF"} → ${telegram ? "ON" : "OFF"}`);
    }


    
    // Nada alterado
    if (Object.keys(dados).length === 0) {
        alert("Nenhum parâmetro foi alterado.");
        return;
    }

    // Confirmação
    const mensagem =
        "Deseja enviar as seguintes alterações?\n\n" +
        alteracoes.join("\n");

    if (!confirm(mensagem))
        return;

    // Envia somente os parâmetros alterados
    db.ref("comandos")
        .update(dados)
        .then(() => {
            alert("Parâmetros enviados com sucesso.");
        })
        .catch((erro) => {
            alert("Erro ao enviar parâmetros:\n" + erro.message);
        });
    
} 
