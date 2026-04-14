const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
app.use(cors());
const app = express();

// 🔓 liberar arquivos estáticos (dashboard)
app.use(express.static('public'));

// 🔌 conexão com banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// 🧱 criar tabela automaticamente
async function criarTabela() {
  try {
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

    console.log("✅ Tabela verificada/criada com sucesso");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  }
}

criarTabela();

// 🌐 rota principal → abre dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 📡 receber dados do ESP
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
      parseFloat(setpoint),
      parseFloat(temperature_in),
      parseFloat(temperature_out),
      parseFloat(hysterese),
      parseFloat(timedelay),
      parseFloat(ontime),
      parseFloat(offtime)
    ]);

    console.log("📥 Dados inseridos com sucesso");

    res.send("OK");
  } catch (err) {
    console.error("❌ ERRO AO SALVAR:", err);
    res.status(500).send(err.message);
  }
});

// 📊 buscar dados (para dashboard)
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM temp_data_db ORDER BY id DESC LIMIT 500'
    );

    const rows = result.rows;

    res.json({
      last: rows[0] || {},
      history: rows
    });

  } catch (err) {
    console.error("❌ ERRO AO BUSCAR:", err);
    res.status(500).send(err.message);
  }
});

// 🚀 iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta " + PORT);
});
