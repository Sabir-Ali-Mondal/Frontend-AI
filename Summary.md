# Sabir's Advanced Frontend AI Chatbot

This project showcases a sophisticated, **client-side AI Chatbot interface** built with HTML, CSS (Bootstrap 5), and pure JavaScript. It operates entirely within the browser, leveraging **IndexedDB** for robust offline data storage and persistence. The chatbot is designed for interactive Q&A, dynamic calculations, and is fully trainable through a user-friendly interface.

---

### **1. Input Handling & Processing**
- User enters a question or command.
- Input is standardized: converted to **lowercase**.
- **Advanced Cleaning:** Unnecessary symbols are removed, and **stopwords** are filtered out for more effective matching.
- **Porter Stemming Algorithm:** Words are reduced to their root form (e.g., "running" -> "run") for broader matching.

---

### **2. Intelligent Response & Similarity Matching Logic**
- **Multi-layered Matching:** Compares processed user input against a rich dataset of Q&A pairs and calculation patterns.
- **Fuzzy Matching Techniques:**
    - **Levenshtein Distance:** Calculates character-level similarity.
    - **Word Similarity:** Assesses overlap in meaningful words.
- **Similarity Score Thresholds:**
    - **High Similarity (e.g., >50-70%):** Directly provides the best-matching response.
    - **Medium Similarity (e.g., >30-50%):** Asks the user for confirmation (e.g., "Did you mean...?").
    - **Low Similarity:** Asks the user to rephrase or indicates a lack of understanding.
- **Word-by-Word Analysis:** If a full sentence match is weak, the system can break down the input and attempt to find meaning from individual significant words.
- **Reverse Matching:** If user input closely matches a stored *answer*, the chatbot can suggest the corresponding *question*.

---

### **3. Advanced Calculation Engine (Offline Processing)**
The chatbot can perform a variety of mathematical calculations directly in the frontend:
- **Pattern-Based Custom Calculations:**
    - Users can train the bot with patterns (e.g., "double of {number}", "convert {value} cm to inches").
    - Each pattern can be linked to a **custom JavaScript code snippet** or a direct mathematical **formula**.
    - The bot extracts numerical values from user input and executes the relevant logic.
- **Math.js Integration (Optional):** Can leverage Math.js library (if loaded) for complex expression evaluation.
- **Basic Arithmetic:** Handles standard operations (`+`, `-`, `*`, `/`) following BODMAS/PEMDAS.
- **Specific Functions:**
    - **Modulus** (Remainder Calculation).
    - **Percentage Calculation**.
    - **Power & Square Root**.
    - **Factorial Computation**.

---

### **4. Comprehensive Training & Data Management Suite**
- **Tabbed Interface:** Dedicated sections for Chat, Training, and Data/Settings.
- **Bulk Data Import:**
    - **JSON Files:** Import Q&A pairs and calculation patterns from user-provided JSON files.
    - **Text Area:** Paste raw JSON data directly for import.
    - **Progress Indicators:** Visual feedback during large imports.
- **Training Prompt Generation:**
    - Input a topic (e.g., "Space Exploration").
    - The tool generates a search query for **Perplexity.ai** or **ChatGPT** to help users quickly create extensive training datasets in the required JSON format.
- **Data Visualization & Editing:**
    - View all trained Q&A and calculation patterns in **paginated lists**.
    - **Edit or Delete** individual entries directly through the UI.
- **Data Export:** Export the entire current training dataset (Q&A and patterns) to a single JSON file.
- **Sample Data Installation:**
    - One-click installation of pre-defined conversation datasets.
    - One-click installation of pre-defined calculation/dictionary datasets.

---

### **5. Robust Data Persistence & Offline Capabilities**
- **IndexedDB Storage:** All chat history, training data (Q&A, patterns), and system logs are stored persistently in the browser's IndexedDB.
    - **DB Name:** `AdvancedSynergyChatDB`
- **Full Offline Functionality:** Once loaded, the core chat logic, calculations, and access to trained data work seamlessly **without an internet connection**.
- **Chat History:** Conversations are saved and automatically reloaded across sessions.
- **System & Activity Logs:**
    - Tracks important actions (e.g., data import, settings changes, errors).
    - Displays information about imported files.
- **Database Management:**
    - Clear chat history.
    - **Reset Entire Database** to a clean state.
    - Clear logs of uploaded files.
- **Migration Support:** Can migrate data from older localStorage-based versions.

---

### **6. Modern User Interface & Experience**
- **Responsive Design:** Built with **Bootstrap 5** for compatibility across devices.
- **Rich Icons:** Uses **Font Awesome 6** for intuitive visual cues.
- **Real-time Feedback:**
    - **Typing indicators** while the bot processes requests.
    - **Loading spinners** for data operations.
- **Toast Notifications:** Non-intrusive alerts for success messages, warnings, and errors.
- **Markdown Support:** Bot responses can include basic markdown (bold, code blocks, inline code) for better readability.
- **Welcome Screen:** Guides new users and highlights key capabilities.

---

### **Training Data JSON File Download Links**
```html
<div class="d-flex justify-content-center gap-3 mt-5 mb-5">
    <!-- These links are present in the Store/Data & Settings tab -->
    <a href="https://drive.google.com/uc?export=download&id=10td4KBrArO45XstnPfFbRInGb_mXwSRy" class="btn btn-primary" download>
        Download Full Dictionary (JSON)
    </a>
    <a href="https://raw.githubusercontent.com/Sabir-Ali-Mondal/Frontend-AI/main/new_data.json" class="btn btn-info" id="installConversationData">
        Install Some Conversation
    </a>
    <a href="https://raw.githubusercontent.com/Sabir-Ali-Mondal/Frontend-AI/main/dictionary.json" class="btn btn-info" id="installDictionaryData">
        Install Some Calculation
    </a>
</div>
