app.get('/send-data', async (req, res) => {
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
});
