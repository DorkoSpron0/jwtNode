const {Router} = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); //ENCRIPTAR LAS CONTRASENHAS

const router = Router();

const {getConnection} = require('../database');

//API PARA EL REGISTER Y EL LOGIN :D

//REGISTER USER
router.post('/register', async (req,res) => {

    const pwdHashed = bcrypt.hashSync(req.body.user.password, 10);

    const user = {
        name: req.body.user.name,
        password: pwdHashed
    }
    
    try{
        const pool = await getConnection()
        const result = await pool.request().query(`INSERT INTO users VALUES ('${user.name}', '${user.password}')`);
        res.json({message: 'USUARIO CREADO CON EXITO!', user: user})
    }catch (e) {
        res.json({message: 'ERROR!!! ALGO HA OCURRIDO', error: e})
    }
});

//GET ALL USERS
router.get('/users', async(req,res) => {
    res.header('Acces-Control-Allow-Origin', '*')
    try{
        const pool = await getConnection()
        const result = await pool.request().query('SELECT * FROM users');
        res.json({message: result})
    }catch(e){
        res.json({message: 'ERROR!!! ALGO HA OCURRIDO', error: e})
    }
});

//LOGIN USER
router.post('/login', async(req,res) => {

    const user = {
        name: req.body.user.name,
        password: req.body.user.password
    }

    try {
        const pool = await getConnection()
        const result = await pool.request().query(`SELECT * FROM users WHERE name='${user.name}'`)
        
        if (result.recordset.length == 0) {
            return res.json({message: 'Datos incorrectos'})
        }

        const pwdHashed = await pool.request().query(`SELECT password FROM users WHERE name='Manu Yepes' ;`)
        const pwdCompared = bcrypt.compareSync(user.password, pwdHashed.recordset[0].password)

        if(!pwdCompared) {
            return res.json({message: 'Contrasenha incorrecta'})
        }

        const token = jwt.sign({name: user.name}, process.env.SECRET_KEY, {expiresIn: '1m'} );
        res.json({message: 'Login my bro :D', result: result.recordset, token: token})
    }catch (e) {
        res.json({e: e.message})
    }
});

//DASHBOARD
router.get('/dashboard', async(req,res) => {

    try{
        const token = req.headers.authorization.split(' ')[1];
        const result = jwt.verify(token, process.env.SECRET_KEY);

        return res.json({message: 'Dashboard page', user: result})
    }catch(e){
        return res.status(401).json({error: e.message})
    }
});

//ROUTER TEST BCRYPT
router.post('/testBcrypt', async(req,res) => {
    const hash = bcrypt.hashSync(req.body.name,10);

    const data = bcrypt.compareSync(req.body.name, '$2b$10$rCUqYdE2PZVBQdtTVAYPa.oS0adeqgtjXguempp8U1fhBq.XuPtOy')
    console.log(hash)
    console.log(data)
    res.json({message: 'testBcrypt'})
})

module.exports = router;