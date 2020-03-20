-- first remove any data that may be present
TRUNCATE  employee;

-- insert schedule
INSERT INTO employee
  (business_id, emp_name, pos_importance, pos_skill)
  VALUES
  (1, 'John Diggle', 3,1),
  (1, 'Bruce Kent', 3,1),
  (1, 'Clark Wayne', 3,1),
  (1, 'ELijah Warrior', 2,4),
  (1, 'Ray Friel', 3,1),

  (2, 'Earl Thomas', 3,1),
  (2, 'John Wayne', 3,1),
  (2, 'Paul Washer', 3,1),
  
  (3, 'Colin Smith', 3,1);