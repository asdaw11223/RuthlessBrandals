const {
    getSheet,
    appendSheet,
    updateRow,
    deleteRow
} = require("./sheets");


// ==========================================
// AMBIL SEMUA USER
// ==========================================

async function getAll() {

    const rows = await getSheet("User");

    if (!rows.length) return [];

    rows.shift();

    return rows
        .map((row, index) => ({
            row: index + 2,
            id: row[0] || "",
            username: row[1] || "",
            password: row[2] || "",
            role: row[3] || "Member"
        }))
        .filter(user => user.username);

}


// ==========================================
// LOGIN
// ==========================================

async function login(username, password) {

    const users = await getAll();

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!user) return null;

    return {
        id: user.id,
        username: user.username,
        role: user.role
    };

}


// ==========================================
// CARI USER BERDASARKAN ROW
// ==========================================

async function getByRow(row) {

    const users = await getAll();

    return users.find(
        user => Number(user.row) === Number(row)
    );

}


// ==========================================
// BUAT USER
// ==========================================

async function create(data) {

    const users = await getAll();

    const exists = users.find(
        user =>
            user.username.toLowerCase() ===
            data.username.toLowerCase()
    );

    if (exists) {
        throw new Error("Username sudah digunakan");
    }


    // ID otomatis
    let maxId = 0;

    users.forEach(user => {

        const id = Number(user.id);

        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }

    });


    const id = maxId + 1;


    await appendSheet("User", [
        id,
        data.username,
        data.password,
        data.role || "Member"
    ]);


    return {
        id,
        username: data.username,
        role: data.role || "Member"
    };

}


// ==========================================
// UPDATE ROLE
// ==========================================

async function updateRole(row, role) {

    const user = await getByRow(row);

    if (!user) {
        throw new Error("User tidak ditemukan");
    }


    await updateRow("User", user.row, [
        user.id,
        user.username,
        user.password,
        role
    ]);


    return {
        ...user,
        role
    };

}


// ==========================================
// HAPUS USER
// ==========================================

async function remove(row) {

    const user = await getByRow(row);

    if (!user) {
        throw new Error("User tidak ditemukan");
    }


    await deleteRow("User", user.row);

}

// ==========================================
// UPDATE USER
// ==========================================

async function updateUser(row, data) {

    const user = await getByRow(row);

    if (!user) {
        throw new Error("User tidak ditemukan");
    }

    await updateRow("User", user.row, [
        user.id,
        data.username,
        data.password,
        data.role
    ]);

    return {
        id: user.id,
        username: data.username,
        password: data.password,
        role: data.role
    };

}

module.exports = {
    getAll,
    login,
    getByRow,
    create,
    updateRole,
    updateUser,
    remove
};