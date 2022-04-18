// Recomendacion del profesor
// colocar donde apunta la ruta en un comentario
/*
    Rutas de autenticacion
    host + /api/auth
*/

// Llamar router modo 1
// const express = require('express');
// const router = express.Router;
// Llamar al router modo 2
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, revalToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

// Ejemplo con GET
// router.get('/', (req, res) => {
//     res.json({
//         ok: true
//     });
// });

/**
 * Para aplicar middleware en la ruta
 * si en uno solo se puede enviar por paramatero el
 * nombre del middleware pero si son varios hay que
 * colocarlos entre []
 */
// iniciar sesion
router.post(
    '/',
    [
        // Middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El passwword es obligatorio').isLength({ min: 6 }),
        validateFields
    ]
    ,
    loginUser
);

// Nuevo usuario
router.post(
    '/new',
    [
        // Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El passwword es obligatorio').isLength({ min: 6 }),
        validateFields
    ],
    createUser
);

// Revalidar el token JWT
// El envio de los parametros va a ser por headers
// y el estandar es que a los key se le debe de
// anteponer la letra x-<nombre del key>
router.get('/renew', validateJWT, revalToken);

module.exports = router;