/*
Instructions:
1) Create the user 'dunder-mifflin' WITH the password: 'password' 
2) Create a database named 'test_setup'
3) Create two tables:
     A) Run Migration 1 AND migration 2
     B) Seed the info for the above tables
4) Run the test and all 18 will pass
*/

const knex = require('knex');

const fixtures = require('./anytime-fixtures');


const app = require('../src/app');

let authToken = 0;

saveAuthToken = (token) => {
  authToken = token;
}

getAuthToken = () => {
  return authToken;
}


describe('Anytime Scheduler Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    
    /* ------------------------

              POST /auth/login 

      ------------------------ */
      describe('POST /api/auth/login', () => {

        /* -----------------------
              - LOGIN: Successful login    
      ------------------------ */

        let businessInfo = fixtures.business();
        // const { business_name, business_password } = businessInfo[0];
        businessInfo = businessInfo[0];
         const userInfo = { 'user_name': businessInfo.business_name, 'password': businessInfo.business_password }


        context(`User Login accepted`, () => {

          it(`responds with 200 and an auth token`, () => {

            return supertest(app)
              .post('/api/auth/login')
              .send(userInfo)
              .set('content-type', `application/json`)
              .expect(200)
              .expect(res => {
                saveAuthToken(res.body.authToken);
              });
          });
          
        });

      });


    /* ------------------------

              GET / 
              
      ------------------------ */
    describe('App', () => {
        it('GET / responds with 200 containing "Hello, world!"', () => {
          return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
        })
    });


    /* ------------------------

              GET /all 

      ------------------------ */
    describe('GET /all', () => {

        /* -----------------------
              - BUSINESS: Full Table    
      ------------------------ */
        context('BUSINESS: Given if there are businesses in the database', () => {
          const testBusiness = fixtures.business();

          it('gets the business from the store', () => {
            return supertest(app)
              .get('/all')
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `business`)
              .expect(200)
              .expect( res => {
                res.body.forEach( (obj, index) => {
                    //verify each name, except for "id: 6", bc it's name changes randomly with each test
                    if(obj.id != 6){
                      expect(obj.business_name).to.eql(testBusiness[index].business_name)
                    }
                  })
               
              })
          })
        })


        /* -----------------------
              - OPERATION: Empty Table    
      ------------------------ */

    

    })

    /* -----------------------
              - BUSINESS: XSS Attack    
      ------------------------ */
    context(`BUSINESS: Given if there's an XSS attack`, () => {
      const { expectedBusiness } = fixtures.maliciousBusiness();

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/all`)
            .set('Authorization', `bearer ${getAuthToken()}`)
            .set('table', `business`)
            .expect(200)
            .expect(res => {
              expect(res.body[4].business_name).to.eql(expectedBusiness.business_name)
            })
        })
      
    })
    /* ******************************************************************************* */




    /* ------------------------

              POST /all 

      ------------------------ */
      describe('POST /all', () => {
          /* -----------------------
                 - BUSINESS: Missing Business Name    
          ------------------------ */
          it(`responds with 400 missing 'name' if not supplied`, () => {
            const newBusinessMissingName = {
              // business_name: 'name',
            }
            return supertest(app)
              .post(`/all`)
              .send(newBusinessMissingName)
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `business`)
              .expect(400, `Empty request body`)
          })
      
        })
        /* ******************************************************************************* */




    /* ------------------------

              G E T /:data_id 

      ------------------------ */
      describe('GET /data_id', () => {

          /* -----------------------
                 - BUSINESS: Id doesn't exist    
          ------------------------ */
          context(`BUSINESS: Given if id doesn't exist`, () => {
            it(`responds 404 when business doesn't exist`, () => {
              return supertest(app)
                .get(`/123`)
                .send()
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(404, {
                  error: { message: `Data Not Found` }
                })
                
            })
          })
          
          /* -----------------------
                 - BUSINESS: Id exists   
          ------------------------ */
          context('BUSINESS: Given if id exists', () => {
            const testBusiness = fixtures.business()
      
            // beforeEach('insert business', () => {
            //   return db
            //     .into('business')
            //     .insert(testBusiness)
            // })
      
            it('responds with 200 and the specified business', () => {
              const businessId = 2
              const {id, business_name} = testBusiness[businessId - 1];
              const expectedBusiness =[ {id, business_name} ];

              return supertest(app)
                .get(`/${businessId}`)
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(200)
                .expect(res => {
                  expect(res.body[0].business_name).to.eql(expectedBusiness[0].business_name)
                })
            })
          })
      
          /* -----------------------
                 - BUSINESS: XSS attack    
          ------------------------ */
          context(`BUSINESS: Given if there's an XSS attack`, () => {
            const { expectedBusiness } = fixtures.maliciousBusiness();
      
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/5`)
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(200)
                .expect(res => {
                  expect(res.body[0].business_name).to.eql(expectedBusiness.business_name)
                })
            })
          })
      })
      /* ******************************************************************************* */




    /* ------------------------

              D E L E T E /:data_id 

      ------------------------ */
      describe('DELETE /:data_id', () => {

        /* -----------------------
                 - BUSINESS: Id doesn't exist    
          ------------------------ */
          context(`BUSINESS: Given if id doesn't exist`, () => {
            it(`responds 404 whe business doesn't exist`, () => {
              return supertest(app)
                .delete(`/123`)
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(404, {
                  error: { message: `Data Not Found` }
                })
            })
          })

          /* -----------------------
                 - BUSINESS: Id exists    
          ------------------------ */
          context('BUSINESS: Given if ID exists', () => {
            

            const testBusiness = { business_name: 'To Be Deleted LLC', business_password: 'Desktop97!'}
            let idToRemove = 0;

            after('insert business', () => {
              return db
                .into('business')
                .insert(testBusiness)
            })

            it('gets the business from the store', () => {
              return supertest(app)
                .get('/all')
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(200)
                .expect( res => {
                  res.body.filter(obj => {
                    if(obj.business_name === testBusiness.business_name){
                      idToRemove = obj.id;
                      expect(obj.business_name).to.eql(testBusiness.business_name)

                    }
                  })

                })
            })

      
            it('removes the business by ID from the store', () => {
              return supertest(app)
                .delete(`/${idToRemove}`)
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(204)
                .then(() =>
                  supertest(app)
                    .get(`/all`)
                    .set('Authorization', `bearer ${getAuthToken()}`)
                    .set('table', `business`)
                    .expect(200)
                )
            })
          })
      })
      /* ******************************************************************************* */




    /* ------------------------

              P A T C H /:data_id 

      ------------------------ */
      describe('PATCH /:data_id', () => {

        /* -----------------------
                 - BUSINESS: Id doesn't exist   
          ------------------------ */
        context(`BUSINESS: Given if id doesn't exist`, () => {
          it(`responds 404 whe business doesn't exist`, () => {
            return supertest(app)
              .patch(`/255`)
              .send( { business_name: "Chocolate" } )
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `business`)
              .expect(404, {
                error: { message: `Data Not Found` }
              })
          })
        })

        /* -----------------------
                 - BUSINESS: Id exists   
          ------------------------ */
          context('BUSINESS: Given if ID exists', () => {
            const testBusiness = fixtures.business();

            it('Updates the business by ID from the store', () => {
              //randomly generate a name
              //const randomName =  Math.random().toString(32).slice(-5);
              //chose id to update
              const idToUpdate = 6;
              //create revision data
              const revision={ 'business_name': testBusiness[5].business_name  }
              //locate and store the data related to the id
              let expectedBusiness = testBusiness.filter(bs => bs.id === idToUpdate);

              expectedBusiness = expectedBusiness[0];
              //secure the id from the list
              const {id, business_name} = expectedBusiness;

              expectedBusiness =[ {id, business_name} ];

              return supertest(app)
                .patch(`/${idToUpdate}`)
                .send( revision )
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `business`)
                .expect(204)
                .then(() =>
                  supertest(app)
                    .get(`/${idToUpdate}`)
                    .set('Authorization', `bearer ${getAuthToken()}`)
                    .set('table', `business`)
                    .expect(expectedBusiness)
                )
            })
          })
    })
      
      /* ******************************************************************************* */


    /* ------------------------

              G E T /business/:business_id 

      ------------------------ */
      
      describe('GET /business/:business_id', () => {
        //every table besides business has a business id endpoint
        
        context(`BUSINESS: Given if business_id doesn't exist`, () => {
          it(`responds 200 and empty list when business doesn't exist`, () => {
            return supertest(app)
              .get(`/business/123`)
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `employee`)
              .expect(200);
          });
        })
    
        context('BUSINESS: Given if id exists', () => {
          const testEmployees = fixtures.employees()
    
          it('responds with 200 and the specified business', () => {
            const businessId = 3;
            const expectedEmployees = testEmployees.filter(emp => emp.business_id === businessId);

            return supertest(app)
              .get(`/business/${businessId}`)
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `employee`)
              .expect(res=> {
                expect(res.body[0].emp_name).to.eql(expectedEmployees[0].emp_name);              
              }) 
              
          })
        })
    
        context(`BUSINESS: Given if there's an XSS attack`, () => {
          const { maliciousEmployees, expectedEmployees } = fixtures.maliciousBusiness()
    
          beforeEach('insert malicious employees', () => {
            return db
              .into('employee')
              .insert([maliciousEmployees])
          })
          it('removes XSS attack content', () => {
            return supertest(app)
              .get(`/business/${maliciousEmployees.business_id}`)
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `employee`)
              .expect(200)
              .expect(res => {
                expect(res.body[0].emp_name).to.eql(expectedEmployees.emp_name);
              })
          })
        })
    })

      /* ******************************************************************************* */


    /* ------------------------

              D E L E T E /business/:business_id 

      ------------------------ */
      
      describe('DELETE /business/:business_id ', () => {
        //only business doesn't have this endpoinht
        context(`BUSINESS: Given if id doesn't exist`, () => {
          it(`responds 404 when business doesn't exist`, () => {
            return supertest(app)
              .delete(`/business/999`)
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `employee`)
              .expect(204);
          })
        })

        it('removes the business by business_id from the store and makes a request to the same endpoint grabbing all the employees', () => {

          const expectedEmployees = fixtures.employees();

          return supertest(app)
            .delete(`/business/4`)
            .set('Authorization', `bearer ${getAuthToken()}`)
            .set('table', `employee`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/all`)
                .set('Authorization', `bearer ${getAuthToken()}`)
                .set('table', `employee`)
                .expect(200)
                .expect(res => {
                  res.body.forEach( (obj,index) => {
                    expect(obj.emp_name).to.eql(expectedEmployees[index].emp_name);
                  })
                })
            )
        })
    })
    

});