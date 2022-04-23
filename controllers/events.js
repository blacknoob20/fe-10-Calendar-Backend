const { response, json } = require('express');
const Event = require('../models/Event');

const listEvents = async (req, res = response) => {
    // El populate trae toda la informacion del usuario
    // const eventos = await Event.find().populate('user');
    // Si solo queremos que devuelva campos especificos el populate
    // lo especificamos en el segundo parametro
    const eventos = await Event.find().populate('user', 'name');
    // Que devuelva varios campos
    // const eventos = await Event.find().populate('user', 'name password');

    res.json({
        ok: true,
        msg: eventos,
    });
}

const createEvents = async (req, res = response) => {
    const evento = new Event(req.body);

    try {
        evento.user = req.uid;

        const evtGuarado = await evento.save();

        res.json({
            ok: true,
            evento: evtGuarado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }

}

const updateEvents = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid      = req.uid;

    try {
        const evento = await Event.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID.'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para modificar este evento.'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        // De esta manera solamente retorna los datos antes de la actualizacion
        // const eventoActualizado = await Event.findByIdAndUpdate(eventoId, nuevoEvento);
        // Si queremos que retorne los nuevos datos actualizados hay que enviar un tercer parametro
        const eventoActualizado = await Event.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteEvents = async(req, res = response) => {
    const eventoId = req.params.id;
    const uid      = req.uid;

    try {
        const evento = await Event.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID.'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento.'
            });
        }

        // De esta manera solamente retorna los datos antes de la actualizacion
        // const eventoActualizado = await Event.findByIdAndUpdate(eventoId, nuevoEvento);
        // Si queremos que retorne los nuevos datos actualizados hay que enviar un tercer parametro
        const eventoBorrado = await Event.findByIdAndDelete(eventoId);

        res.json({
            ok: true,
            evento: eventoBorrado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    listEvents,
    createEvents,
    updateEvents,
    deleteEvents
}