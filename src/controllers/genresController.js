const {Op} = require('sequelize')
const db = require('../database/models');



const genresController = {
    'list': async (req, res) => {
        let {limit, order = 'id'} = req.query
        let fields = ['name', 'ranking']
        try {
            if(!fields.includes(order)){
                let error = new Error('El campo no existe')
                error.status = 400
                throw error
            }
            let total = await db.Genre.count()
            let genres = await db.Genre.findAll({
                attributes : {
                    exclude : ['created_at', 'update_at']
                },
                limit : limit ? +limit : 5,
                order : [order]
            })
            

                return res.status(200).json({



                    ok : true,
                    meta: {
                       status : 200
                    },
                    data :{ 
                        items : genres.length,
                        total,
                        genres
                    } 

                    
                })
            
        } catch (error){
            console.log(error)
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message
            })
        }

    },
    getById: async (req, res) => {
        const {id} = req.params
        try {
            if(!isNaN(id)){
                let error = new Error('Ingrese un numero')
                error.status = 400
                throw error
            }

            let genre = await db.Genre.findByPk(id);
            if(!genre){
                let error = new Error('no existe ese genero')
                error.status = 404
                throw error
            }
            return res.status(200).json({
                ok : true,
                meta : {
                    status : 200,
                    
                },
                data : {
                    genre,
                    total : 1
                }
            })
           
        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message,
            })
        }
    },
    getByName : async (req,res) =>{
        const {name} = req.params
        try {
            if(!name){
                let error = new Error('Nombre obligatorio')
                error.status = 400;
                throw error
            }
            let genre = await db.Genre.findOne({
                where : {
                    name : {
                        [Op.substring] : name
                    }
                }
            });
            if(!genre){
                let error = new Error('no se encuentra un genero con ese nombre')
                error.status = 404
                throw error
            }
            return res.status(200).json({
                ok : true,
                meta : {
                    status : 200,
                    
                },
                data : {
                    genre,
                    total : 1
                }
            })
            
        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message,
            })
        }
    }

}

module.exports = genresController;