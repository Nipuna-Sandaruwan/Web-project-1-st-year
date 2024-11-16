const stages = [
    {
        category: "Personal Information",
        questions: ["Full Name", "Date of Birth", "Nationality", "Address", "Phone Number"]
    },
    {
        category: "Work Experience",
        questions: ["Current Job Title", "Company Name", "Employment Duration", "Responsibilities", "Achievements"]
    },
    {
        category: "Skills and Expertise",
        questions: ["Programming Languages", "Soft Skills", "Technical Skills", "Certifications", "Languages Spoken"]
    },
    {
        category: "Career Goals",
        questions: ["Short-term Goals", "Long-term Goals", "Desired Industry", "Professional Development Plans"]
    }
];

let userResponses = {};
let currentStageIndex = 0;
let currentQuestionIndex = 0;

function displayStage() {
    const stage = stages[currentStageIndex];
    const question = stage.questions[currentQuestionIndex];

    const stageContainer = document.getElementById('stage-container');
    stageContainer.innerHTML = `
        <h3>${stage.category} - Stage ${currentStageIndex + 1}</h3>
        <p>${question}</p>
        <input type="text" id="user-input">
        <button onclick="nextQuestion()">Next</button>
        <button onclick="skipQuestion()">Skip</button>
    `;

    updateProgress();
}

function nextQuestion() {
    const input = document.getElementById('user-input').value.trim();
    if (input !== '') { // Proceed only if an answer is given
        userResponses[stages[currentStageIndex].questions[currentQuestionIndex]] = input;
        currentQuestionIndex++;

        if (currentQuestionIndex >= stages[currentStageIndex].questions.length) {
            if (currentStageIndex < stages.length - 1) {
                currentStageIndex++;
                currentQuestionIndex = 0;
            } else {
                displayCompletedStages();
                return; // Exit the function to prevent updating progress twice
            }
        }

        displayStage();
    } else {
        alert("Please provide an answer or skip this question.");
    }
    updateProgress();
}

function skipQuestion() {
    userResponses[stages[currentStageIndex].questions[currentQuestionIndex]] = 'Skipped';
    currentQuestionIndex++;

    if (currentQuestionIndex >= stages[currentStageIndex].questions.length) {
        if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            currentQuestionIndex = 0;
        } else {
            displayCompletedStages();
            return; // Exit the function to prevent updating progress twice
        }
    }

    displayStage();
    updateProgress();
}

function displayCompletedStages() {
    const responseContainer = document.getElementById('response-container');
    responseContainer.innerHTML = '';
    
    for (let i = 0; i < currentStageIndex; i++) {
        const stageData = Object.entries(userResponses)
            .filter(([key, value]) => stages[i].questions.includes(key))
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value === '' ? 'Skipped' : value}</li>`)
            .join('');

        const stageOutput = document.createElement('div');
        stageOutput.innerHTML = `
            <h3>${stages[i].category}</h3>
            <ul>${stageData}</ul>
        `;
        responseContainer.appendChild(stageOutput);
    }

    // Update progress to 100% upon completing all stages
    updateProgress();
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    let progress;

    if (currentStageIndex < stages.length - 1) {
        // Calculate progress based on the completed questions and total questions
        const totalQuestions = stages.reduce((acc, stage) => acc + stage.questions.length, 0);
        const completedQuestions = currentStageIndex * stages[currentStageIndex].questions.length + currentQuestionIndex;
        progress = Math.floor((completedQuestions / totalQuestions) * 100);
    } else {
        // Check if we have completed all questions in the last stage
        const totalQuestionsStage4 = stages[currentStageIndex].questions.length;
        if (currentQuestionIndex === totalQuestionsStage4) {
            // If all questions are completed, set progress to 100%
            progress = 100;
        } else {
            // Calculate progress based on the completed questions in stage 4
            progress = Math.min(Math.floor((currentQuestionIndex / totalQuestionsStage4) * 27) + 73, 100);
        }
    }

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Progress: ${progress}%`;

    // Prevent updating progress further once it reaches 100%
    if (progress === 100) {
        return;
    }
}
window.onload = displayStage;
