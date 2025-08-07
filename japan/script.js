let mode = 'hiragana';
let currentWord = {};
let wordsData = {};
let stats = {
  correct: 0,
  incorrect: 0,
  streak: 0,
  bestStreak: 0,
  totalTypingTime: 0,
  totalCharacters: 0
};
let wordStartTime = null;
let recentlyAskedWords = []; // Track recently asked words
const HISTORY_SIZE = 100; // Don't repeat words for 100 words

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
  
  // Clear recently asked words when switching modes
  recentlyAskedWords = [];
  
  // Clear any existing feedback and input
  clearFeedback();
  clearLastWord();
  document.getElementById('answer').value = '';
  
  // Show first word in the selected mode
  nextWord();
  
  // Focus on input
  document.getElementById('answer').focus();
}

function isHiragana(char) {
  return char >= '\u3040' && char <= '\u309F';
}

function isKatakana(char) {
  return char >= '\u30A0' && char <= '\u30FF';
}

function isPureHiragana(text) {
  for (let char of text) {
    if (char >= '\u3040' && char <= '\u30FF') { // Japanese characters
      if (!isHiragana(char)) {
        return false;
      }
    }
  }
  return true;
}

function isPureKatakana(text) {
  for (let char of text) {
    if (char >= '\u3040' && char <= '\u30FF') { // Japanese characters
      if (!isKatakana(char)) {
        return false;
      }
    }
  }
  return true;
}

function nextWord() {
  // Always use the currently selected mode
  if (!wordsData || !wordsData[mode + 'Words']) {
    console.error('Words data not loaded yet for mode:', mode);
    return;
  }
  
  // Get words only from the current mode
  let wordList = wordsData[mode + 'Words'];
  
  if (!wordList || wordList.length === 0) {
    console.error('No words available for mode:', mode);
    return;
  }
  
  // Filter words to ensure they match the selected script
  if (mode === 'hiragana') {
    wordList = wordList.filter(word => isPureHiragana(word.kana));
  } else if (mode === 'katakana') {
    wordList = wordList.filter(word => isPureKatakana(word.kana));
  }
  
  if (wordList.length === 0) {
    console.error('No pure', mode, 'words available');
    return;
  }
  
  // Filter out recently asked words
  let availableWords = wordList.filter(word => 
    !recentlyAskedWords.some(recentWord => recentWord.kana === word.kana)
  );
  
  // If all words have been recently asked, use the full list
  if (availableWords.length === 0) {
    console.log('All words recently asked, resetting history');
    recentlyAskedWords = [];
    availableWords = wordList;
  }
  
  // Select random word from the available words
  currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  
  // Add to recently asked words
  recentlyAskedWords.push(currentWord);
  
  // Keep only the last HISTORY_SIZE words
  if (recentlyAskedWords.length > HISTORY_SIZE) {
    recentlyAskedWords.shift(); // Remove the oldest word
  }
  
  // Debug log to verify correct mode and history
  console.log('Current mode:', mode, 'Selected word:', currentWord.kana, 'History size:', recentlyAskedWords.length);
  
  const wordElement = document.getElementById('word');
  wordElement.textContent = currentWord.kana;
  
  // Start timing when new word is shown
  wordStartTime = Date.now();
  
  // Track if word is currently revealed
  let isRevealed = false;
  
  // Add hover functionality for desktop
  wordElement.onmouseenter = function() {
    if (!isRevealed) {
      showAnswer();
    }
  };
  
  wordElement.onmouseleave = function() {
    if (!isRevealed) {
      hideAnswer();
    }
  };
  
  // Add click functionality for mobile
  wordElement.onclick = function() {
    if (isRevealed) {
      hideAnswer();
      isRevealed = false;
    } else {
      showAnswer();
      isRevealed = true;
    }
  };
  
  function showAnswer() {
    wordElement.innerHTML = `
      <div style="font-size: 0.6em; color: #64b5f6; margin-bottom: 0.5em;">
        Romaji: ${currentWord.romaji}
      </div>
      <div style="font-size: 0.6em; color: #fbbf24;">
        Meaning: ${currentWord.meaning}
      </div>
    `;
  }
  
  function hideAnswer() {
    wordElement.textContent = currentWord.kana;
  }
  
  // Clear previous feedback and input
  clearFeedback();
  document.getElementById('answer').value = '';
  document.getElementById('answer').focus();
}

function calculateTypingTime(userInput) {
  if (wordStartTime) {
    const typingTime = Date.now() - wordStartTime;
    const characterCount = userInput.length;
    
    stats.totalTypingTime += typingTime;
    stats.totalCharacters += characterCount;
    
    wordStartTime = null; // Reset for next word
  }
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
    feedbackElement.innerHTML = `<div>✅ Correct!</div>`;
    feedbackElement.className = 'correct';
    
    // Calculate typing time
    calculateTypingTime(userInput);
    
    // Update last word section
    updateLastWordSection(currentWord);
    
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
    
    // Reset timing for incorrect answers
    wordStartTime = null;
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

function updateLastWordSection(word) {
  const lastWordInfo = document.getElementById('last-word-info');
  lastWordInfo.innerHTML = `
    <span class="kana">${word.kana}</span> → 
    <span class="romaji">${word.romaji}</span> → 
    <span class="meaning">${word.meaning}</span>
  `;
}

function clearLastWord() {
  const lastWordInfo = document.getElementById('last-word-info');
  lastWordInfo.innerHTML = '';
}

function resetStats() {
  stats = {
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0,
    totalTypingTime: 0,
    totalCharacters: 0
  };
  // Don't reset recentlyAskedWords here since user might want to continue without repeats
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
  
  // Calculate average time per character
  const avgTimePerChar = stats.totalCharacters > 0 
    ? Math.round(stats.totalTypingTime / stats.totalCharacters)
    : 0;
  document.getElementById('avg-time').textContent = avgTimePerChar + 'ms';
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
        
        // Calculate typing time
        calculateTypingTime(userInput);
        
        // Update last word section
        updateLastWordSection(currentWord);
        
        stats.correct++;
        stats.streak++;
        if (stats.streak > stats.bestStreak) {
          stats.bestStreak = stats.streak;
        }
        updateStatsDisplay();
        
        // Auto-advance to next word in the same mode
        setTimeout(() => {
          nextWord();
        }, 100);
      }, 200);
    }
  });
  
  // Initialize stats display
  updateStatsDisplay();
});

function showCorrectFeedback() {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.innerHTML = `<div>✅ Correct! Auto-advancing...</div>`;
  feedbackElement.className = 'correct';
}

// Initialize when page loads
window.onload = () => {
  // Ensure hiragana mode is selected by default once words are loaded
  if (wordsData && wordsData.hiraganaWords) {
    setMode('hiragana');
  }
};