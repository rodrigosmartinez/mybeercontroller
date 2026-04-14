const express = require('express');
const { Pool } = require('pg');

const app = express();

// 🔌 conexão com banco (Render usa DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🧱 cria tabela automaticamente
async function criarTabela() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS temp_data_db (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      time TIME NOT NULL,
      status_control TEXT NOT NULL,
      setpoint FLOAT NOT NULL,
      temperature_in FLOAT NOT NULL,
      temperature_out FLOAT NOT NULL,
      hysterese FLOAT NOT NULL,
      timedelay FLOAT NOT NULL,
      ontime FLOAT NOT NULL,
      offtime FLOAT NOT NULL
    );
  `);
}

// chama criação da tabela
criarTabela().catch(console.error);

// 🌐 rota teste
app.get('/', (req, res) => {
  res.send("API online 🍺");
});

// 📡 ESP envia dados
app.get('/send-data', async (req, res) => {
  try {
    const now = new Date();

    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const {
      status_control = "0",
      setpoint = 0,
      temperature_in = 0,
      temperature_out = 0,
      hysterese = 0,
      timedelay = 0,
      ontime = 0,
      offtime = 0
    } = req.query;

    await pool.query(`
      INSERT INTO temp_data_db 
      (date, time, status_control, setpoint, temperature_in, temperature_out, hysterese, timedelay, ontime, offtime)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `, [
      date,
      time,
      status_control,
      setpoint,
      temperature_in,
      temperature_out,
      hysterese,
      timedelay,
      ontime,
      offtime
    ]);

    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar");
  }
});

// 📊 dashboard busca dados
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM temp_data_db ORDER BY id DESC LIMIT 500'
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar dados");
  }
});

// 🚀 iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
