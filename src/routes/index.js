const { Router, response } = require('express');

// Importación de rutas modularizadas
const dogsGet = require('./Requests')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/', dogsGet)


module.exports = router;
