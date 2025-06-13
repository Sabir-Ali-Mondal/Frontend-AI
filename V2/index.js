// Constants
const DB_NAME = 'AdvancedChatbotDB';
const DB_VERSION = 1;
const STORES = {
    TRAINING_DATA: 'trainingData',
    CALCULATION_PATTERNS: 'calculationPatterns',
    DEFAULT_TRAINING: 'defaultTrainingData',
    UPLOADED_FILES: 'uploadedFiles',
    CHAT_HISTORY: 'chatHistory'
};

// Default data URLs
const DEFAULT_CONVERSATION_URL = "https://raw.githubusercontent.com/Sabir-Ali-Mondal/Frontend-AI/main/training_data.json";
const DEFAULT_DICTIONARY_URL = "https://raw.githubusercontent.com/Sabir-Ali-Mondal/Frontend-AI/main/dictionary.json";

const SIMILARITY_THRESHOLDS = {
    HIGH: 50,
    MEDIUM: 30,
    LOW: 0
};

const stopwords = ["what", "why", "who", "when", "where", "how", "is", "the", "a", "an"];
const positiveConfirmations = ["yes", "yess", "ya", "yaa", "ok", "okk", "okay", "okayy", "oky", "okyy", "hmm", "hmmm", "yep", "yepp", "yup", "yupp", "yah", "yahh", "aye", "ayee", "hm", "hmm", "sure", "suure", "alright", "alrighty", "right", "rightt", "yass", "yasss"];
const negativeConfirmations = ["no", "nah", "nope", "noo", "nuh-uh", "never", "not really", "no way", "no thanks", "nopeee", "naah", "nay", "uh-uh", "absolutely not", "not at all", "negative", "incorrect", "that's wrong", "not this time", "not quite", "definitely not"];

// IndexedDB Initialization
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Training data store with question index
            if (!db.objectStoreNames.contains(STORES.TRAINING_DATA)) {
                const trainingStore = db.createObjectStore(STORES.TRAINING_DATA, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                trainingStore.createIndex('question', 'question', {
                    unique: false
                });
            }

            // Calculation patterns store
            if (!db.objectStoreNames.contains(STORES.CALCULATION_PATTERNS)) {
                const calcStore = db.createObjectStore(STORES.CALCULATION_PATTERNS, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                calcStore.createIndex('pattern', 'pattern', {
                    unique: false
                });
            }

            // Default training data store
            if (!db.objectStoreNames.contains(STORES.DEFAULT_TRAINING)) {
                db.createObjectStore(STORES.DEFAULT_TRAINING, {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }

            // Uploaded files metadata store
            if (!db.objectStoreNames.contains(STORES.UPLOADED_FILES)) {
                const filesStore = db.createObjectStore(STORES.UPLOADED_FILES, {
                    keyPath: 'filename'
                });
                filesStore.createIndex('timestamp', 'timestamp', {
                    unique: false
                });
            }

            // Chat history store
            if (!db.objectStoreNames.contains(STORES.CHAT_HISTORY)) {
                const chatStore = db.createObjectStore(STORES.CHAT_HISTORY, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                chatStore.createIndex('timestamp', 'timestamp', {
                    unique: false
                });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject('IndexedDB initialization error: ' + event.target.error);
        };
    });
}

// Generic CRUD operations
async function addRecord(storeName, data) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);

        transaction.oncomplete = () => db.close();
    });
}

async function getAllRecords(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);

        transaction.oncomplete = () => db.close();
    });
}

async function getRecordById(storeName, id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);

        transaction.oncomplete = () => db.close();
    });
}

async function updateRecord(storeName, id, data) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = (event) => {
            const existingData = event.target.result;
            if (!existingData) {
                reject(`Record with ID ${id} not found.`);
                return;
            }

            const updatedData = {
                ...existingData,
                ...data
            };
            const updateRequest = store.put(updatedData);
            updateRequest.onsuccess = () => resolve(true);
            updateRequest.onerror = (event) => reject(event.target.error);
        };

        request.onerror = (event) => reject(event.target.error);
        transaction.oncomplete = () => db.close();
    });
}

async function deleteRecord(storeName, id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);

        transaction.oncomplete = () => db.close();
    });
}

async function clearStore(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);

        transaction.oncomplete = () => db.close();
    });
}

// Training data specific operations
async function addTrainingData(question, answer) {
    return addRecord(STORES.TRAINING_DATA, {
        question: question.toLowerCase().trim(),
        answer: answer.trim(),
        timestamp: Date.now()
    });
}

async function addCalculationPattern(pattern, action, formula) {
    return addRecord(STORES.CALCULATION_PATTERNS, {
        pattern: pattern.toLowerCase().trim(),
        action: action.trim(),
        formula: formula.trim(),
        timestamp: Date.now()
    });
}

async function findExactMatch(question) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.TRAINING_DATA, 'readonly');
        const store = transaction.objectStore(STORES.TRAINING_DATA);
        const index = store.index('question');
        const request = index.get(question.toLowerCase().trim());

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);

        transaction.oncomplete = () => db.close();
    });
}

async function findSimilarMatches(question, threshold = 0.7) {
    const allTrainingData = await getAllRecords(STORES.TRAINING_DATA);
    const normalizedQuery = question.toLowerCase().trim();

    const matches = allTrainingData
        .map(item => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            similarity: calculateSimilarity(normalizedQuery, item.question)
        }))
        .filter(item => item.similarity > threshold)
        .sort((a, b) => b.similarity - a.similarity);

    return matches;
}

// Migration from localStorage
async function migrateFromLocalStorage() {
    try {
        const trainingData = localStorage.getItem('trainingData');
        const defaultTrainingData = localStorage.getItem('defaultTrainingData');
        const uploadedFiles = localStorage.getItem('uploadedFiles');

        if (!trainingData && !defaultTrainingData && !uploadedFiles) {
            return false;
        }

        showNotification('Migration from localStorage to IndexedDB in progress...', 'info');

        if (trainingData) {
            const parsedData = JSON.parse(trainingData);
            for (const question in parsedData) {
                if (parsedData.hasOwnProperty(question)) {
                    await addTrainingData(question, parsedData[question]);
                }
            }
        }

        if (defaultTrainingData) {
            const parsedData = JSON.parse(defaultTrainingData);
            await addRecord(STORES.DEFAULT_TRAINING, {
                type: 'qa_pairs',
                data: parsedData,
                timestamp: Date.now()
            });
        }

        if (uploadedFiles) {
            const parsedFiles = JSON.parse(uploadedFiles);
            for (const file of parsedFiles) {
                await addRecord(STORES.UPLOADED_FILES, {
                    filename: file.name || 'unknown_file',
                    timestamp: file.timestamp || Date.now(),
                    size: file.size || 0,
                    type: file.type || 'application/json'
                });
            }
        }

        localStorage.clear();
        showNotification('Migration complete. Data has been transferred to IndexedDB.', 'success');
        return true;
    } catch (error) {
        console.error('Migration error:', error);
        showNotification('Error during migration: ' + error.message, 'error');
        return false;
    }
}

// Core Chatbot Logic
function cleanInput(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => !stopwords.includes(word))
        .join(' ');
}

function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str1.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            const cost = str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[str1.length][str2.length];
}

function calculateSimilarity(str1, str2) {
    const cleaned1 = cleanInput(str1);
    const cleaned2 = cleanInput(str2);

    if (cleaned1 === cleaned2) return 1;

    // Word matching
    const words1 = cleaned1.split(/\s+/);
    const words2 = cleaned2.split(/\s+/);
    let matchingWords = 0;

    words1.forEach(word => {
        if (words2.includes(word)) matchingWords++;
    });

    const wordSimilarity = (2.0 * matchingWords) / (words1.length + words2.length);

    // Character-level similarity
    const levenshtein = levenshteinDistance(cleaned1, cleaned2);
    const maxLength = Math.max(cleaned1.length, cleaned2.length);
    const charSimilarity = 1 - (levenshtein / maxLength);

    // Combined similarity score
    return (wordSimilarity * 0.6) + (charSimilarity * 0.4);
}

async function findBestMatch(input) {
    const trainingData = await getAllRecords(STORES.TRAINING_DATA);
    let bestMatch = null;
    let bestScore = 0;

    for (const item of trainingData) {
        const questionSimilarity = calculateSimilarity(input, item.question);
        const answerSimilarity = calculateSimilarity(input, item.answer);
        const maxSimilarity = Math.max(questionSimilarity, answerSimilarity);

        if (maxSimilarity > bestScore) {
            bestScore = maxSimilarity;
            bestMatch = {
                item,
                similarity: bestScore,
                matchedAnswer: questionSimilarity < answerSimilarity
            };
        }
    }

    return bestMatch;
}

async function processWordByWord(input) {
    const words = input.split(/\s+/);
    const results = [];

    for (const word of words) {
        if (/^\d+$/.test(word)) {
            results.push(`${word}`);
            continue;
        }

        const match = await findBestMatch(word);
        if (match && match.similarity > 0.3) {
            results.push(match.item.answer);
        }
    }

    return results.length > 0 ? results.join(' ') : null;
}

async function getResponse(input) {
    const sanitizedInput = input.trim().toLowerCase();
    let response = '';

    // Check for calculations
    const calculationResult = await checkFunctionPatterns(sanitizedInput);

    // Find best matching response
    const bestMatch = await findBestMatch(sanitizedInput);

    if (calculationResult !== null && bestMatch) {
        // Both calculation and conversation
        response = `${bestMatch.item.answer}\nCalculation result: ${calculationResult}`;
    } else if (calculationResult !== null) {
        // Only calculation
        response = `The result is ${calculationResult}`;
    } else if (bestMatch) {
        // Only conversation
        if (bestMatch.similarity * 100 >= SIMILARITY_THRESHOLDS.HIGH) {
            response = bestMatch.matchedAnswer ?
                `Related question: "${bestMatch.item.question}"?\n${bestMatch.item.answer}` :
                bestMatch.item.answer;
        } else if (bestMatch.similarity * 100 >= SIMILARITY_THRESHOLDS.MEDIUM) {
            response = `Did you mean: "${bestMatch.item.question}"?\n${bestMatch.item.answer}`;
        } else {
            // Try word by word
            const wordByWordResponse = await processWordByWord(sanitizedInput);
            if (wordByWordResponse) {
                response = wordByWordResponse;
            } else {
                response = "I'm not quite sure. Could you rephrase that?";
            }
        }
    } else {
        // No match found
        response = "I don't understand. Could you try asking differently?";
    }

    return response;
}

// Function to check and execute calculation patterns
async function checkFunctionPatterns(input) {
    try {
        // Try to evaluate with math.js first
        if (typeof math !== 'undefined') {
            try {
                // Replace common language with math symbols
                let mathInput = input
                    .replace(/what is/gi, '')
                    .replace(/calculate/gi, '')
                    .replace(/times/gi, '*')
                    .replace(/multiplied by/gi, '*')
                    .replace(/divided by/gi, '/')
                    .replace(/plus/gi, '+')
                    .replace(/minus/gi, '-')
                    .replace(/squared/gi, '^2')
                    .replace(/cubed/gi, '^3')
                    .trim();

                const result = math.evaluate(mathInput);
                if (result !== undefined && !isNaN(result)) {
                    return result;
                }
            } catch (e) {
                console.log("Not a direct math expression, continuing to patterns");
            }
        }

        // Check against stored calculation patterns
        const patterns = await getAllRecords(STORES.CALCULATION_PATTERNS);

        for (const pattern of patterns) {
            if (input.includes(pattern.pattern)) {
                const numbers = input.match(/\d+(\.\d+)?/g);

                if (numbers && numbers.length > 0) {
                    switch (pattern.action) {
                        case 'calculate_double':
                            return 2 * parseFloat(numbers[0]);

                        case 'calculate_square':
                            return Math.pow(parseFloat(numbers[0]), 2);

                        case 'calculate_percentage':
                            if (numbers.length >= 2) {
                                const percentage = parseFloat(numbers[0]);
                                const total = parseFloat(numbers[1]);
                                return (percentage / 100) * total;
                            }
                            break;

                        case 'calculate_factorial':
                            try {
                                const n = parseInt(numbers[0]);
                                if (n > 20) return "Number too large for factorial";
                                return factorial(n);
                            } catch (error) {
                                return "Error calculating factorial";
                            }
                    }
                }
            }
        }

        // For arithmetic expressions not matching specific patterns, try a fallback method
        if (isArithmetic(input)) {
            const mathExpression = extractArithmetic(input);
            if (mathExpression) {
                try {
                    if (typeof math !== 'undefined') {
                        return math.evaluate(mathExpression);
                    } else {
                        // Use our basic evaluator as fallback
                        return evaluateArithmetic(mathExpression);
                    }
                } catch (error) {
                    console.error("Arithmetic evaluation error:", error);
                }
            }
        }

        return null;
    } catch (error) {
        console.error("Error in checkFunctionPatterns:", error);
        return null;
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    if (n < 0) return "Factorial is only defined for non-negative integers";
    return n * factorial(n - 1);
}

function isArithmetic(input) {
    const arithmeticRegex = /\d+(\s*[\+\-\*\/\^\%]\s*\d+)+/;
    return arithmeticRegex.test(input);
}

function extractArithmetic(input) {
    const matches = input.match(/\d+(\s*[\+\-\*\/\^\%]\s*\d+)+/g);
    return matches ? matches[0] : null;
}

function evaluateArithmetic(expression) {
    if (!expression) return null;

    expression = expression.replace(/\^/g, '**');

    try {
        const sanitizedExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
        const result = new Function(`return ${sanitizedExpression}`)();

        if (isNaN(result) || !isFinite(result)) {
            return "Invalid calculation";
        }

        return result;
    } catch (error) {
        console.error("Error evaluating arithmetic:", error);
        return null;
    }
}

async function importJSON(jsonData) {
    try {
        if (Array.isArray(jsonData)) {
            for (const pair of jsonData) {
                if (pair.question && pair.answer) {
                    await addTrainingData(pair.question, pair.answer);
                }
            }
            return jsonData.length;
        } else {
            let count = 0;

            if (jsonData.qa_pairs && Array.isArray(jsonData.qa_pairs)) {
                for (const pair of jsonData.qa_pairs) {
                    if (pair.question && pair.answer) {
                        await addTrainingData(pair.question, pair.answer);
                        count++;
                    }
                }
            }

            if (jsonData.calculation_patterns && Array.isArray(jsonData.calculation_patterns)) {
                for (const pattern of jsonData.calculation_patterns) {
                    if (pattern.pattern && pattern.action && pattern.formula) {
                        await addCalculationPattern(
                            pattern.pattern,
                            pattern.action,
                            pattern.formula
                        );
                        count++;
                    }
                }
            }

            return count;
        }
    } catch (error) {
        console.error('Error importing JSON:', error);
        throw error;
    }
}

async function exportToJSON() {
    try {
        const trainingData = await getAllRecords(STORES.TRAINING_DATA);
        const calculationPatterns = await getAllRecords(STORES.CALCULATION_PATTERNS);

        const exportData = {
            qa_pairs: trainingData.map(item => ({
                question: item.question,
                answer: item.answer
            })),
            calculation_patterns: calculationPatterns.map(item => ({
                pattern: item.pattern,
                action: item.action,
                formula: item.formula
            }))
        };

        return JSON.stringify(exportData, null, 2);
    } catch (error) {
        console.error('Error exporting JSON:', error);
        throw error;
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(notification);
        }, 500);
    }, 5000);
}

function appendChatMessage(sender, message, isTyping = false) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;

    if (isTyping) {
        messageElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    } else if (message.includes('\n')) {
        message.split('\n').forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.textContent = line;
            messageElement.appendChild(lineElement);
        });
    } else {
        messageElement.textContent = message;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function typeMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    chatBox.appendChild(messageElement);

    const lines = message.split('\n');
    for (const line of lines) {
        const words = line.split(' ');
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const wordElement = document.createElement('span');
            wordElement.textContent = word + ' ';
            messageElement.appendChild(wordElement);
            chatBox.scrollTop = chatBox.scrollHeight;
            await delay(50); // Adjust typing speed here
        }
        // Add a line break after each line
        messageElement.appendChild(document.createElement('br'));
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let currentPage = 1;
const itemsPerPage = 50;

async function updateTrainingList(page = 1) {
    const trainingList = document.getElementById('training-list');
    currentPage = page;

    try {
        trainingList.innerHTML = '<div class="text-center"><div class="loading"></div> Loading training data...</div>';

        const trainingData = await getAllRecords(STORES.TRAINING_DATA);

        trainingList.innerHTML = '';

        if (trainingData.length === 0) {
            trainingList.innerHTML = '<p class="text-center text-muted">No training data available.</p>';
            return;
        }

        const totalItems = trainingData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedData = trainingData.slice(startIndex, startIndex + itemsPerPage);

        paginatedData.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'training-item';
            listItem.innerHTML = `
                <div class="question">${escapeHtml(item.question)}</div>
                <div class="answer">${escapeHtml(item.answer)}</div>
                <div class="actions">
                    <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${item.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}">Delete</button>
                </div>
            `;
            trainingList.appendChild(listItem);
        });

        // Add pagination inside trainingList
        if (totalPages > 1) {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination text-center mt-3';

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.className = `btn btn-sm mx-1 ${i === page ? 'btn-primary' : 'btn-outline-primary'}`;
                pageButton.innerText = i;
                pageButton.onclick = () => updateTrainingList(i);
                paginationContainer.appendChild(pageButton);
            }

            trainingList.appendChild(paginationContainer);
        }

    } catch (error) {
        console.error('Error updating training list:', error);
        trainingList.innerHTML = '<p class="text-center text-danger">Error loading training data.</p>';
    }
}

async function updateDatabaseInfo() {
    const dbInfo = document.getElementById('db-info');

    try {
        const trainingData = await getAllRecords(STORES.TRAINING_DATA);
        const calculationPatterns = await getAllRecords(STORES.CALCULATION_PATTERNS);
        const uploadedFiles = await getAllRecords(STORES.UPLOADED_FILES);
        const chatHistory = await getAllRecords(STORES.CHAT_HISTORY);

        dbInfo.innerHTML = `
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center">
          Training Data
          <span class="badge bg-primary rounded-pill">${trainingData.length}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          Calculation Patterns
          <span class="badge bg-primary rounded-pill">${calculationPatterns.length}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          Uploaded Files
          <span class="badge bg-primary rounded-pill">${uploadedFiles.length}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          Chat History
          <span class="badge bg-primary rounded-pill">${chatHistory.length}</span>
        </li>
      </ul>
    `;
    } catch (error) {
        console.error('Error updating database info:', error);
        dbInfo.innerHTML = '<p class="text-center text-danger">Error loading database information.</p>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function sendMessage() {
    const inputElement = document.getElementById('chat-input');
    const userMessage = inputElement.value.trim();

    if (!userMessage) return;

    appendChatMessage('user', userMessage);
    inputElement.value = '';

    appendChatMessage('bot', '', true); // Show typing indicator

    try {
        const botResponse = await getResponse(userMessage);

        await addRecord(STORES.CHAT_HISTORY, {
            userMessage,
            botResponse,
            timestamp: Date.now()
        });

        // Remove typing indicator
        const chatBox = document.getElementById('chat-box');
        chatBox.removeChild(chatBox.lastChild);

        // Word-by-word typing animation
        await typeMessage('bot', botResponse);
    } catch (error) {
        // Remove typing indicator in case of error
        const chatBox = document.getElementById('chat-box');
        chatBox.removeChild(chatBox.lastChild);

        appendChatMessage('bot', 'Sorry, I encountered an error. Please try again.');
        console.error('Error getting response:', error);
    }
}

async function saveTrainingData() {
    const questionElement = document.getElementById('train-question');
    const answerElement = document.getElementById('train-answer');

    const question = questionElement.value.trim();
    const answer = answerElement.value.trim();

    if (!question || !answer) {
        showNotification('Please provide both question and answer.', 'error');
        return;
    }

    try {
        await addTrainingData(question, answer);

        questionElement.value = '';
        answerElement.value = '';
        showNotification('Training data saved successfully!', 'success');

        updateTrainingList();
    } catch (error) {
        console.error('Error saving training data:', error);
        showNotification('Failed to save training data. Please try again.', 'error');
    }
}

async function saveCalculationPattern() {
    const patternElement = document.getElementById('calc-pattern');
    const actionElement = document.getElementById('calc-action');
    const formulaElement = document.getElementById('calc-formula');

    const pattern = patternElement.value.trim();
    const action = actionElement.value.trim();
    const formula = formulaElement.value.trim();

    if (!pattern || !action || !formula) {
        showNotification('Please fill in all calculation pattern fields.', 'error');
        return;
    }

    try {
        await addCalculationPattern(pattern, action, formula);

        patternElement.value = '';
        actionElement.value = '';
        formulaElement.value = '';

        showNotification('Calculation pattern saved successfully!', 'success');
        updateDatabaseInfo();
    } catch (error) {
        console.error('Error saving calculation pattern:', error);
        showNotification('Failed to save calculation pattern. Please try again.', 'error');
    }
}

async function editTrainingItem(id) {
    try {
        const item = await getRecordById(STORES.TRAINING_DATA, parseInt(id));

        if (!item) {
            showNotification('Training item not found.', 'error');
            return;
        }

        const newQuestion = prompt('Edit question:', item.question);
        if (newQuestion === null) return;

        const newAnswer = prompt('Edit answer:', item.answer);
        if (newAnswer === null) return;

        await updateRecord(STORES.TRAINING_DATA, parseInt(id), {
            question: newQuestion.trim().toLowerCase(),
            answer: newAnswer.trim(),
            timestamp: Date.now()
        });

        showNotification('Training item updated successfully!', 'success');
        updateTrainingList();
    } catch (error) {
        console.error('Error editing training item:', error);
        showNotification('Failed to update training item. Please try again.', 'error');
    }
}

async function deleteTrainingItem(id) {
    if (confirm('Are you sure you want to delete this training item?')) {
        try {
            await deleteRecord(STORES.TRAINING_DATA, parseInt(id));
            showNotification('Training item deleted successfully!', 'success');
            updateTrainingList();
        } catch (error) {
            console.error('Error deleting training item:', error);
            showNotification('Failed to delete training item. Please try again.', 'error');
        }
    }
}

async function importJSONFile() {
    const fileInput = document.getElementById('json-file-input');
    const file = fileInput.files[0];

    if (!file) {
        showNotification('Please select a file to import.', 'error');
        return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        showNotification('Please select a valid JSON file.', 'error');
        fileInput.value = '';
        return;
    }

    try {
        showNotification('Importing data from file...', 'info');

        const fileContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });

        const jsonData = JSON.parse(fileContent);

        const count = await importJSON(jsonData);

        await addRecord(STORES.UPLOADED_FILES, {
            filename: file.name,
            timestamp: Date.now(),
            size: file.size,
            type: file.type
        });

        fileInput.value = '';

        showNotification(`Successfully imported ${count} items from ${file.name}!`, 'success');
        updateTrainingList();
        updateDatabaseInfo();
    } catch (error) {
        console.error('Error importing JSON file:', error);
        showNotification(`Failed to import file: ${error.message}`, 'error');
        fileInput.value = '';
    }
}

async function exportDataToFile() {
    try {
        const jsonData = await exportToJSON();

        const blob = new Blob([jsonData], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `chatbot_training_data_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Training data exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Failed to export training data. Please try again.', 'error');
    }
}

async function clearUploadedFiles() {
    if (confirm('Are you sure you want to clear all uploaded file records? This will not delete your training data.')) {
        try {
            await clearStore(STORES.UPLOADED_FILES);
            showNotification('Uploaded files records cleared successfully!', 'success');
            updateDatabaseInfo();
        } catch (error) {
            console.error('Error clearing uploaded files:', error);
            showNotification('Failed to clear uploaded files. Please try again.', 'error');
        }
    }
}

async function resetAllTraining() {
    if (confirm('WARNING: This will permanently delete ALL training data. Are you sure you want to continue?')) {
        if (confirm('Are you REALLY sure? This action cannot be undone.')) {
            try {
                await clearStore(STORES.TRAINING_DATA);
                await clearStore(STORES.CALCULATION_PATTERNS);

                showNotification('All training data has been reset.', 'success');
                updateTrainingList();
                updateDatabaseInfo();
            } catch (error) {
                console.error('Error resetting training data:', error);
                showNotification('Failed to reset training data. Please try again.', 'error');
            }
        }
    }
}

async function fetchAndImportJSON(url, notificationMessage) {
    try {
        showNotification(notificationMessage, 'info');

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();
        const count = await importJSON(jsonData);

        showNotification(`Successfully installed ${count} items!`, 'success');
        updateTrainingList();
        updateDatabaseInfo();

        return count;
    } catch (error) {
        console.error('Error fetching and importing JSON:', error);
        showNotification(`Failed to import data: ${error.message}`, 'error');
        throw error;
    }
}

async function installConversation() {
    try {
        await fetchAndImportJSON(DEFAULT_CONVERSATION_URL, 'Installing conversation dataset...');
    } catch (error) {
        console.error('Error installing conversation data:', error);
    }
}

async function installDictionary() {
    try {
        await fetchAndImportJSON(DEFAULT_DICTIONARY_URL, 'Installing emoji dictionary...');
    } catch (error) {
        console.error('Error installing emoji dictionary:', error);
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        await migrateFromLocalStorage();
        await updateTrainingList();
        await updateDatabaseInfo();

        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab(tab.getAttribute('data-tab'));
            });
        });

        document.getElementById('chat-send').addEventListener('click', sendMessage);
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        document.getElementById('train-save').addEventListener('click', saveTrainingData);
        document.getElementById('calc-save').addEventListener('click', saveCalculationPattern);

        document.getElementById('training-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                editTrainingItem(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-btn')) {
                deleteTrainingItem(e.target.dataset.id);
            }
        });

        document.getElementById('json-file-input').addEventListener('change', importJSONFile);
        document.getElementById('export-data').addEventListener('click', exportDataToFile);
        document.getElementById('clear-files').addEventListener('click', clearUploadedFiles);
        document.getElementById('reset-all-training').addEventListener('click', resetAllTraining);

        document.getElementById('install-conversation').addEventListener('click', installConversation);
        document.getElementById('install-dictionary').addEventListener('click', installDictionary);

        document.getElementById('refresh-db-info').addEventListener('click', updateDatabaseInfo);

        appendChatMessage('bot', 'Hello! I am your Advanced AI Chatbot. How can I help you today?');

        console.log('Application initialized successfully!');
    } catch (error) {
        console.error('Error initializing application:', error);
        showNotification('There was an error initializing the application. Please reload the page.', 'error');
    }
});
