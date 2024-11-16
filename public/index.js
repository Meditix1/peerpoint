fetch('/getTestData')
    .then(response => {
      console.log(response)
        
    })
    .catch(error => {
      console.error('Error ', error);
    });
