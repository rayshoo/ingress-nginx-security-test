const deleteForm = document.querySelector('#deleteForm');
const textArea = document.querySelector('#textarea');

function request_delete() {
  sendProfile(deleteForm)
  .then(body => {
      let result = JSON.parse(body);
      textArea.value = `result = ${result.result}
first name = ${result.first_name}
last name = ${result.last_name}
email = ${result.email}`
    })
  .catch(error => error);
}

function sendProfile(profile) {
  const formData = new FormData();
  formData.append('first_name', profile.firstName.value);
  formData.append('last_name', profile.lastName.value);
  formData.append('email', profile.email.value);

  return fetch('/', {
      method: 'DELETE',
      body: formData
  }).then(response => response.json())
}