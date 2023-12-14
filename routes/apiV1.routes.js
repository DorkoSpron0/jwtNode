const {Router} = require('express')
const jwt = require('jsonwebtoken');

const router = Router();

const {getConnection} = require('../database');

//API PARA EL REGISTER Y EL LOGIN :D
router.post('/register', async (req,res) => {

    const user = {
        name: req.body.user.name,
        password: req.body.user.password
    }

    console.log(user.name)
    
    try{
        const pool = await getConnection()
        const result = await pool.request().query(`INSERT INTO users VALUES ('${user.name}', '${user.password}')`);
        res.json({message: 'USUARIO CREADO CON EXITO!', user: user})
    }catch (e) {
        res.json({message: 'ERROR!!! ALGO HA OCURRIDO', error: e})
    }
});

router.get('/users', async(req,res) => {
    try{
        const pool = await getConnection()
        const result = await pool.request().query('SELECT * FROM users');
        res.json({message: result})
    }catch(e){
        res.json({message: 'ERROR!!! ALGO HA OCURRIDO', error: e})
    }
})


module.exports = router;