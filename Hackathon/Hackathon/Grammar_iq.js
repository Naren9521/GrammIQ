function redirectToSpell() {
    window.location.href = 'spell.html';
}
function rediretToSubmission(){
    window.location.href = 'Submission.html';
}
function rediretToLogin(){
    window.location.href = 'login_page.html';
}
function showSimilarityOptions() {
    var similarityOptions = document.getElementById('similarityOptions');
    similarityOptions.style.display = 'block';
}

function checkSimilarity() {
    var similarityType = document.getElementById('similarityType').value;

    if (similarityType === 'text') {
        window.location.href = 'Similarity.html';
    } else if (similarityType === 'class') {
        window.location.href = 'Checkwithclass.html'
        console.log('Checking similarity within a class...');
    }

    // Optionally, you can hide the similarity options after making a selection
    var similarityOptions = document.getElementById('similarityOptions');
    similarityOptions.style.display = 'none';
}