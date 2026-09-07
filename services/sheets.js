const sheets = require("../config/google");

const spreadsheetId = process.env.SPREADSHEET_ID;

/**
 * Ambil semua data dari sheet
 */
async function getSheet(sheetName) {
    console.time(`GET SHEET ${sheetName}`);

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:J`
    });

    console.timeEnd(`GET SHEET ${sheetName}`);

    return response.data.values || [];
}
/**
 * Tambah baris baru
 */
async function appendSheet(sheetName, values) {

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [values]
        }
    });

}

/**
 * Update satu baris
 */
async function updateRow(sheetName, rowNumber, values) {

    // Hitung kolom terakhir berdasarkan jumlah data
    const endColumn = String.fromCharCode(64 + values.length);

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${rowNumber}:${endColumn}${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [values]
        }
    });

}

/**
 * Hapus isi satu baris
 * (untuk nanti fitur Arsip/Hapus)
 */
async function clearRow(sheetName, rowNumber) {

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!A${rowNumber}:Z${rowNumber}`
    });

}

/**
 * Hapus 1 baris dari Google Sheets
 */
async function deleteRow(sheetName, rowNumber) {

    // Ambil metadata spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId
    });

    // Cari sheet berdasarkan nama
    const sheet = spreadsheet.data.sheets.find(
        s => s.properties.title === sheetName
    );

    if (!sheet) {
        throw new Error("Sheet tidak ditemukan");
    }

    const sheetId = sheet.properties.sheetId;

    // Hapus baris
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: "ROWS",
                            startIndex: rowNumber - 1,
                            endIndex: rowNumber
                        }
                    }
                }
            ]
        }
    });

}

module.exports = {
    getSheet,
    appendSheet,
    updateRow,
    clearRow,
    deleteRow
};