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
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())


    // before('cleanup', () => db('operation').truncate())

    // UNCOMMENT before('cleanup', () => db('business').truncate())


    // afterEach('cleanup', () => db('operation').truncate())

    // UNCOMMENT afterEach('cleanup', () => db('business').truncate())
    

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
              - BUSINESS: Empty Table    
      ------------------------ */
        // context(`BUSINESS: no table given`, () => {
        //   it(`responds with 200 and an empty list`, () => {
        //     return supertest(app)
        //       .get('/all')
        //       .set('Authorization', `bearer ${getAuthToken()}`)
        //       .set('table', `business`)
        //       .expect(200, [])
        //   })
        // })

        /* -----------------------
              - BUSINESS: Full Table    
      ------------------------ */
        context('BUSINESS: Given if there are businesses in the database', () => {
          const testBusiness = fixtures.business();

          // beforeEach('insert businesses', () => {
          //   return db
          //     .into('business')
          //     .insert(testBusiness)
          // })

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
      ------------------------ *//*
      context(`OPERATION: no table given`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/all')
            .set('table', `operation`)
            .expect(200, [])
        })
      })*/

      /* -----------------------
            - OPERATION: Full Table    
    ------------------------ *//*
      context('OPERATION: Given if there are operations in the database', () => {
        const testoperation = fixtures.operationHours();

        beforeEach('insert operation', () => {
          return db
            .into('operation')
            .insert(testoperation)
        })

        it('gets the business from the store', () => {
          return supertest(app)
            .get('/all')
            .set('table', `operation`)
            .expect(200, testoperation)
        })
      })
      */

    })

    /* -----------------------
              - BUSINESS: XSS Attack    
      ------------------------ */
    context(`BUSINESS: Given if there's an XSS attack`, () => {
      const { maliciousBusiness, expectedBusiness } = fixtures.maliciousBusiness()

        //console.log(maliciousBusiness)

        // beforeEach('insert malicious business', () => {
        //   return db
        //     .into('business')
        //     .insert([maliciousBusiness])
        // })

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
      /*
          it(`responds with 400 missing 'url' if not supplied`, () => {
            const newBookmarkMissingUrl = {
              title: 'test-title',
              // url: 'https://test.com',
              rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkMissingUrl)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'url' is required`)
          })
      
          it(`responds with 400 missing 'rating' if not supplied`, () => {
            const newBookmarkMissingRating = {
              title: 'test-title',
              url: 'https://test.com',
              // rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkMissingRating)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'rating' is required`)
          })
      
          it(`responds with 400 invalid 'rating' if not between 0 and 5`, () => {
            const newBookmarkInvalidRating = {
              title: 'test-title',
              url: 'https://test.com',
              rating: 'invalid',
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkInvalidRating)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'rating' must be a number between 0 and 5`)
          })
      
          it(`responds with 400 invalid 'url' if not a valid URL`, () => {
            const newBookmarkInvalidUrl = {
              title: 'test-title',
              url: 'htp://invalid-url',
              rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmarkInvalidUrl)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(400, `'url' must be a valid URL`)
          })
      
          it('adds a new bookmark to the store', () => {
            const newBookmark = {
              title: 'test-title',
              url: 'https://test.com',
              description: 'test description',
              rating: 1,
            }
            return supertest(app)
              .post(`/bookmarks`)
              .send(newBookmark)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(201)
              .expect(res => {
                expect(res.body.title).to.eql(newBookmark.title)
                expect(res.body.url).to.eql(newBookmark.url)
                expect(res.body.description).to.eql(newBookmark.description)
                expect(res.body.rating).to.eql(newBookmark.rating)
                expect(res.body).to.have.property('id')
              })
              .then(res =>
                supertest(app)
                  .get(`/bookmarks/${res.body.id}`)
                  .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                  .expect(res.body)
              )
          })
      
          it('removes XSS attack content from response', () => {
            const { maliciousBookmark, expectedBookmark } = fixtures.makeMaliciousBookmark()
            return supertest(app)
              .post(`/bookmarks`)
              .send(maliciousBookmark)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(201)
              .expect(res => {
                expect(res.body.title).to.eql(expectedBookmark.title)
                expect(res.body.description).to.eql(expectedBookmark.description)
              })
          })*/
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
            const { maliciousBusiness, expectedBusiness } = fixtures.maliciousBusiness()
      
            // beforeEach('insert malicious business', () => {
            //   return db
            //     .into('business')
            //     .insert([maliciousBusiness])
            // })
      
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
            const testBusiness = fixtures.business()

            
            // after('reset buisness_name', () => {
            //   return db
            //     .into('business')
            //     .update('')
            // })

            it('Updates the business by ID from the store', () => {
              //randomly generate a name
              //const randomName =  Math.random().toString(32).slice(-5);
              //chose id to update
              const idToUpdate = 6;
              //create revision data
              const revision={ 'business_name': testBusiness[5].business_name  }
              //locate and store the data related to the id
              let expectedBusiness = testBusiness.filter(bs => bs.id === idToUpdate);

              expectedBusiness = expectedBusiness[0]
              //secure the id from the list
              const {id, business_name} = expectedBusiness;

              expectedBusiness =[ {id, business_name} ];


              //use the spread operator to combine the "expected info" with the "revised info"
              //expectedBusiness = {...expectedBusiness, ... revision};


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
          it(`responds 404 when business doesn't exist`, () => {
            return supertest(app)
              .get(`/business/123`)
              .set('Authorization', `bearer ${getAuthToken()}`)
              .set('table', `employee`)
              .expect(404, {
                error: { message: `Data Not Found` }
              })
          })
        })
    
        context('BUSINESS: Given if id exists', () => {
          const testEmployees = fixtures.employees()
    
          // beforeEach('insert business', () => {
          //   return db
          //     .into('business')
          //     .insert(testBusiness)
          // })
    
          it('responds with 200 and the specified business', () => {
            const businessId = 3
            const expectedEmployees = testEmployees.filter(emp => emp.business_id === businessId)
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
              .expect(404, {
                error: { message: `Data Not Found` }
              })
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