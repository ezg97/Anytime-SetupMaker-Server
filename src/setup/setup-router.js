 const path = require('path');
const express = require('express');
const xss = require('xss');
const ScheduleService = require('./setup-service');
const { requireAuth } = require('../middleware/jwt-auth');

const setupRouter = express.Router();
const jsonParser = express.json();

const logger = require('../logger');

//sanitize the employee table
const serializeEmployee = employee => ({
    id: employee.id,
    business_id: employee.business_id,
    emp_name: xss(employee.emp_name),
    emp_skill: employee.emp_skill,
    emp_required: employee.emp_required,
    in_time: employee.in_time,
    out_time: employee.out_time
  });

  //sanitize the position table
const serializePosition = obj => ({
    id: obj.id,
    business_id: obj.business_id,
    pos_name: xss(obj.pos_name),
    pos_importance: obj.pos_importance,
    pos_skill: obj.pos_skill,
    pos_required: obj.pos_required,
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
    open_time: xss(operation.open_time),
    close_time: xss(operation.close_time),
  });

  function chooseSerialize(table){
    
    if (table==='employee'){
        return serializeEmployee;
    }
    else if(table==='position'){
        return serializePosition;
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
            return false;
    }
    return true;
}

/*
 ------------ MASS GRAB OF DATA
 */
setupRouter
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
      .catch(next);
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
          .json(serializeFunction([responseData]))
      })
      .catch(next);
  })


  /*
 ------------ SINGLE GRAB OF DATA BY ID
 */
setupRouter
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
        next();
      })
      .catch(next);
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
    
    res.json( res.data.map( serializeFunction ) );
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
        logger.info(`${req.app.get('table')} with id ${req.params.data_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })
  /* -------------------

    P A T C H /:data_id

     ------------------- */
  .patch(jsonParser, (req, res, next) => {
    const dataToUpdate = req.body;
    let numberOfValues=0;

    //I need to do this for when pos_requirements contains false
    //code in the else loop doesn't count false values.
    if(dataToUpdate.pass === undefined? false:true){
      delete dataToUpdate['pass'];
      numberOfValues = 1;
    }
    else{
      numberOfValues = Object.values(dataToUpdate).filter(Boolean).length;
    }
    
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'style' or 'content'`
        }
      });

    ScheduleService.updateData(
      req.app.get('db'),
      req.app.get('table'),
      req.params.data_id,
      dataToUpdate
    )
    .then(numRowsAffected => {
        res.
        status(204).end();
      })
      .catch(next);
  });


   /*
 ------------ MASS GRAB OF DATA BY ID
 */
setupRouter
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
      if (!data) {
        return res.status(404).json({
          error: { message: `Data Not Found` }
        });
      }
      //Save the response from the request to "res.data"
      res.data = data;
      next();
    })
    .catch(next);
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
  }));
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
          res.status(204).end();
      })
      .catch(next);
    });
    

module.exports = setupRouter;