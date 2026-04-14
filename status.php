<?php

$servername = "sql303.infinityfree.com:3306";
$dbname = "if0_41595532_database_temperature";
$username = "if0_41595532";
$password = "90kAZLZnlPzI";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("erro");
}

// 🔹 último registro
$sql_last = "SELECT * FROM temp_data_db ORDER BY id DESC LIMIT 1";
$result_last = $conn->query($sql_last);
$last = $result_last->fetch_assoc();

// 🔹 converter tipos
$last['temperature_in'] = (float)$last['temperature_in'];
$last['temperature_out'] = (float)$last['temperature_out'];
$last['setpoint'] = (float)$last['setpoint'];
$last['hysterese'] = (float)$last['hysterese'];
$last['timedelay'] = (float)$last['timedelay'];
$last['ontime'] = (float)$last['ontime'];
$last['offtime'] = (float)$last['offtime'];

// 🔹 histórico (somente o que o gráfico usa)
$sql = "SELECT time, setpoint, temperature_in, temperature_out FROM temp_data_db";
$result = $conn->query($sql);

$dados = array();

while ($row = $result->fetch_assoc()) {
    $dados[] = [
        $row['time'],
        (float)$row['temperature_out'],
        (float)$row['temperature_in'],
        (float)$row['setpoint']
    ];
}

$conn->close();

// 🔹 JSON final
echo json_encode([
    "last" => $last,
    "history" => $dados
]);