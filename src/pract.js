/*require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})
let shiftR;
const days = ["monday", "tuesday", "wednesday"] //, "Thursday","Friday","Saturday","Sunday"];

function dbRequest(day){
    console.log("Day: "+day);
    return knexInstance.select('shift_time',`${day}`).from('shr');
    
}

module.exports = Promise.all([
            dbRequest(days[0] ? days[0]: null),
            dbRequest(days[1] ? days[1]: null),
            dbRequest(days[2] ? days[2]: null)
])
.then(results => {
    return { shiftR: results } //the array only contains the dates once all the promises
                                //have been completed
});







//const arr = [ array_mon, array_tues, array_wed ];
//console.log('this: ',arr)


//knexInstance.select('shift_time',"tuesday").from('shr').then(res => {
    //tuesday = response(res);
//})



//console.log('2',monday);
//console.log('Monday',monday);
//console.log('Tuesday',tuesday);

/*

const ScheduleService = {
    getInfo(knex) {
        return knex.select('shift_time',"monday").from('shr')
    }
}

module.exports = ScheduleService;


*/
