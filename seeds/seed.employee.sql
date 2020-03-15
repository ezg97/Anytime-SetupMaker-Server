-- first remove any data that may be present
TRUNCATE  employee;

-- insert schedule
INSERT INTO employee
  (business_id, emp_name, emp_availability)
  VALUES
  (1, 'John Diggle', 'FT'),
  (1, 'Bruce Kent', 'FT'),
  (1, 'Clark Wayne', 'FT'),
  (1, 'ELijah Warrior', 'PT'),
  (1, 'Ray Friel', 'FT'),

  (2, 'Earl Thomas', 'FT'),
  (2, 'John Wayne', 'FT'),
  (2, 'Paul Washer', 'FT'),
  
  (3, 'Colin Smith', 'FT');