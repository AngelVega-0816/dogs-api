const express = require('express');
const { dogsTotal, dogsFromApi } = require('../controllers');
const { Dog, Temperament } = require('./../../db')
const router = express.Router();

// Requests optimization
// let allDogs;

// =======================================================
// Requests GET to the route /dogs and /dogs?name=nameDogs  
// =======================================================

// router.get("/dogs", async (req, res) => {
//     try {
//         if(Object.keys(req.query).length === 0){            
//             let allDogs = await dogsTotal();
//             res.status(200).send(allDogs);            
//         } else if(req.query.name && req.query.name.match(/^[A-Z]+$/i)) {
//             let { name } = req.query;
//             let allDogs = await dogsTotal();
        
//             if(name) {
//                 let dogName = allDogs.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
//                 dogName.length ? 
//                 res.status(200).send(dogName) : 
//                 res.status(400).send("No dog with that name found");
//             };
//         } else if (req.query.name && req.query.name !== "") {
//             throw "Query Invalid";
//         } else {
//             throw "Empty search field";
//         };
//     } catch(err) {
//         res.send(err)
//     };
// });

router.get('/dogs', async (req, res) => {
    const { name } = req.query;
    try{
        let dogs = await dogsTotal();
        if(name) {
            let dogName = await dogs.filter(e => e.name.
                toLowerCase().includes(name.toLowerCase()));
            dogName.length ? 
            res.status(200).send(dogName):
            res.status(404).send('There is not a dog with that name');
        } else {
            res.status(200).send(dogs)
        }
    } catch(error){
        console.log(error);
    }
});


// ========================================
// Requests Get to the route /dogs/{idRace}
// ========================================

router.get("/dogs/:idRace", async(req, res) => {
    // res.send(req.params.idRace)
    try{
        let allDogs;
        if(allDogs) {
            let dogId = allDogs.filter(e => e.id == req.params.idRace)
            res.status(200).send(dogId);
        } else {
            allDogs = await dogsTotal();
            let dogId = await allDogs.filter(e => e.id == req.params.idRace)
            res.status(200).send(dogId);
        }
    } catch (err) {
        console.log(err)
    }
})


// ======================================
// Requests Get to the route /temperament
// ======================================

router.get('/temperament', async (req, res) => {
    try {

        //traigo todo de la api 
        let allDogs = await dogsFromApi();
        //me quedo solo con TEMPERAMENT
        let alltemperamentsApi = allDogs.map(e => e.temperament);
        //separo los string que concatenen temeramentos y dejo un array plano de strings
        let temperamentAux = alltemperamentsApi.map(e => (e ? e.split(", ") : null)).flat();

        //creo una nueva instancia de la clase Set para quedarme con valores únicos
        let uniqueTemperaments = [...new Set(temperamentAux)];
        
        //usando findOrCreate me aseguro de no crear un dato que ya exista en la DB, o crear en caso contrario
        uniqueTemperaments.filter(e => e !== null).forEach(
            async e => await Temperament.findOrCreate({
                where: {temperament: e},
            })
        );

        //pido todos los temperaments en order ascendente
        let allTemperaments = await Temperament.findAll({
            order: [['temperament', 'ASC']]
        })
        res.send(allTemperaments)
    } catch (err) {
        console.log(err)
    };
})


// ======================================
// Requests POST to the route /dog
// ======================================

router.post('/dog', async (req, res) => {
    try {
        let {
            name,
            heightMin,
            heightMax,
            weightMin,
            weightMax,
            lifespan,
            image,
            temperament
        } = req.body;

        //Url default
        if(!image) image = "https://img.freepik.com/vector-gratis/ilustracion-icono-vector-dibujos-animados-hueso-mordedura-perro-lindo-concepto-icono-comida-animales-vector-premium-aislado-estilo-dibujos-animados-plana_138676-4161.jpg?t=st=1651093142~exp=1651093742~hmac=e3fc68fb789debca33cc5c412f8ed8d887f8b8720b2fa4fac031b2f3b627d871&w=740"
        if(name && heightMin && heightMax && weightMin && weightMax && lifespan && image && temperament.length > 0) {
            //Insertando datos a la tabla dogs
            let dogCreated = await Dog.create({
                name: name,
                heightMin: parseInt(heightMin),
                heightMax: parseInt(heightMax),
                weightMin: parseInt(weightMin),
                weightMax: parseInt(weightMax),
                life_span: `${lifespan} years`,
                image: image,
                // createInDB: true,
            });

            //buscando los temperaments para relacionarlos con dogs
            let dogTemperament = await Temperament.findAll({
                where: {temperament: temperament},
            })
            dogCreated.addTemperament(dogTemperament);
            //successfull
            res.status(200).send(dogCreated.id);
        }
    } catch (err) {
        console.log(err)
        res.send("Failed to create a new dog")
    }
})



module.exports = router