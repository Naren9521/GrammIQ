// Fetch and display submissions when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchAndDisplaySubmissions();
});

// Function to fetch and display submissions
function fetchAndDisplaySubmissions() {
    // Fetch submissions from the API endpoint
    fetch('http://127.0.0.1:8000/get-submissions')
        .then(response => response.json())
        .then(data => {
            // Display submissions in the 'submissionsContainer'
            displaySubmissions(data.submissions);
        })
        .catch(error => console.error('Error fetching submissions:', error));
}

// Function to display submissions in the container
function displaySubmissions(submissions) {
    console.log(submissions); // Log submissions to the console

    var submissionsContainer = document.getElementById('submissionsContainer');

    // Clear previous content
    submissionsContainer.innerHTML = '';

    // Check if there are submissions
    if (submissions && submissions.length > 0) {
        // Create a table to display submissions
        var table = document.createElement('table');
        table.border = '1';

        // Create table headers
        var headers = Object.keys(submissions[0]);
        var headerRow = document.createElement('tr');

        headers.forEach(header => {
            var th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        // Create table rows for each submission
        submissions.forEach(submission => {
            var row = document.createElement('tr');

            headers.forEach(header => {
                var td = document.createElement('td');
                td.textContent = submission[header];
                row.appendChild(td);
            });

            table.appendChild(row);
        });

        // Append the table to the submissions container
        submissionsContainer.appendChild(table);
    } else {
        // Display a message if there are no submissions
        submissionsContainer.textContent = 'No submissions available.';
    }
}
