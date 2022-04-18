const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    // Leer el parametro del header
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion.'
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_SEED);

        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    next();
}

module.exports = {
    validateJWT
}