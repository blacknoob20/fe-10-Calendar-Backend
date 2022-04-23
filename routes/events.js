/*
    Rutas de eventos
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { listEvents, createEvents, updateEvents, deleteEvents } = require('../controllers/events');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const isDate = require('../helpers/isDate');

const router = Router();

// Aplicar el middleware a todas las rutas
router.use(validateJWT);

// Rutas
router.get('/', listEvents);

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha hasta es obligatoria').custom(isDate),
        validateFields
    ],
    createEvents
);

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha hasta es obligatoria').custom(isDate),
        validateFields
    ],
    updateEvents
);

router.delete('/:id', deleteEvents);

module.exports = router;