const { default: mongoose } = require('mongoose');

const dbconn = async () => {
    try {
        await mongoose.connect(process.env.DB_CONN);
        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar las base de datos.');
    }
}

module.exports = {
    dbconn
}