// utils / helper

const moment = require('moment');

newCurrentMysqlDate = function (){
    let todayDate= Date.now() 
    return moment(todayDate).format('YYYY-MM-DD HH:mm:ss')
}


module.exports= {
    newCurrentMysqlDate
}