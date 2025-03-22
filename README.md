# Frontend AI by SABIR ALI MONDAL

### **1. Input Handling**
- User enters a question.
- Convert input to **lowercase** and **remove unnecessary symbols** (`!`, `?`, `,`, etc.).
- Use **Compromise.js** to fix grammar before further processing.

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
