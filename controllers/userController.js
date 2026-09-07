const userService = require("../services/userService");


// ==========================================
// CEK ORIGINAL GANGSTER
// ==========================================

function isOwner(req) {

    return (
        req.session.user &&
        req.session.user.role === "Original Gangster"
    );

}


// ==========================================
// LIST USER
// ==========================================

exports.index = async (req, res) => {

    try {

        const users = await userService.getAll();

        res.render("user/index", {
            users,
            currentUser: req.session.user
        });

    } catch (error) {

        console.error("USER INDEX ERROR:", error);

        res.status(500).send(
            "Gagal mengambil data user"
        );

    }

};


// ==========================================
// FORM CREATE
// ==========================================

exports.createPage = (req, res) => {

    if (!isOwner(req)) {
        return res.status(403).send(
            "403 - Tidak memiliki akses"
        );
    }


    res.render("user/create", {
        currentUser: req.session.user
    });

};


// ==========================================
// CREATE USER
// ==========================================

exports.create = async (req, res) => {

    try {

        if (!isOwner(req)) {
            return res.status(403).send(
                "403 - Tidak memiliki akses"
            );
        }


        const {
            username,
            password,
            role
        } = req.body;


        if (!username || !password) {
            return res.status(400).send(
                "Username dan password wajib diisi"
            );
        }


        // Owner hanya boleh membuat role tertentu
        const allowedRoles = [
            "Member",
            "BuzChef",
            "Head BuzChef"
        ];


        if (!allowedRoles.includes(role)) {
            return res.status(400).send(
                "Role tidak valid"
            );
        }


        await userService.create({
            username,
            password,
            role
        });


        res.redirect("/user");

    } catch (error) {

        console.error("CREATE USER ERROR:", error);

        res.status(500).send(
            error.message || "Gagal membuat user"
        );

    }

};


// ==========================================
// UPDATE ROLE
// ==========================================

exports.updateRole = async (req, res) => {

    try {

        const currentUser = req.session.user;

        if (!currentUser) {
            return res.redirect("/login");
        }

        const targetRow = Number(req.params.row);

        if (!Number.isInteger(targetRow) || targetRow < 2) {
            return res.status(400).send(
                "Row user tidak valid"
            );
        }

        const newRole = req.body.role;

        const targetUser =
            await userService.getByRow(targetRow);

        if (!targetUser) {
            return res.status(404).send(
                "User tidak ditemukan"
            );
        }

        // Tidak boleh mengubah diri sendiri
        if (
            String(targetUser.id) ===
            String(currentUser.id)
        ) {
            return res.status(403).send(
                "Tidak boleh mengubah role sendiri"
            );
        }

        // Owner tidak boleh diubah
        if (
            targetUser.role ===
            "Original Gangster"
        ) {
            return res.status(403).send(
                "Role Original Gangster tidak dapat diubah"
            );
        }

        // Validasi role
        const validRoles = [
            "Member",
            "BuzChef",
            "Head BuzChef",
            "Original Gangster"
        ];

        if (!validRoles.includes(newRole)) {
            return res.status(400).send(
                "Role tidak valid"
            );
        }

        // BuzChef tidak boleh mengubah role
        if (currentUser.role === "BuzChef") {
            return res.status(403).send(
                "BuzChef tidak dapat mengubah role"
            );
        }

        // Head BuzChef hanya Member -> BuzChef
        if (currentUser.role === "Head BuzChef") {

            if (
                targetUser.role !== "Member" ||
                newRole !== "BuzChef"
            ) {
                return res.status(403).send(
                    "Head BuzChef hanya dapat Promote Member menjadi BuzChef"
                );
            }

        }

        // Original Gangster
        if (currentUser.role === "Original Gangster") {

            // Tidak boleh membuat Owner baru
            if (newRole === "Original Gangster") {
                return res.status(403).send(
                    "Tidak dapat membuat Original Gangster baru"
                );
            }
        }

        // Pastikan role target valid
        const allowedCurrentRoles = [
            "Member",
            "BuzChef",
            "Head BuzChef"
        ];

        if (
            !allowedCurrentRoles.includes(
                targetUser.role
            )
        ) {
            return res.status(403).send(
                "Role target tidak valid"
            );
        }

        // UPDATE
        await userService.updateRole(
            targetRow,
            newRole
        );

        res.redirect("/user");

    } catch (error) {

        console.error(
            "UPDATE ROLE ERROR:",
            error
        );

        res.status(500).send(
            error.message ||
            "Gagal mengubah role"
        );
    }
};

// ==========================================
// DELETE USER
// ==========================================

exports.remove = async (req, res) => {

    try {

        if (!isOwner(req)) {

            return res.status(403).send(
                "403 - Tidak memiliki akses"
            );

        }


        const targetRow =
            Number(req.params.row);


        const targetUser =
            await userService.getByRow(
                targetRow
            );


        if (!targetUser) {

            return res.status(404).send(
                "User tidak ditemukan"
            );

        }


        // Tidak boleh hapus diri sendiri

        if (
            String(targetUser.id) ===
            String(req.session.user.id)
        ) {

            return res.status(403).send(
                "Tidak boleh menghapus akun sendiri"
            );

        }


        // Tidak boleh hapus Owner

        if (
            targetUser.role ===
            "Original Gangster"
        ) {

            return res.status(403).send(
                "Original Gangster tidak dapat dihapus"
            );

        }


        await userService.remove(
            targetRow
        );


        res.redirect("/user");

    } catch (error) {

        console.error(
            "DELETE USER ERROR:",
            error
        );

        res.status(500).send(
            error.message ||
            "Gagal menghapus user"
        );

    }

};

// ==========================================
// EDIT USER PAGE
// ==========================================

exports.editPage = async (req, res) => {

    try {

        if (!isOwner(req)) {
            return res.status(403).send(
                "403 - Tidak memiliki akses"
            );
        }

        const row = Number(req.params.row);

        const user = await userService.getByRow(row);

        if (!user) {
            return res.status(404).send(
                "User tidak ditemukan"
            );
        }

        // Tidak boleh edit diri sendiri
        if (
            String(user.id) ===
            String(req.session.user.id)
        ) {
            return res.status(403).send(
                "Tidak boleh mengedit akun sendiri"
            );
        }

        // Owner tidak boleh diedit
        if (
            user.role === "Original Gangster"
        ) {
            return res.status(403).send(
                "Original Gangster tidak dapat diedit"
            );
        }

        res.render("user/edit", {
            user,
            currentUser: req.session.user
        });

    } catch (error) {

        console.error("EDIT USER PAGE ERROR:", error);

        res.status(500).send(
            error.message ||
            "Gagal membuka edit user"
        );

    }

};


// ==========================================
// EDIT USER
// ==========================================

exports.update = async (req, res) => {

    try {

        if (!isOwner(req)) {
            return res.status(403).send(
                "403 - Tidak memiliki akses"
            );
        }

        const row = Number(req.params.row);

        const user = await userService.getByRow(row);

        if (!user) {
            return res.status(404).send(
                "User tidak ditemukan"
            );
        }


        // Tidak boleh edit diri sendiri

        if (
            String(user.id) ===
            String(req.session.user.id)
        ) {
            return res.status(403).send(
                "Tidak boleh mengedit akun sendiri"
            );
        }


        // Tidak boleh edit Owner

        if (
            user.role === "Original Gangster"
        ) {
            return res.status(403).send(
                "Original Gangster tidak dapat diedit"
            );
        }


        const {
            username,
            password,
            role
        } = req.body;


        if (!username) {
            return res.status(400).send(
                "Username wajib diisi"
            );
        }


        const allowedRoles = [
            "Member",
            "BuzChef",
            "Head BuzChef"
        ];


        if (!allowedRoles.includes(role)) {
            return res.status(400).send(
                "Role tidak valid"
            );
        }


        // Kalau password dikosongkan,
        // gunakan password lama

        const newPassword =
            password && password.trim() !== ""
                ? password
                : user.password;


        await userService.updateUser(
            row,
            {
                username,
                password: newPassword,
                role
            }
        );


        res.redirect("/user");

    } catch (error) {

        console.error("UPDATE USER ERROR:", error);

        res.status(500).send(
            error.message ||
            "Gagal mengubah user"
        );

    }

};