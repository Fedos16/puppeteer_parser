import Excel from 'exceljs'
import path from 'path'

import config from '../config'

export async function getDataExcel(filename) {
    try {
        let workbook = new Excel.Workbook();
        let data = await workbook.xlsx.readFile(filename);

        let worksheet = workbook.getWorksheet(data.worksheets[0].name);

        let arr = [];

        worksheet.eachRow({ includeEmpty: false }, async function(row, rowNumber) {
            if (row.values[1] && rowNumber > 1) {
            arr.push({text: row.values[1]});
            }
        });

        return arr;
    } catch(e) {
        console.log(e);
    }
}