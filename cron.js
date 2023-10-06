const cron = require('node-cron')

const pilotCron = cron.schedule('* * * * *',()=>{
    console.log('cron run');
})

module.exports = pilotCron
