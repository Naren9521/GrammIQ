document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();
    compareTexts();
});

function compareTexts() {
    var textAreaValue = document.getElementById('textArea').value;

    // Fetch API to send data to the backend
    fetch('http://127.0.0.1:8000/similar_text_class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text1: textAreaValue }),
    })
    .then(response => response.json())
    .then(data => {
        // Displaying result 
        displayResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResults(data) {
    var resultContainer = document.getElementById('resultContainer');

    // Clearing previous results
    resultContainer.innerHTML = '';

    if (data.most_similar_text) {
        
        // Display most similar text and its name
        var pMostSimilar = document.createElement('p');
        pMostSimilar.textContent = `Most Similar Text (Name: ${data.most_similar_name}): ${data.most_similar_text}`;
        resultContainer.appendChild(pMostSimilar);

        // Display overall similarity percentage
        var pOverall = document.createElement('p');
        pOverall.textContent = `Overall Similarity: ${data.overall_similarity.toFixed(2)}%`;
        resultContainer.appendChild(pOverall);

    } else {
        var p = document.createElement('p');
        p.textContent = 'No similar text found in the database.';
        resultContainer.appendChild(p);
    }
}
