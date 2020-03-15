 const path = require('path')
const express = require('express')
const xss = require('xss')
const ScheduleService = require('./schedule-service')
const { requireAuth } = require('../middleware/jwt-auth')

const scheduleRouter = express.Router()
const jsonParser = express.json()

const logger = require('../logger')


//sanitize the schedule table
const serializeSchedule = schedule => ({
  id: schedule.id,
  emp_name: xss(schedule.emp_name),
  monday: xss(schedule.monday),
  tuesday: xss(schedule.tuesday),
  wednesday: xss(schedule.wednesday),
  thursday: xss(schedule.thursday),
  friday: xss(schedule.friday),
  saturday: xss(schedule.saturday),
  sunday: xss(schedule.sunday),
});

//sanitize the employee table
const serializeEmployee = employee => ({
    id: employee.id,
    business_id: employee.business_id,
    emp_name: xss(employee.emp_name),
    emp_availability: xss(employee.emp_availability),
  });

  //sanitize the shr table
const serializeSHR = shr => ({
    id: shr.id,
    business_id: shr.business_id,
    shift_time: shr.shift_time,
    midday: xss(shr.midday),
    monday: shr.monday,
    tuesday: shr.tuesday,
    wednesday: shr.wednesday,
    thursday: shr.thursday,
    friday: shr.friday,
    saturday: shr.saturday,
    sunday: shr.sunday,
  });
  
  //sanitize the business table
const serializeBusiness = business => ({
    id: business.id,
    business_name: xss(business.business_name),
  });

  //sanitize the operation table
const serializeOperation = operation => ({
    id: operation.id,
    business_id: operation.business_id,
    day: xss(operation.day),
    open_time: xss(operation.open_time),
    close_time: xss(operation.close_time),
  });

  function chooseSerialize(table){
    if(table==='schedule'){
        return serializeSchedule; 
    }
    else if (table==='employee'){
        return serializeEmployee;
    }
    else if(table==='shr'){
        return serializeSHR;
    }
    else if(table==='business'){
        return serializeBusiness;
    }
    else if(table==='operation'){
        return serializeOperation;
    }
  }
  
  function isEmpty(obj){
    for(let key in obj){
        if(obj.hasOwnProperty(key))
            return false
    }
    return true
}

/*
 ------------ MASS GRAB OF DATA
 */
scheduleRouter
  .route('/all')
  .all(requireAuth)
  /* -------------------

    G E T /all 

     ------------------- */
  .get((req, res, next) => {
    //grabbing the database and table
    const knexInstance = req.app.get('db');
    const table = req.app.get('table');

    //making the call to the method that will get the data from the DataBase
    ScheduleService.getAllData(knexInstance, table)
      .then(response => {

          //call a function that will decide which method to iterate for serialization
          const serializeFunction = chooseSerialize(table);

          //The response is list of object(s). Calling the serialize function will cause it to select
          // the object that is being iterated.
          res.json(response.map( serializeFunction ));        
      })
      .catch(next)
  })
  /* -------------------

    P O S T /all 

     ------------------- */
  .post(jsonParser, (req, res, next) => {

    const data = req.body;
    const table = req.app.get('table');
    if(isEmpty(req.body)){
      logger.error(`Empty request body`);
      return res.status(400).send(`Empty request body`);
    }

    for (const [key, value] of Object.entries(data))
      if (value == null){
        logger.error(`Missing '${key}' in request body`);
        return res.status(400).send(`Missing '${key}' in request body`);
      }
    ScheduleService.insertData(
      req.app.get('db'),
      table,
      data
    )
    .then(responseData => {
        const serializeFunction = chooseSerialize(table);
        
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${responseData.id}`))
          .json(serializeFunction(responseData))
      })
      .catch(next)
  })


  /*
 ------------ SINGLE GRAB OF DATA BY ID
 */
scheduleRouter
  .route('/:data_id')
  .all(requireAuth)
  /* -------------------
    Requesting data by ID: save to "res.data" for any 
      endpoints to use
     ------------------- */
  .all((req, res, next) => {
    
    ScheduleService.getById(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id
    )
      .then(data => {
        if (!data || data.length < 1) {
          return res.status(404).json({
            error: { message: `Data Not Found` }
          });
        }
        //Save the response from the request to "res.data"
        res.data = data;
        next()
      })
      .catch(next)
  })
  /* -------------------

    G E T /:data_id

     ------------------- */
  .get((req, res, next) => {
    //SAVE TABLE
    const table = req.app.get('table');
    // choose which function needs to be called so the
    // data can be serialized 
   
    const serializeFunction = chooseSerialize(table);
    
    res.json( res.data.map( serializeFunction ) )
  })
  /* -------------------

    D E L E T E /:data_id

     ------------------- */
  .delete((req, res, next) => {
    ScheduleService.deleteData(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id
    )
      .then(numRowsAffected => {
        logger.info(`${req.app.get('table')} with id ${req.params.data_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })
  /* -------------------

    P A T C H /:data_id

     ------------------- */
  .patch(jsonParser, (req, res, next) => {
    //const { title, content, style } = req.body
    const dataToUpdate = req.body; //{ title, content, style }

    const numberOfValues = Object.values(dataToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'style' or 'content'`
        }
      })

    ScheduleService.updateData(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id,
      dataToUpdate
    )
    .then(numRowsAffected => {
        res.
        status(204).end()
      })
      .catch(next)
  })


   /*
 ------------ MASS GRAB OF DATA BY ID
 */
scheduleRouter
.route('/business/:business_id')
.all(requireAuth)
/* -------------------
  Requesting data by business_ID: save to "res.data" for any 
    endpoints to use
   ------------------- */
.all((req, res, next) => {
  ScheduleService.getByBusinessId(
    req.app.get('db'),
    req.app.get('table'),
    req.params.business_id
  )
    .then(data => {
      if (!data || data.length < 1) {
        return res.status(404).json({
          error: { message: `Data Not Found` }
        })
      }
      //Save the response from the request to "res.data"
      res.data = data
      next()
    })
    .catch(next)
})
/* -------------------

  G E T /business/:business_id

   ------------------- */
.get((req, res, next) => {
  //SAVE TABLE
  const table = req.app.get('table');
  // choose which function needs to be called so the
  // data can be serialized
  const serializeFunction = chooseSerialize(table);
  //MUST map through the list and serialize each object and return
  // the serialized object to "res.json()"
  res.json(res.data.map(obj => {
    return serializeFunction(obj);
  }))
})
/* -------------------

    D E L E T E /business/:business_id

     ------------------- */
.delete((req, res, next) => {
    ScheduleService.deleteBusinessData(
        req.app.get('db'),
        req.app.get('table'),
        req.params.business_id
    )
      .then(numRowsAffected => {
          res.status(204).end()
      })
      .catch(next)
    })

module.exports = scheduleRouter;