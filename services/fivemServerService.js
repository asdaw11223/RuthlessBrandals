const { getSheet } = require("./sheets");

async function getAll() {

    const rows = await getSheet("FiveM");

    if (!rows.length) return [];

    rows.shift();

    return rows.map((row, index) => ({

        row: index + 2,

        id: row[0],

        nama: row[1],

        code: row[2],

        status: row[3]

    }));

}

module.exports = {
    getAll
};