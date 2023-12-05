function submitForm() {
    // Get form data
    var name = document.getElementById('name').value;
    var rollNumber = document.getElementById('rollNumber').value;
    var textAreaValue = document.getElementById('textArea').value;
    var formData = {
        name: name,
        rollNumber: rollNumber,
        textAreaValue: textAreaValue
    };

    // Send the data to the submission API
    sendToSubmissionAPI(formData);
}
function sendToSubmissionAPI(data) {
    // Assuming you have an API endpoint named 'submission-api'
    var apiUrl = 'http://127.0.0.1:8000/submission-api';

    // Perform a POST request to the API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Submission successful:', result);
        showSubmissionMessage('Your work has been submitted successfully!');
    })
    .catch(error => {
        console.error('Error submitting data:', error);
        showSubmissionMessage('Error submitting your work. Please try again.');
    });
}
function showSubmissionMessage(message) {
    // Create a message element
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.color = 'green'; // You can customize the style
    
    // Append the message to the body or any specific container
    document.body.appendChild(messageElement);

    // Optionally, you can remove the message after a certain period
    setTimeout(function () {
        document.body.removeChild(messageElement);
    }, 5000); // 5000 milliseconds (adjust as needed)
}