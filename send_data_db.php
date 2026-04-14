<?php
$servername = "sql303.infinityfree.com:3306";
$dbname = "if0_41595532_database_temperature";
$username = "if0_41595532";
$password = "90kAZLZnlPzI";

//Chave para ser comparada com a chave enviada pelo ESP8266
$api_key_value = "tPmAT5Ab3j7F9";

$api_key = $status_control = $setpoint = $temperature_in = $temperature_out = $hysterese = $timedelay = $ontime = $offtime = "";

// Verifica método
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    die("Invalid request method.");
}

// Verifica se todos os parâmetros existem
if (!isset($_GET['api_key'], $_GET['status_control'], $_GET['setpoint'], $_GET['temperature_in'], $_GET['temperature_out'], $_GET['hysterese'], $_GET['timedelay'], $_GET['ontime'], $_GET['offtime'])) {
    die("Missing parameters.");
}

// Valida API key
if ($_GET['api_key'] !== $api_key_value) {
    die("Invalid API Key provided.");
}


//Captura a Data e Hora do SERVIDOR (onde está hospedada sua página):
$date = date('Y-m-d');
$time = date('H:i:s');

$status_control = test_input($_GET['status_control']);
$setpoint = test_input($_GET['setpoint']);
$temperature_in = test_input($_GET['temperature_in']);
$temperature_out = test_input($_GET['temperature_out']);
$hysterese = test_input($_GET['hysterese']);
$timedelay = test_input($_GET['timedelay']);
$ontime = test_input($_GET['ontime']);
$offtime = test_input($_GET['offtime']);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO temp_data_db (id, date, time, status_control, setpoint, temperature_in, temperature_out, hysterese, timedelay, ontime, offtime)
        VALUES (NULL, '$date', '$time', '$status_control', '$setpoint', '$temperature_in', '$temperature_out', '$hysterese', '$timedelay', '$ontime', '$offtime')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
}
else {
    echo "Error: " . $conn->error . "<br>" . $sql ;
}

$conn->close();

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

?>