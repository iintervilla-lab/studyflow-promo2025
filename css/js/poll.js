// Fichier: css/js/poll.js

document.addEventListener('DOMContentLoaded', () => {
    const pollContainer = document.getElementById('poll-container');

    if (pollContainer) {
        // Exemple de données de sondage (peut être chargé depuis db.json ou une API)
        const pollData = {
            question: 'Quel est votre langage de programmation préféré ?',
            options: [
                { id: 'js', text: 'JavaScript', votes: 0 },
                { id: 'py', text: 'Python', votes: 0 },
                { id: 'java', text: 'Java', votes: 0 },
                { id: 'csharp', text: 'C#', votes: 0 }
            ]
        };

        function renderPoll() {
            pollContainer.innerHTML = `
                <div class="poll-question">${pollData.question}</div>
                <div class="poll-options">
                    ${pollData.options.map(option => `
                        <button class="poll-option-button" data-option-id="${option.id}">
                            ${option.text} (<span id="votes-${option.id}">${option.votes}</span> votes)
                        </button>
                    `).join('')}
                </div>
                <div class="poll-results" style="display:none;"></div>
            `;

            document.querySelectorAll('.poll-option-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const optionId = event.target.dataset.optionId;
                    handleVote(optionId);
                });
            });
        }

        function handleVote(optionId) {
            const option = pollData.options.find(opt => opt.id === optionId);
            if (option) {
                option.votes++;
                renderPoll(); // Re-render to update vote count
                displayResults();
            }
        }

        function displayResults() {
            const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
            const resultsDiv = pollContainer.querySelector('.poll-results');
            resultsDiv.innerHTML = `
                <h3>Résultats:</h3>
                ${pollData.options.map(option => `
                    <p>${option.text}: ${option.votes} votes (${totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0}%)</p>
                `).join('')}
            `;
            resultsDiv.style.display = 'block';
        }

        renderPoll();
    }
});
