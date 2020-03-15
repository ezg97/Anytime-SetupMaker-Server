function business() {
    return [
    {   id: 1,
        business_name: 'G&L',
        business_password: 'Desktop97!'
    },
    {   id: 2,
        business_name: 'Mighty Fine',
        business_password: 'Desktop97!'
    },
    {   id: 3,
        business_name: 'Wendys',
        business_password: 'Desktop97!'
    },
    {   id: 4,
        business_name: 'Construction LLC',
        business_password: 'Desktop97!'
    },
    {   id: 5,
        business_name: 'Bad image <img src=\"https://url.to.file.which/does-not.exist\">. But not <strong>all</strong> bad.',
        business_password: 'Desktop97!'
    },
    {   id: 6,
        business_name: Math.random().toString(32).slice(-5) === ''? 'Test Company Inc.' : Math.random().toString(32).slice(-5),
        business_password: 'Desktop97!'
    },
    {   id: 30,
        business_name: 'To Be Deleted LLC',
        business_password: 'Desktop97!'
    }
];
}
	
////////////////////////////////////////////////////////////


function employees(){
    return [
    { emp_name: 'John Diggle',
      availability: 'FT',
      business_id: 1
    },
    { emp_name: 'Bruce Kent',
      availability: 'FT',
      business_id: 1

    },
    { emp_name: 'Clark Wayne',
      availability: 'FT',
      business_id: 1

    },
    { emp_name: 'ELijah Warrior',
      availability: 'PT',
      business_id: 1

    },
    { emp_name: 'Ray Friel',
      availability: 'FT',
      business_id: 1

    },
    { emp_name: 'Earl Thomas',
      availability: 'FT',
      business_id: 2

    },
    { emp_name: 'John Wayne',
      availability: 'PT',
      business_id: 2

    },
    { emp_name: 'Paul Washer',
      availability: 'FT',
      business_id: 2

    },
    { emp_name: 'Colin Smith',
      availability: 'FT',
      business_id: 3

    },
  ]
}

  ////////////////////////////////////////////////////////////
  
  function dayLabor(){
    return [
    { 
        time: '5AM',
        sunday: '0',
        monday: '1',
        tuesday: '1',
        wednesday: '1',
        thursday: '1',
        friday: '1',
        saturday: '0'
    },
    { 
        time: '6AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '7AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '8AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '9AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '10AM',
        sunday: '2',
        monday: '3',
        tuesday: '3',
        wednesday: '3',
        thursday: '3',
        friday: '3',
        saturday: '2'
    },
    { 
        time: '11AM',
        sunday: '2',
        monday: '0',
        tuesday: '0',
        wednesday: '0',
        thursday: '0',
        friday: '0',
        saturday: '2'
    },
]
}

////////////////////////////////////////////////////////////

function operationHours(){
    return [
    { 
        day: 'Sunday',
        open: '6AM',
        close: '11AM'
    },
    { 
        day: 'Monday',
        open: '5AM',
        close: "10AM"
    },
    { 
        day: 'Tuesday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Wednesday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Thursday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Friday',
        open: '5AM',
        close: '10AM'
    },
    { 
        day: 'Saturday',
        open: '6AM',
        close: '11AM'
    },
]
}


function maliciousBusiness() {
    const maliciousBusiness = {
           business_name: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
           business_password: 'Desktop97!'
    }

    const expectedBusiness = {   
        business_name: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
        business_password: 'Desktop97!'
    }

    const maliciousEmployees = {
        business_id: 4,   
        emp_name: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
        emp_availability: 'FT'
     }

 const expectedEmployees = {
     business_id: 4,
     emp_name: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
     emp_availability: 'FT'
 }
 
    
    return {
        maliciousBusiness,
        maliciousEmployees,
        expectedEmployees,
        expectedBusiness,
    }

}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

module.exports = { operationHours, dayLabor, employees, business, maliciousBusiness }