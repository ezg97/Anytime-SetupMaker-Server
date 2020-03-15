TRUNCATE schedule;

INSERT INTO schedule
  (emp_name, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
  VALUES 
    ('John Diggle', '6 AM - 4 PM', '9 AM - 3 PM', '11 AM - 8 PM', '7 AM - 5 PM', '8 AM - 12 PM', '6 AM - 4 PM', '9 AM - 3 PM'),
    ('Bruce Kent', '4 PM - 10 PM', '9 AM - 5 PM', '1 PM - 9 PM', '9 AM - 2 PM', '6 AM - 5 PM', '6 AM - 4 PM', '9 AM - 3 PM'),
    ('Clark Wayne', '10 AM - 10 PM', '11 AM - 4 PM', '10 AM - 9 PM', '10 AM - 9 PM', '9 AM - 2 PM', '6 AM - 4 PM', '9 AM - 3 PM');