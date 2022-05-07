const axios = require('axios')
const { Dog, Temperament } = require('./../db')

// ======================================
//              INFO DB
// ======================================

let dogsFromDB = async () => {
    try {
        const dataDogsDB = await Dog.findAll({
            include: {
                model: Temperament,
                attributes: ['temperament'],
                through: {
                    attributes: [],
                },
            },
        });
        const lastInfoDogsDB = await dataDogsDB.map(e => {
            // console.log(e.life)
            return {
                id: e.id,
                name: e.name,
                heightMin: parseInt(e.heightMin),
                heightMax: parseInt(e.heightMax),
                weightMin: parseInt(e.weightMin),
                weightMax: parseInt(e.weightMax),
                lifespan: e.life_span,
                temperament: e.temperaments.map(
                    temp => temp.temperament).join(', '),
                image: e.image,
                createdInDb: true,
            };
        });
        console.log("controller", lastInfoDogsDB)
        return lastInfoDogsDB;
    } catch(err) {
        console.log(err);
    };
};

// ======================================
//              INFO API
// ======================================

const dogsFromApi = async () => {

    const getInfoApi = await axios.get('https://api.thedogapi.com/v1/breeds')
    const lastInfoDogsApi = await getInfoApi.data.map(e => {
        // let aux = [];
        // if(e.height.metric.length > 4) 
        return {
            id: e.id,
            name: e.name,
            heightMax: parseInt(e.height.metric.slice(4).trim()),
            heightMin: parseInt(e.height.metric.slice(0,2).trim()),
            weightMax: parseInt(e.weight.metric.slice(4).trim()),
            weightMin: parseInt(e.weight.metric.slice(0,2).trim()),
            lifespan: e.life_span,
            temperament: e.temperament,
            image: e.image.url,
        };
    });
    return lastInfoDogsApi;

}

// ======================================
//              JOIN INFO
// ======================================

const dogsTotal = async () => {
    let dogsInfoDB = await dogsFromDB();
    let dogsInfoAPI = await dogsFromApi();
    return dogsInfoDB.concat(dogsInfoAPI);
};


module.exports = {
    dogsFromDB,
    dogsFromApi,
    dogsTotal,
}