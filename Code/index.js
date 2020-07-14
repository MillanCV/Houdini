/**
 * parser
 * a partir de un csv producido en influxdb-cronograf genera otro csv
 * con la forma x, y , z y un array de valores a lo largo del tiempo
 * para ser utilizado en Houdini  
 * */
const csv = require('csv-parser');
const fs = require('fs');

const results = [];

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './out.csv',
    header: [{
            id: 'x',
            title: 'x'
        },
        {
            id: 'y',
            title: 'y'
        },
        {
            id: 'z',
            title: 'z'
        },
        {
            id: 'value',
            title: 'value'
        },
    ]
});

let content = [];
fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
        let station = content.findIndex(x => x.idStation === row.idStation)

        if (station >= 0) {
            content[station].value += " " + parseFloat(row['meteo_data.mean_temperature']).toFixed(2)
        } else {
            console.log(row.idStation)
            let newStation = {
                idStation: row.idStation,
                x: row['meteo_data.mean_latitude'],
                z: row['meteo_data.mean_longitude'],
                y: 0,
                value: parseFloat(row['meteo_data.mean_temperature']).toFixed(2)
            }
            content.push(newStation)

        }

    })
    .on('end', () => {
        csvWriter
            .writeRecords(content)
            .then(() => console.log('The CSV file was written successfully'));
    });