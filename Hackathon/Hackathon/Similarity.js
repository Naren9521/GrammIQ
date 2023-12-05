document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();
});

function compareTexts() {
    var textAreaValue = document.getElementById('textArea').value;
    var resultTextAreaValue = document.getElementById('resultTextArea').value;

    // Fetch API to send data to the backend
    fetch('http://127.0.0.1:8000/similar_text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text1: textAreaValue, text2: resultTextAreaValue }),
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

    if (data.similar_sentences.length > 0) {
        
        // Display overall similarity percentage
        var pOverall = document.createElement('p');
        pOverall.textContent = `Overall Similarity: ${data.overall_similarity.toFixed(2)}%`;
        resultContainer.appendChild(pOverall);

        // Display a heading for similar sentences
        var h2 = document.createElement('h2');
        h2.textContent = 'Similar Sentences';
        resultContainer.appendChild(h2);

        // Display similar sentences
        var similarSentencesList = document.createElement('ul');
        data.similar_sentences.forEach((item, index) => {
            var li = document.createElement('li');
            li.textContent = `Text-first: ${item[0]}\n||Text-Second: ${item[1]}`;
            similarSentencesList.appendChild(li);
        });

        resultContainer.appendChild(similarSentencesList);
    } else {
        var p = document.createElement('p');
        p.textContent = 'No similar sentences found.';
        resultContainer.appendChild(p);
    }
}

