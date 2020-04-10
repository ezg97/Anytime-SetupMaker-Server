-- first remove any data that may be present
TRUNCATE  employee;

-- insert schedule
INSERT INTO employee
  (business_id, emp_name, emp_skill)
  VALUES
  (1, 'John Diggle', 3),
  (1, 'Bruce Kent', 3),
  (1, 'Clark Wayne', 3),
  (1, 'ELijah Warrior', 2),
  (1, 'Ray Friel', 3),

  (2, 'Earl Thomas', 3),
  (2, 'John Wayne', 3),
  (2, 'Paul Washer', 3),
  
  (3, 'Colin Smith', 3);