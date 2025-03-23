# Frontend AI by SABIR ALI MONDAL

### **1. Input Handling**
- User enters a question.
- Convert input to **lowercase** and **remove unnecessary symbols** (`!`, `?`, `,`, etc.).

---

### **2. Similarity Matching Logic**
- Compare user input with a **predefined question-answer dataset**.
- Use **word-matching techniques**:
  - Exact word match.
  - Partial word similarity (e.g., "hello" ≈ "helo").
  - Synonym handling (optional).
- If the question has multiple words, check **similarity for each word separately**.

---

### **3. Decision Making Based on Similarity Score**
- **Above 50% similarity** → Use the best-matching response.
- **30% - 50% similarity** → Ask the user for confirmation.
- **Below 30% similarity** → Ask the user to rephrase.

---

### **4. Multi-Word Handling**
- If a question has multiple words:
  - **Break the sentence** and match each word.
  - **Sum up similarity scores** to rank responses.
  - **Stop processing** if logical separators are found (`.`, `;`).

---

### **5. Answer Selection Logic**
- If the **question matches a stored question**, return the answer.
- If the **question matches an answer**, **reverse** the response (suggest a related question).

---

### **6. Edge Case Handling**
- If **multiple matches**, select the **highest-ranked** one.
- If **no matches**, suggest **related topics**.

---

## **Offline Processing for Mathematical Calculations**
- Handle **Basic Arithmetic** (BODMAS/PEMDAS).
- Include:
  - **Modulus (Remainder Calculation)**.
  - **Percentage Calculation**.
  - **Power & Square Root**.
  - **Factorial Computation**.

### **Traing Json File Download Links**
```html
<div class="d-flex justify-content-center gap-3 mt-5 mb-5">
    <a href="https://drive.google.com/uc?export=download&id=10td4KBrArO45XstnPfFbRInGb_mXwSRy" class="btn btn-primary" download>
        Download File Dictionary
    </a>
    <a href="https://drive.google.com/uc?export=download&id=111Z-XWFRjRh6FeJSv00vJCDvHz0BMhDM" class="btn btn-success" download>
        Download File Simple Conversation
    </a>
</div>
```

---

## **Final Thoughts**
- This system ensures **offline support** for grammar correction, calculations, and file storage.
- **Cache Based Install** allows efficient **file retrieval without internet dependency**.
- **Question-answer matching** ensures smart **contextual responses** with confirmation prompts.





## Designed capabilities in frontend:
The provided HTML file represents the user interface for an advanced AI chatbot web application. Here's an overview of its capabilities:

1. **Chat Functionality**:
   - Users can interact with the chatbot by typing messages into a text input.
   - The chatbot can handle text-based conversations and arithmetic expressions.
   - The chatbot is capable of processing and responding to user inputs, including calculations, training data queries, and more.

2. **Tab Navigation**:
   - **Chat Tab**: The main interface for user interaction with the chatbot.
   - **Training Tab**: Allows users to add, edit, and manage training data for the chatbot. Users can:
     - Install predefined training data.
     - Add custom training questions and answers.
     - Upload and manage JSON files containing training data.
     - Reset all training data.

3. **JSON Data Hub**:
   - Users can download a predefined dictionary JSON file.
   - A universal training data generator is available to create custom JSON datasets based on user input topics.
   - Users can paste JSON data into a text area and download it as a JSON file.

4. **Notification System**:
   - Displays notifications to users for various actions such as successful installations, errors, and other alerts.

5. **Clipboard Access**:
   - Users can paste text from the clipboard into the JSON data input area.

6. **Pagination and Data Management**:
   - The training data list supports pagination for better user experience.
   - Users can navigate through pages of training data entries.

7. **Training Data Installation**:
   - Users can install predefined training data and dictionary data from specified URLs. [ Use github Cloud ]
   - Training data is cached in local storage for faster subsequent loading.

8. **Arithmetic and Expression Evaluation**:
   - The chatbot can evaluate arithmetic expressions, including percentages, factorials, and power calculations.

9. **Fuzzy Similarity Matching**:
   - The chatbot uses fuzzy similarity matching to find the best responses from the training data based on user input.

10. **Clipboard Operations**:
   - Functions to paste text from the clipboard and clear existing text before pasting.

Overall, this App provides a comprehensive front-end interface for an AI chatbot with various functionalities for user interaction, training data management, and JSON data handling.
