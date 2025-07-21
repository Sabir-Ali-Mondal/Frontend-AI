# 🚀 Trainable Frontend AI (Simulator) — by S.A.M.

🔥 No Server. No Hardcoded AI API.
This is an AI simulator that works *completely offline* — no backend, no cloud, just your browser and structured training data!



## ✨ Key Highlights

- 🧠 **Trainable AI**  
  Train your own Q&A logic with simple JSON files. Works with datasets created using ChatGPT or Perplexity.

- 💾 **Fully Frontend-Based**  
  No backend, no API — runs directly in your browser using **IndexedDB**.

- ⚡ **Real-Time Response Engine**  
  Instant answers from a dataset of 2.69 lakh Q&A pairs and 325+ logic formulas.

- 🔍 **Fuzzy Matching**
  Supports fuzzy logic for better natural language understanding.

- 🧮 **Dynamic Calculation Engine**  
  Supports logic-based questions using custom formulas.

---

## 💡 Use Cases

- Engineering formula bots
- Offline educational assistants
- Domain-specific Q&A bots
- Physics/Chemistry/Finance/Medical calculators
- Customized AI memory tools

Imagine an AI that can help you:
- Calculate Ohm’s Law
- Answer NEET-level bio questions
- Solve banking logic
- And it’s all local to your device!

---

## 🛠 Tech Stack

- HTML + JavaScript + CSS
- IndexedDB for offline storage
- Github as cloud
- JSON loaders for custom training
- Local fuzzy string matching


## 🧠 How It Works

1. Load the simulator in your browser.
2. The app initializes local DB using `IndexedDB`.
3. Q&A and pattern logic are matched using natural input.
4. Calculation patterns are parsed and executed in JS.
5. You can add your own training data in JSON format (see `train.html`).

---

## 📦 Preloaded With:

- ✅ **2.69 lakh+** verified Q&A pairs  
- ✅ **325+** real logic patterns  
- ✅ Sample loader templates included

---

## 🌐 Links

- 🔗 **Live Demo (link)**: [https://aibysabir.ccbp.tech/](https://aibysabir.ccbp.tech/)
- 🧠 **GitHub Repo**: [Frontend-AI](https://github.com/Sabir-Ali-Mondal/Frontend-AI)
- 🔁 **LinkedIn Post**: [Check here]([https://www.linkedin.com/posts/sabir-ali-mondal_frontend-ai-innovationwithjs-activity-7309301864280338433-gJoD](https://www.linkedin.com/posts/sabir-ali-mondal_frontend-ai-js-activity-7352580258463694851-FrvP?utm_source=li_share&utm_content=feedcontent&utm_medium=g_dt_web&utm_campaign=copy))



# Sabir's Chatbot Interface

## Overview

This project is a sophisticated, client-side AI Chatbot interface built entirely with HTML, CSS (Bootstrap 5), and JavaScript. It runs completely in the browser, leveraging IndexedDB for persistent data storage. The chatbot can engage in Q&A, perform calculations, and be trained with custom data. It features a tabbed interface for chatting, training, and managing data/settings.

## Key Features

### 1. Chat Interface
*   **Real-time Messaging:** Send and receive messages with a clean, modern UI.
*   **User & Bot Distinction:** Messages are clearly marked by sender.
*   **Typing Indicator:** Visual feedback while the bot is "thinking".
*   **Markdown Support:** Bot responses support basic markdown like `**bold**`, `*italic*`, ` ```code blocks``` `, and ``inline code``.
*   **Welcome Message:** Greets the user and highlights capabilities.
*   **Chat History:** Conversations are saved and reloaded across sessions.

### 2. Intelligent Responses
*   **Q&A Matching:**
    *   Utilizes fuzzy matching (Levenshtein distance and word similarity) to find the best answer from its training data.
    *   Processes input by cleaning, removing stopwords, and applying Porter Stemming.
*   **Dynamic Calculations:**
    *   **Pattern-based with Custom Code:** Users can define calculation patterns with associated JavaScript code snippets (e.g., `function(num1, num2){ return num1 + num2; }`). The bot extracts numbers from user input and executes the relevant snippet.
    *   **Formula-based Patterns:** Supports simpler patterns with direct formulas (e.g., "double of {number}" -> `result = 2 * number`).
    *   **Math.js Integration:** Can evaluate mathematical expressions using the Math.js library (if available).
    *   **Basic Arithmetic:** Recognizes and evaluates simple arithmetic expressions.
*   **Conversational Flow:**
    *   **Pending Suggestions:** If a user's input is ambiguous or matches an answer, the bot can suggest a related question and await confirmation ("yes/no").
    *   **Confirmation Handling:** Recognizes positive ("yes", "ok") and negative ("no", "nah") user confirmations.

### 3. Training & Customization
*   **Bulk JSON Import:**
    *   Import Q&A pairs and calculation patterns from a JSON file.
    *   Import directly by pasting JSON data into a text area.
    *   Supports a flexible JSON structure (array of Q&A, or object with `qa_pairs` and `calculation_patterns`).
*   **Training Prompt Generation:**
    *   Enter a topic, and the tool generates a search query for Perplexity.ai or ChatGPT to help create a large set of training data in the required JSON format.
*   **Data Management UI:**
    *   View, edit, and delete individual Q&A pairs and calculation patterns directly in the interface.
    *   Lists are paginated for easier navigation.

### 4. Data Management & Persistence (Store/Data & Settings Tab)
*   **IndexedDB Storage:** All data (Q&A, calculation patterns, chat history, uploaded file logs) is stored locally in the browser's IndexedDB.
*   **Database Overview:** Displays counts of Q&A pairs, patterns, and messages.
*   **Quick Actions:**
    *   Install sample conversation data.
    *   Install sample calculation/dictionary data.
    *   Download a full dictionary (JSON) for advanced calculations/definitions.
*   **Import/Export:**
    *   Export all current training data and patterns to a single JSON file.
    *   Import data from a previously exported JSON file.
*   **Data Management:**
    *   Clear chat history.
    *   Reset the entire database.
    *   Clear the log of uploaded file names.
*   **System Information:**
    *   Details about the IndexedDB (name, version, status).
    *   Log of imported files (name, size, timestamp).
    *   List of supported features.
    *   Recent activity log within the application.

### 5. User Interface & Experience
*   **Bootstrap 5:** Modern and responsive design.
*   **Font Awesome Icons:** Enhances visual appeal and usability.
*   **Tabbed Navigation:** Clearly separates Chat, Training, and Data/Settings functionalities.
*   **Toast Notifications:** Provides non-intrusive feedback for actions (e.g., data saved, import complete, errors).
*   **Loading Indicators:** Spinners show when the bot is processing or data is being loaded/imported.
*   **Progress Bar:** Visual feedback for bulk data import operations.

## Technical Details

*   **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript (ES6+ features, consolidated into a single `<script>` tag within the HTML).
*   **Data Storage:** Browser IndexedDB.
*   **Core Algorithms:**
    *   **Text Processing:** Stopword removal, Porter Stemmer.
    *   **Similarity:** Levenshtein distance, custom word-based similarity scoring.
    *   **Dynamic Code Execution:** Uses `new Function()` to execute user-defined JavaScript snippets for calculations (carefully managed).
    *   **Pattern Matching:** Regular expressions and string matching for identifying calculation triggers.
*   **External Libraries (CDN):**
    *   Bootstrap 5 (CSS & JS)
    *   Font Awesome 6
    *   (Potentially Math.js, though not explicitly linked in the provided HTML, the code checks for its presence for `checkFunctionPatterns`)

## How to Use

1.  **Open `index.html` (or the provided HTML file) in a web browser.**
2.  **Chat Tab:**
    *   Type your questions or calculation requests into the input field and press Enter or click the send button.
    *   The bot will respond based on its trained data and calculation capabilities.
3.  **Training Tab:**
    *   **Generate Training Prompts:** Enter a topic to get a pre-formatted search query for AI tools to generate training data.
    *   **Bulk Import:**
        *   Paste JSON data (Q&A or calculation patterns) into the text area and click "Import from Text Area".
        *   Download the JSON template to understand the required format.
4.  **Store/Data & Settings Tab:**
    *   **View Data:** Browse existing Q&A pairs and calculation patterns. Edit or delete entries as needed.
    *   **Manage Database:** Use quick actions to install sample data, export your current data, import from a file, clear chat history, or reset the entire database.
    *   **System Info:** Check database statistics, activity logs, and other system details.

This application provides a robust and flexible platform for creating and interacting with a personalized, client-side chatbot.
