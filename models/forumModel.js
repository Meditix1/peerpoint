const { query } = require('../database');
const pool = require('../database.js')
const jwt = require('jsonwebtoken');
const { configDotenv } = require('dotenv');


module.exports.createForum = function createForum (Thread,Desc,token){
  console.log('inside createForum: ',Thread,Desc)
  const decoded = jwt.decode(token);
  const user_id = decoded.user.id

  const sql = `INSERT INTO forum (user_id, title, description) VALUES ($1,$2,$3)  `
  return query(sql, [user_id, Thread,Desc])
  .then(function (result) {
      console.log(result)
      if (result.rowCount === 0) {
          throw new EMPTY_RESULT_ERROR(`got some error`)
      }

      return result
  })
  .catch(function (error) {
      throw error;
  });
  
}

module.exports.getAllForums = async function getAllForums(token) {
    try {
       
        const decoded = jwt.decode(token);
        console.log(token);
        const user_id = decoded.user.id;

        
        const sql = `SELECT thread_id, title, description, created_at FROM forum`;
        const sql2 = `SELECT thread_id, title, description, created_at FROM forum WHERE user_id = $1`;

        
        const result1 = await query(sql);
        const rows = result1.rows;
        //console.log(rows);

       
        const result2 = await query(sql2, [user_id]);
        const rows2 = result2.rows; 
        //console.log(rows2);

       
        const all = [rows, rows2];
        console.log('all: ',all)
        return all;
    } catch (error) {
        console.error('Error fetching forums:', error);
        throw error; 
    }
};


module.exports.deleteForum = function deleteForum(id){
    const sql = `DELETE FROM forum where thread_id = $1`
    return query(sql,[id]).then(function(result){
        console.log('result from delete: ',result)
    })
}