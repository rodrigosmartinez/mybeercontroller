function drawChart(rows) {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Hora');
    data.addColumn('number', 'Temp Interna');
    data.addColumn('number', 'Temp Externa');
    data.addColumn('number', 'Setpoint');
    data.addColumn('number', 'Limite Superior');
    data.addColumn('number', 'Limite Inferior');

    let newRows = rows.map(r => {
        let sp = r[3];
        let h = r[4];

        return [r[0], r[2], r[1], sp, sp + (h/2), sp - (h/2)];
    });

    data.addRows(newRows);

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, {
        legend: 'right',
        backgroundColor: '#ffffff'
    });
}
