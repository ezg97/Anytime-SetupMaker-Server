# Anytime Scheduler Server

Live Site: [Anytime Scheduler](https://anytime-scheduler-client.now.sh/)

## Description
Create an account or login if you're an existing user, then add, edit, or delete users from your company, edit the hours of operation, and the labor (amount of employees working per hour). The info you provide will allow the application to generate a weekly schedule that adheres to your specifications. 

## Technologies Used
This backend api/database uses Node JS/Express/PostgreSQL/Mocha/Chai for the managing of the database and the server.
The client side repo can be found here: https://github.com/ezg97/Anytime-Scheduler-Client


## API Endpoints:

### 1. **User Login**
#### Returns a JWT for use as authentication throughout the application, **if** the user info provided is a valid account
- URL: /api/auth/login

- Method: POST

- Query Params: None

- JSON inputs (parameters): `{ user_name: <user_name>, password: <password> }`

- JSON outputs (parameters): `{ authToken: <token>, id: <number> }`

### 2. **User Signup**
#### Creates the user account and makes a request to the /login endpoint once created, **if** the user info provided is a valid and doesn't already exist
- URL: /api/users/

- Method: POST

- Query Params: None

- JSON inputs (parameters): `{ user_name: <user_name>, password: <password> }`

- JSON outputs (parameters): response object (use `res.status` to verify if login was successful).

------
### All of the following endpoints are protected and must first pass through authorization middleware.
------

### 3. **GET Info**
#### GETS all the info a table (from the header)
- URL: /all

- Method: GET

- Query Params: None

- JSON inputs (parameters): None

- JSON outputs (parameters): Returns all the info from a table
  `{ id: <integer>, business_name: <string>, business_password: <string>, ... }`

### 4. **POST Info**
#### POSTS info (from body) to a table name (from the header)
- URL: /all

- Method: POST

- Query Params: None

- Headers: `Authorization: Bearer <token> and table: <table_name>`

- JSON inputs (parameters): The info you wish to add to the table, changes per table. The keys represent the columns and the values represent the data stored in the row
  `{ <column_1>: <row_value>, <column_2>: <row_value>, <column_3>: <row_value>, etc. }`

- JSON outputs (parameters): Returns the data that was posted to the table
  `{ <column_1>: <row_value>, <column_2>: <row_value>, <column_3>: <row_value>, etc. }`

### 5. **GET Info**
#### GETS a single row by id (params) from a table (header) and returns to the client
- URL: /:data_id

- Method: GET

- Query Params: id (integer)

- Headers: `Authorization: Bearer <token> and table: <table_name>`

- JSON inputs (parameters): None

- JSON outputs (parameters): Returns the row that's id matches the query parameter
  `{ <column_1>: <row_value>, etc. }`


### 6. **DELETES Info**
#### DELETES a single row by id (params) from a table (header).
- URL: /:data_id

- Method: DELETE

- Query Params: id (integer)

- Headers: `Authorization: Bearer <token> and table: <table_name>`

- JSON inputs (parameters): None

- JSON outputs (parameters): None (only a 204 status code is successful).


### 7. **PATCHES info**
#### PATCHES a single row by id (params) from a table (header).
- URL: /:data_id

- Method: PATCH

- Query Params: id (integer)

- JSON inputs (parameters): The info you wish to patch to the row
  `{ <column_1>: <row_value>, etc. }`

- JSON outputs (parameters): None (only a 204 status code is successful).

### 8. **GETS info**
#### GETS a single row by the business_id (params) from a table (header).
- URL: /business/:business_id

- Method: GET

- Query Params: id (integer)

- JSON inputs (parameters): None

- JSON outputs (parameters): Returns the row that's id matches the query parameter
  `{ <column_1>: <row_value>, etc. }`


### 9. **DELETES info**
#### DELETES a single row by the business_id (params) from a table (header).
- URL: /business/:business_id

- Method: DELETE

- Query Params: id (integer)

- Headers: `Authorization: Bearer <token> and table: <table_name>`

- JSON inputs (parameters): None

- JSON outputs (parameters): None (only a 204 status code is successful).

