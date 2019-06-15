const pg = require('pg')

const postgres = require('../config').postgres

module.exports = {
  query: (sqlStr) => {
    return new Promise((resolve, reject) => {
      let client = new pg.Client(postgres)
      client.connect((err) => {
        if (err) {
          reject(err)
        } else {
          client.query(sqlStr, (err, result) => {
            if (err) {
              reject(err)
            } else {
              switch (result.command) {
                case 'SELECT':
                  resolve(result.rows)
                  break;
                case 'CREATE':
                  console.log('CREATE')
                  resolve(result.command)
                  break;
                case 'INSERT':
                  let datos = {
                    data: []
                  }
                  console.log('INSERT', result.rowCount)
                  if (result.rowCount > 0) {
                    //console.log(result.rows)
                    datos.data = result.rows
                  }
                  resolve(datos)
                  break;
                default:
                  //console.log('default:', result)
                  //console.log(result)
                  resolve(result)
              }
            }
            client.end()
          })
        }
      })
    })
  }
}