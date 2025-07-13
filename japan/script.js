let mode = 'hiragana';
let currentWord = {};
let wordsData = {};
let stats = {
  correct: 0,
  incorrect: 0,
  streak: 0,
  bestStreak: 0
};

// Load words data from JSON
fetch('japan/words.json')
  .then(response => response.json())
  .then(data => {
    wordsData = data;
    console.log('Words loaded:', wordsData);
    setMode('hiragana');
  })
  .catch(error => {
    console.error('Error loading words:', error);
    // Fallback data if JSON fails to load
    wordsData = {
      hiraganaWords: [
        {"kana": "あかい", "romaji": "akai", "meaning": "red"},
        {"kana": "あおい", "romaji": "aoi", "meaning": "blue"},
        {"kana": "あたらしい", "romaji": "atarashii", "meaning": "new"}
      ],
      katakanaWords: [
        {"kana": "アメリカ", "romaji": "amerika", "meaning": "America"},
        {"kana": "コンピューター", "romaji": "konpyuutaa", "meaning": "computer"},
        {"kana": "インターネット", "romaji": "intaanetto", "meaning": "internet"}
      ]
    };
    setMode('hiragana');
  });

function setMode(selectedMode) {
  // Only change mode if explicitly requested
  mode = selectedMode;
  
  // Update button states
  document.querySelectorAll('.mode-selector button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`button[onclick="setMode('${selectedMode}')"]`).classList.add('active');
  
  // Reset stats for new mode
  resetStats();
  
  // Clear any existing feedback and input
  clearFeedback();
  document.getElementById('answer').value = '';
  
  // Show first word in the selected mode
  nextWord();
  
  // Focus on input
  document.getElementById('answer').focus();
}

function nextWord() {
  // Always use the currently selected mode
  if (!wordsData || !wordsData[mode + 'Words']) {
    console.error('Words data not loaded yet for mode:', mode);
    return;
  }
  
  // Get words only from the current mode
  const wordList = wordsData[mode + 'Words'];
  
  if (!wordList || wordList.length === 0) {
    console.error('No words available for mode:', mode);
    return;
  }
  
  // Select random word from the current mode's word list
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];
  const wordElement = document.getElementById('word');
  wordElement.textContent = currentWord.kana;
  
  // Add hover functionality to show answer
  wordElement.onmouseenter = function() {
    this.setAttribute('data-original', this.textContent);
    this.innerHTML = `
      <div style="font-size: 0.6em; color: #64b5f6; margin-bottom: 0.5em;">
        Romaji: ${currentWord.romaji}
      </div>
      <div style="font-size: 0.6em; color: #fbbf24;">
        Meaning: ${currentWord.meaning}
      </div>
    `;
    this.style.fontSize = '2em';
  };
  
  wordElement.onmouseleave = function() {
    this.textContent = this.getAttribute('data-original');
    this.style.fontSize = '3.5em';
  };
  
  // Clear previous feedback and input
  clearFeedback();
  document.getElementById('answer').value = '';
  document.getElementById('answer').focus();
}

function checkAnswer() {
  const userInput = document.getElementById('answer').value.trim().toLowerCase();
  const feedbackElement = document.getElementById('feedback');
  
  if (!userInput) {
    feedbackElement.textContent = "Please enter an answer!";
    feedbackElement.className = 'incorrect';
    return;
  }
  
  const correctRomaji = currentWord.romaji.toLowerCase();
  const correctMeaning = currentWord.meaning.toLowerCase();
  
  if (userInput === correctRomaji || userInput === correctMeaning) {
    feedbackElement.innerHTML = `
      <div>✅ Correct!</div>
      <div style="font-size: 0.9em; margin-top: 0.5em;">
        <strong>Romaji:</strong> ${currentWord.romaji}<br>
        <strong>Meaning:</strong> ${currentWord.meaning}
      </div>
    `;
    feedbackElement.className = 'correct';
    
    // Update stats
    stats.correct++;
    stats.streak++;
    if (stats.streak > stats.bestStreak) {
      stats.bestStreak = stats.streak;
    }
    
    // Auto-advance after a delay - stays in same mode
    setTimeout(() => {
      nextWord();
    }, 2000);
    
  } else {
    feedbackElement.innerHTML = `
      <div>❌ Incorrect</div>
      <div style="font-size: 0.9em; margin-top: 0.5em;">
        <strong>Romaji:</strong> ${currentWord.romaji}<br>
        <strong>Meaning:</strong> ${currentWord.meaning}
      </div>
    `;
    feedbackElement.className = 'incorrect';
    
    // Update stats
    stats.incorrect++;
    stats.streak = 0;
  }
  
  updateStatsDisplay();
}

function skipWord() {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.innerHTML = `
    <div>⏭️ Skipped</div>
    <div style="font-size: 0.9em; margin-top: 0.5em;">
      <strong>Romaji:</strong> ${currentWord.romaji}<br>
      <strong>Meaning:</strong> ${currentWord.meaning}
    </div>
  `;
  feedbackElement.className = 'incorrect';
  
  stats.streak = 0;
  updateStatsDisplay();
  
  // Skip to next word in the same mode
  setTimeout(() => {
    nextWord();
  }, 2000);
}

function clearFeedback() {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.textContent = '';
  feedbackElement.className = '';
}

function resetStats() {
  stats = {
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0
  };
  updateStatsDisplay();
}

function updateStatsDisplay() {
  document.getElementById('correct-count').textContent = stats.correct;
  document.getElementById('incorrect-count').textContent = stats.incorrect;
  document.getElementById('current-streak').textContent = stats.streak;
  document.getElementById('best-streak').textContent = stats.bestStreak;
  
  const accuracy = stats.correct + stats.incorrect > 0 
    ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) 
    : 0;
  document.getElementById('accuracy').textContent = accuracy + '%';
}

// Handle Enter key press and real-time checking
document.addEventListener('DOMContentLoaded', function() {
  const answerInput = document.getElementById('answer');
  
  answerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });
  
  // Real-time answer checking
  answerInput.addEventListener('input', function(e) {
    const userInput = e.target.value.trim().toLowerCase();
    if (!userInput || !currentWord.romaji) return;
    
    const correctRomaji = currentWord.romaji.toLowerCase();
    const correctMeaning = currentWord.meaning.toLowerCase();
    
    // Check if the input matches exactly
    if (userInput === correctRomaji || userInput === correctMeaning) {
      // Small delay to show the complete word before auto-advancing
      setTimeout(() => {
        showCorrectFeedback();
        stats.correct++;
        stats.streak++;
        if (stats.streak > stats.bestStreak) {
          stats.bestStreak = stats.streak;
        }
        updateStatsDisplay();
        
        // Auto-advance to next word in the same mode
        setTimeout(() => {
          nextWord();
        }, 1000);
      }, 200);
    }
  });
  
  // Initialize stats display
  updateStatsDisplay();
});

function showCorrectFeedback() {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.innerHTML = `
    <div>✅ Correct! Auto-advancing...</div>
    <div style="font-size: 0.9em; margin-top: 0.5em;">
      <strong>Romaji:</strong> ${currentWord.romaji}<br>
      <strong>Meaning:</strong> ${currentWord.meaning}
    </div>
  `;
  feedbackElement.className = 'correct';
}

// Initialize when page loads
window.onload = () => {
  // Mode will be set once words are loaded
};