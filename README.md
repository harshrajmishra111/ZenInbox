# ZenInbox


Project Structure Explained 
email-classifier/: Root directory containing the entire ZenInbox project.
backend/: Houses server-side code for email processing and API integration.
backend/index.js: Main backend script handling Gmail and Gemini API logic.
backend/credentials.json: Google API credentials for Gmail authentication (sensitive, not in repo).
backend/token.json: Authentication token generated after Gmail login (optional, auto-created).
backend/package.json: Defines backend dependencies (e.g., express, @google/generative-ai).
backend/node_modules/: Backend dependency folder (excluded from Git).
frontend/: Contains client-side React application code.
frontend/src/: Source folder with React components and styles.
frontend/src/App.js: Core React component for UI and task display.
frontend/src/App.css: Stylesheet for minimalist UI design.
frontend/src/index.js: Entry point for React app rendering.
frontend/package.json: Defines frontend dependencies (e.g., react, axios).
frontend/node_modules/: Frontend dependency folder (excluded from Git).

# Problem Statement
In today’s fast-paced digital world, students receive an overwhelming number of emails and multiple messages from different apps daily. Manually reading, summarizing, and responding to them is time-consuming and inefficient leading to missed deadlines. This project aims to automate this process using AI, making email management faster, smarter, and hassle-free.

What the App Solves: ZenInbox is a React-based web app that streamlines email management by transforming Gmail inbox data into a prioritized task list. Using the Google Gemini API, it analyzes emails to extract deadlines, urgency, and importance, categorizing tasks into "Urgent," "Important," and "Later." The minimalist UI features a searchable navbar, pagination, and date sorting, making it easy to focus on what matters. By automating task extraction and prioritization, ZenInbox saves time, reduces oversight, and enhances productivity for users drowning in email overload.

Let me know if you’d like to tweak this further! email-classifier/ ├── backend/ │ ├── index.js │ ├── credentials.json │ ├── token.json (optional, generated after auth) │ ├── package.json │ └── node_modules/ ├── frontend/ │ ├── src/ │ │ ├── App.js │ │ ├── App.css │ │ └── index.js │ ├── package.json │ └── node_modules/
