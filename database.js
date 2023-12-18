const sql = require('mssql')

const configConnection = {
    server: 'localhost',
    user: 'sa', // update me
    password: 'DorkoSp123@', // update me
    database: 'pruebaNode',
    options:{
        trustServerCertificate: true // Resuelve un error mpp
    }
}

const getConnection = async() => {
    try{
        const pool = await sql.connect(configConnection); //CREA LA POOL O LA CONEXION
        //const res = await pool.request().query('SELECT * FROM users');
        //console.log(res)
        console.log('Database connected succesfully')
        return pool //DEVUELVE LA CONEXION :D
    } catch(e){
        console.log(e)
    }
}

module.exports = {getConnection};