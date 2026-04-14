const express = require('express');
const app = express();

let dados = [];

app.get('/', (req, res) => {
  res.send("API online 🍺");
});

// 👉 ESP envia dados aqui
app.get('/send-data', (req, res) => {
  const temp = req.query.temp || 0;
  const setpoint = req.query.setpoint || 0;

  const registro = {
    temp,
    setpoint,
    time: new Date()
  };

  dados.push(registro);

  console.log(registro);

  res.send("OK");
});

// 👉 Dashboard busca dados aqui
app.get('/data', (req, res) => {
  res.json(dados);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
