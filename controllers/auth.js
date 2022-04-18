/**
 * El require no es necesario pero
 * es para no perder el intellisence
 *
 * OJO
 * Si colocamos dos res.json al mismo tiempo nos va a
 * salir un mensaje de error, se recomienda usar el return
 * para salir inmediatamente del programa ej: return res.json
 */

const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require('express');
const { generateJWT } = require('../helpers/jwtgen');
const User = require('../models/User');

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        // Validar si existe el usuario
        let usuario = await User.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario exite con ese correo.'
            });
        }

        usuario = new User(req.body);
        // Encriptar la clave
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generateJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe.'
            })
        }

        // Confirmar las claves
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto.'
            })
        }

        // Generar JWT
        const token = await generateJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const revalToken = async(req, res = response) => {
    const { uid, name } = req;
    // Generar JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    });
};



// Exportar
module.exports = {
    createUser,
    loginUser,
    revalToken
}