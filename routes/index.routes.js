const {Router} = require('express')
const jwt = require('jsonwebtoken');

const router = Router();

const {getConnection} = require('../database')


const user = {
    name: 'Nicky Florez',
    pwd: '123123'
}
// ROUTER PARA UNAS API DE PRUEBA CON LA DB
router.post('/token', (req,res) => {
    const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '1h'} );

    res.json({message: 'generate token', token: token})
})

router.get('/public', async(req,res) => {

    const pool = await getConnection()
    const result = await pool.request().query('SELECT * FROM users');

    res.json({message: 'This is a public page',result: result})
})

router.get('/private', (req,res) => {
    try{
        const Bearer = req.headers.authorization;
        const auth = Bearer.split(' ')[1]

        const payload = jwt.verify(auth, process.env.SECRET_KEY)
        res.json({message: 'This is a private page', payload: payload})
    }catch (error){
        res.status(401).send({error: error.message})
    }
})

module.exports = router