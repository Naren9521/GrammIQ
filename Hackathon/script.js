document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var textValue = document.getElementById('textArea').value;

    // Hitting the API
    fetch('http://127.0.0.1:8000/grammar_correct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textValue }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);

        // Format and display the result
        var resultTextArea = document.getElementById('resultTextArea');
        resultTextArea.value = formatResult(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error processing your request. Please check the console for more details.');
    });
});

function formatResult(data) {
    // Check if there are errors in the response
    if (data.errors && data.errors.length > 0) {
        // Format errors and suggestions
        var formattedResult = data.errors.map(error => {
            return `Sentence: ${error.sentence}\nError: ${error.error}\nSuggestions: ${error.suggestions.join(', ')}\n\n`;
        }).join('');

        return formattedResult;
    } else {
        return 'No grammar errors found.';
    }
}
