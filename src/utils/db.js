const mysql = require('mysql2');
 

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'test',
	password: 'mtdp123456',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
  });

const db = pool.promise()

db.transaction = async(sql, data) => {
	const conn = await db.getConnection()
	try{
		conn.beginTransaction()
		const res = await conn.query(sql, data)
		await conn.commit()
		await conn.release()
		return res
	}catch(err){
		await conn.release()
		await conn.rollback()
		throw err
	}
}

export default db