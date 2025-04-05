// Sample data structure (replace with actual MongoDB Atlas API calls)
const sampleData = {
    previousYearQuestions: {
        TOC: {
            'Chapter 1': ['Q1: What is TOC?', 'Q2: Define automata'],
            'Chapter 2': ['Q1: Explain DFA', 'Q2: What is NFA?']
        },
        DBMS: {
            'Chapter 1': ['Q1: What is a database?', 'Q2: Define normalization'],
            'Chapter 2': ['Q1: Explain SQL', 'Q2: What is a join?']
        },
        OS: {
            'Chapter 1': ['Q1: What is an OS?', 'Q2: Define process'],
            'Chapter 2': ['Q1: Explain scheduling', 'Q2: What is deadlock?']
        },
        AI: {
            'Chapter 1': ['Q1: What is AI?', 'Q2: Define machine learning'],
            'Chapter 2': ['Q1: Explain neural networks', 'Q2: What is deep learning?']
        },
        ML: {
            'Chapter 1': ['Q1: What is ML?', 'Q2: Define supervised learning'],
            'Chapter 2': ['Q1: Explain regression', 'Q2: What is classification?']
        }
    },
    importantQuestions: {
        TOC: {
            'Chapter 1': ['IQ1: Why study TOC?', 'IQ2: Importance of automata'],
            'Chapter 2': ['IQ1: DFA applications', 'IQ2: NFA vs DFA']
        },
        DBMS: {
            'Chapter 1': ['IQ1: Database importance', 'IQ2: Normalization benefits'],
            'Chapter 2': ['IQ1: SQL advantages', 'IQ2: Join types']
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('mainContainer');
    const contentContainer = document.getElementById('contentContainer');
    const prevYearQuestionsBtn = document.getElementById('prevYearQuestions');
    const importantQuestionsBtn = document.getElementById('importantQuestions');

    // Function to clear content
    function clearContent() {
        contentContainer.innerHTML = '';
    }

    // Function to show loading state
    function showLoading() {
        clearContent();
        const loading = document.createElement('p');
        loading.textContent = 'Loading...';
        loading.className = 'loading';
        contentContainer.appendChild(loading);
    }

    // Function to create subject button
    function createSubjectButton(subject, type) {
        const div = document.createElement('div');
        div.className = 'subject-button';
        div.innerHTML = `
            <div class="subject-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path>
                </svg>
            </div>
            <div class="subject-details">
                <p>${subject}</p>
            </div>
        `;
        div.addEventListener('click', () => showChapters(subject, type));
        return div;
    }

    // Function to create chapter button
    function createChapterButton(chapter, subject, type) {
        const div = document.createElement('div');
        div.className = 'chapter-button';
        div.innerHTML = `
            <div class="chapter-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"></path>
                </svg>
            </div>
            <div class="chapter-details">
                <p>${chapter}</p>
            </div>
        `;
        div.addEventListener('click', () => fetchQuestions(subject, chapter, type));
        return div;
    }

    // Function to create question item
    function createQuestionItem(question) {
        const div = document.createElement('div');
        div.className = 'question-item';
        div.innerHTML = `<p>${question}</p>`;
        return div;
    }

    // Function to show subjects
    function showSubjects(type) {
        clearContent();
        const subjects = Object.keys(sampleData[type]); // Replace with API call
        subjects.forEach(subject => {
            const button = createSubjectButton(subject, type);
            contentContainer.appendChild(button);
        });
    }

    // Function to show chapters
    function showChapters(subject, type) {
        clearContent();
        const chapters = Object.keys(sampleData[type][subject]); // Replace with API call
        chapters.forEach(chapter => {
            const button = createChapterButton(chapter, subject, type);
            contentContainer.appendChild(button);
        });
    }

    // Function to fetch and display questions (simulated with sample data)
    async function fetchQuestions(subject, chapter, type) {
        showLoading();
        // Simulated API call - replace with actual MongoDB Atlas fetch
        setTimeout(() => {
            clearContent();
            const questions = sampleData[type][subject][chapter] || [];
            if (questions.length === 0) {
                const noData = document.createElement('p');
                noData.textContent = 'No questions available';
                noData.className = 'no-data';
                contentContainer.appendChild(noData);
            } else {
                questions.forEach(question => {
                    const item = createQuestionItem(question);
                    contentContainer.appendChild(item);
                });
            }
        }, 500); // Simulated delay
    }

    // Event listeners for main buttons
    prevYearQuestionsBtn.addEventListener('click', () => showSubjects('previousYearQuestions'));
    importantQuestionsBtn.addEventListener('click', () => showSubjects('importantQuestions'));
});