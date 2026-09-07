exports.isLogin = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
};


// ==========================================
// CEK ROLE
// ==========================================

exports.allowRoles = (...roles) => {

    return (req, res, next) => {

        if (!req.session.user) {
            return res.redirect("/login");
        }

        const userRole = req.session.user.role;

        if (!roles.includes(userRole)) {

            return res.status(403).send(`
                <h1>403 - Forbidden</h1>
                <p>Kamu tidak memiliki akses ke halaman ini.</p>
                <a href="/">Kembali ke Dashboard</a>
            `);

        }

        next();

    };

};