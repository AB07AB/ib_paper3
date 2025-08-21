/*
  Interactive revision games for IB Computer Science Paper 3 (2025 case study).

  This script manages the application state, renders the different game modes
  (flashcards, multiple choice quiz, coding practice and a timed challenge) and
  persists the player's progress in localStorage. It deliberately avoids
  external dependencies to remain fully functional in an offline environment.

  Each game uses the terms and definitions extracted from the case study
  booklet. Instant feedback is provided for every response and a simple
  scoreboard keeps track of performance across sessions.

  Author: ChatGPT (OpenAI)
*/

(() => {
  /*** Data definitions ***/
  // Terms with definitions and keywords for flashcards and other games.
  const definitions = [
    {
      term: 'Latency',
      definition:
        'The time delay between a user’s input and the chatbot’s response. In the case study, a complex network of machine learning models increases latency and the critical path determines the response time. Reducing unnecessary models and using appropriate natural language understanding pipelines and large relevant datasets can reduce latency.',
      keywords: ['response time', 'critical path', 'latency', 'delay'],
    },
    {
      term: 'Lexical analysis',
      definition:
        'The first stage of natural language processing that breaks an input sentence into tokens (words and sentences). For example, “I want to make a claim about a car accident” becomes [“I”, “want”, “to”, “make”, “a”, “claim”, “about”, “a”, “car”, “accident”].',
      keywords: ['break', 'tokens', 'words', 'sentence'],
    },
    {
      term: 'Syntactic analysis',
      definition:
        'Also known as parsing, this stage of natural language processing identifies grammatical structure and parts of speech (subject, verb, object) and analyses phrase relationships.',
      keywords: ['grammar', 'structure', 'subject', 'verb', 'object'],
    },
    {
      term: 'Semantic analysis',
      definition:
        'The stage of natural language processing that interprets the meaning of the sentence and its words; in the example, it realises the customer wants to make a claim about a car accident.',
      keywords: ['meaning', 'interpret', 'context'],
    },
    {
      term: 'Discourse integration',
      definition:
        'This stage integrates the meaning of the current sentence with the broader context of the conversation; for example, recognising that the user is a customer enquiring about a claim.',
      keywords: ['context', 'conversation', 'broader'],
    },
    {
      term: 'Pragmatic analysis',
      definition:
        'The stage of natural language processing that considers social, legal and cultural context when interpreting a sentence; e.g., inferring that the customer may be injured or have vehicle damage.',
      keywords: ['social', 'legal', 'cultural', 'context'],
    },
    {
      term: 'Recurrent neural network (RNN)',
      definition:
        'A type of deep learning model designed to process sequential data. It has an input layer, hidden layers that maintain memory of previous inputs and an output layer. RNNs are trained using backpropagation through time and can suffer from the vanishing gradient problem.',
      keywords: ['sequential', 'input layer', 'hidden', 'output layer', 'memory'],
    },
    {
      term: 'Long short‑term memory (LSTM)',
      definition:
        'A special kind of recurrent neural network that mitigates the vanishing gradient problem by using a memory cell state and three gates (input, forget and output) to control information flow.',
      keywords: ['gates', 'memory cell', 'vanishing gradient'],
    },
    {
      term: 'Transformer neural network',
      definition:
        'A deep learning model that uses a self‑attention mechanism to capture relationships between words in an input sequence. Transformers power large language models like GPT‑3.',
      keywords: ['self-attention', 'transformer', 'GPT', 'relationships'],
    },
    {
      term: 'Bag‑of‑words',
      definition:
        'An algorithm that represents text as a vector of word frequencies. It was used in the chatbot to extract relevant information from user input but can be computationally intensive for large datasets.',
      keywords: ['word frequency', 'vector', 'bag-of-words'],
    },
    {
      term: 'Confirmation bias',
      definition:
        'A dataset bias that occurs when training data favour a particular viewpoint, such as only including queries about certain policies.',
      keywords: ['favour', 'viewpoint', 'certain', 'bias'],
    },
    {
      term: 'Historical bias',
      definition:
        'A dataset bias that arises when training data do not reflect recent changes; models trained on outdated data struggle with current queries.',
      keywords: ['historical', 'outdated', 'recent changes'],
    },
    {
      term: 'Labelling bias',
      definition:
        'Bias caused by subjective, inaccurate or overly generic labels applied to training data, making it hard for the model to infer true user intent.',
      keywords: ['label', 'subjective', 'generic', 'bias'],
    },
    {
      term: 'Linguistic bias',
      definition:
        'Bias introduced when the dataset overrepresents certain dialects or vocabularies; models trained on formal language may misinterpret informal language.',
      keywords: ['dialect', 'vocabulary', 'formal', 'informal'],
    },
    {
      term: 'Sampling bias',
      definition:
        'Bias resulting from a training dataset that is not representative of the overall population, for example when data come from a single demographic.',
      keywords: ['representative', 'population', 'demographic'],
    },
    {
      term: 'Selection bias',
      definition:
        'Bias introduced when training data are intentionally chosen based on criteria that skew towards certain behaviours or demographics.',
      keywords: ['selection', 'criteria', 'skew'],
    },
    {
      term: 'Pre‑processing',
      definition:
        'The initial step applied to raw data to make it usable for machine learning. It involves cleaning, selecting, transforming and reducing data to improve quality.',
      keywords: ['cleaning', 'transforming', 'reducing', 'pre-processing'],
    },
    {
      term: 'Training',
      definition:
        'The process of fitting a machine learning model using large amounts of text data. It is computationally intensive, requires GPUs or TPUs and involves hyperparameter tuning and backpropagation through time.',
      keywords: ['training', 'GPU', 'TPU', 'hyperparameter', 'backpropagation'],
    },
    {
      term: 'Deployment',
      definition:
        'Running a trained model on specialised hardware. Large language models require TPUs and significant storage and memory to perform efficiently.',
      keywords: ['deployment', 'hardware', 'TPU', 'storage'],
    },
    {
      term: 'Ethical challenges',
      definition:
        'The considerations that must be addressed when deploying a chatbot: data privacy and security, bias and fairness, accountability and responsibility, transparency of decision making and avoiding misinformation and manipulation.',
      keywords: ['privacy', 'bias', 'fairness', 'accountability', 'transparency'],
    },
    {
      term: 'Natural language understanding (NLU)',
      definition:
        'A pipeline of machine learning models that transforms unstructured text into machine‑actionable information. Using NLU helps reduce latency by removing unnecessary models.',
      keywords: ['pipeline', 'models', 'unstructured', 'NLU'],
    },
    {
      term: 'Backpropagation through time (BPTT)',
      definition:
        'A technique for training recurrent neural networks in which gradients of the loss function are computed at each time step and used to update weights. BPTT can lead to the vanishing gradient problem.',
      keywords: ['gradients', 'time', 'update', 'weights'],
    },
    {
      term: 'Hyperparameter tuning',
      definition:
        'Selecting the best values (such as learning rate and number of hidden layers) to optimise model performance.',
      keywords: ['learning rate', 'hidden layers', 'optimise', 'tuning'],
    },
    {
      term: 'Self‑attention mechanism',
      definition:
        'A component of transformer neural networks that weights relationships between words in a sequence, enabling models to focus on relevant parts of the input.',
      keywords: ['self-attention', 'weights', 'relationships', 'sequence'],
    },
    {
      term: 'Synthetic data',
      definition:
        'Artificially generated data used alongside real data to create a more diverse and unbiased training dataset.',
      keywords: ['synthetic', 'artificial', 'diverse', 'unbiased'],
    },
    {
      term: 'Vanishing gradient',
      definition:
        'A problem in training deep networks, especially RNNs, where gradients become very small and the network struggles to learn long‑term dependencies. LSTMs mitigate this issue.',
      keywords: ['vanishing', 'gradients', 'long-term'],
    },
    {
      term: 'Dataset',
      definition:
        'A collection of relevant, unbiased training data used to teach a model. For the chatbot, this includes insurance claim data, customer service data, policy data and medical data, either real or synthetic.',
      keywords: ['collection', 'training data', 'relevant', 'unbiased'],
    },
    {
      term: 'Graphical Processing Unit (GPU)',
      definition:
        'Specialised hardware used to accelerate computations during model training.',
      keywords: ['GPU', 'hardware', 'accelerate', 'computations'],
    },
    {
      term: 'Tensor Processing Unit (TPU)',
      definition:
        'Dedicated hardware designed to efficiently train and run large language models.',
      keywords: ['TPU', 'hardware', 'large models'],
    },
  ];

  // Multiple‑choice questions with options and explanations.
  const mcQuestions = [
    {
      question: 'Which stage of natural language processing breaks input into tokens?',
      options: ['Lexical analysis', 'Semantic analysis', 'Pragmatic analysis', 'Discourse integration'],
      answer: 0,
      explanation: 'Lexical analysis breaks the input text into tokens (words and sentences).',
    },
    {
      question: 'What does a transformer neural network use to capture relationships between words?',
      options: ['Backpropagation', 'Self‑attention', 'Bag‑of‑words', 'Long short‑term memory'],
      answer: 1,
      explanation: 'Transformer networks rely on a self‑attention mechanism to weight relationships between words.',
    },
    {
      question: 'Which dataset bias occurs when data are not representative of the population?',
      options: ['Sampling bias', 'Linguistic bias', 'Confirmation bias', 'Historical bias'],
      answer: 0,
      explanation: 'Sampling bias arises when the training data are not representative of the overall population.',
    },
    {
      question: 'What hardware is recommended for deploying large language models?',
      options: ['Central processing unit', 'Tensor processing unit', 'Graphical processing unit', 'Solid state drive'],
      answer: 1,
      explanation: 'Tensor processing units (TPUs) are specialised hardware for running large language models.',
    },
    {
      question: 'Which algorithm represents text by counting the frequency of words?',
      options: ['Bag‑of‑words', 'Self‑attention', 'Vanishing gradient', 'Hyperparameter tuning'],
      answer: 0,
      explanation: 'Bag‑of‑words transforms text into a vector of word frequencies.',
    },
    {
      question: 'How do LSTMs address the vanishing gradient problem in RNNs?',
      options: ['By using a self‑attention mechanism', 'With memory cells and gating mechanisms', 'By increasing the number of hidden layers', 'Through reinforcement learning'],
      answer: 1,
      explanation: 'LSTMs use a memory cell state and gates (input, forget and output) to control information flow and mitigate the vanishing gradient.',
    },
    {
      question: 'Which of the following is NOT part of the five stages of natural language processing?',
      options: ['Lexical analysis', 'Syntactic analysis', 'Discourse integration', 'Backpropagation'],
      answer: 3,
      explanation: 'Backpropagation is a training method for neural networks, not a stage in natural language processing.',
    },
    {
      question: 'What does hyperparameter tuning involve?',
      options: ['Selecting optimal values like learning rate and hidden layers', 'Encrypting user data', 'Generating synthetic data', 'Measuring response times'],
      answer: 0,
      explanation: 'Hyperparameter tuning searches for the best values (e.g., learning rate) that maximise model performance.',
    },
    {
      question: 'Which bias results from training data favouring a particular viewpoint?',
      options: ['Sampling bias', 'Confirmation bias', 'Selection bias', 'Linguistic bias'],
      answer: 1,
      explanation: 'Confirmation bias occurs when the dataset favours specific viewpoints, such as only including certain policy queries.',
    },
    {
      question: 'Which step in the machine learning workflow involves cleaning and transforming raw data?',
      options: ['Deployment', 'Pre‑processing', 'Training', 'Evaluation'],
      answer: 1,
      explanation: 'Pre‑processing cleans, selects, transforms and reduces data to improve quality before training.',
    },
  ];

  // Coding practice topics with starter Java code.
  const codingTopics = [
    {
      id: 'linkedlist',
      title: 'Linked Lists',
      starter: `// Example: Implement a singly linked list
class ListNode {
  int data;
  ListNode next;
  ListNode(int d) { data = d; }
}

// Add your methods here

public class LinkedListDemo {
  public static void main(String[] args) {
    // TODO: test your linked list
  }
}`,
    },
    {
      id: 'recursion',
      title: 'Recursion',
      starter: `// Example: recursive factorial
public int factorial(int n) {
  if (n <= 1) return 1;
  // TODO: recursive call
}
`,
    },
    {
      id: 'arrays2d',
      title: '2D Arrays',
      starter: `// Example: sum all elements in a 2D array
public int sum2D(int[][] grid) {
  int total = 0;
  // TODO: loop through rows and columns
  return total;
}
`,
    },
    {
      id: 'queue',
      title: 'Queues',
      starter: `import java.util.*;

public class QueueDemo {
  public static void main(String[] args) {
    Queue<Integer> q = new LinkedList<>();
    // TODO: add and remove elements
  }
}
`,
    },
    {
      id: 'stack',
      title: 'Stacks',
      starter: `import java.util.*;

public class StackDemo {
  public static void main(String[] args) {
    Stack<Integer> st = new Stack<>();
    // TODO: push and pop elements
  }
}
`,
    },
  ];

  /*** Persistent progress tracking ***/
  const defaultProgress = {
    flashcards: { correct: 0, total: 0 },
    multiple: { correct: 0, total: 0 },
    coding: { correct: 0, total: 0 },
    timed: { correct: 0, total: 0 },
  };

  function loadProgress() {
    const stored = localStorage.getItem('ibcsPaper3Progress');
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return Object.assign({}, defaultProgress, obj);
      } catch (err) {
        return { ...defaultProgress };
      }
    }
    return { ...defaultProgress };
  }

  function saveProgress(progress) {
    localStorage.setItem('ibcsPaper3Progress', JSON.stringify(progress));
  }

  // Application state
  const state = {
    progress: loadProgress(),
    currentGame: null,
  };

  /*** Utility functions ***/
  // Shuffle an array in place (Fisher‑Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Evaluate a typed answer by checking for the presence of all keywords.
  function evaluateAnswer(input, item) {
    const text = input.trim().toLowerCase();
    let matches = 0;
    item.keywords.forEach((kw) => {
      if (text.includes(kw.toLowerCase())) matches++;
    });
    return matches === item.keywords.length;
  }

  // Update scoreboard UI based on current progress and the active game.
  function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    if (!scoreboard) return;
    const { flashcards, multiple, coding, timed } = state.progress;
    const segments = [
      `Flashcards: ${flashcards.correct}/${flashcards.total}`,
      `Quiz: ${multiple.correct}/${multiple.total}`,
      `Coding: ${coding.correct}/${coding.total}`,
      `Timed: ${timed.correct}/${timed.total}`,
    ];
    scoreboard.textContent = segments.join(' | ');
    scoreboard.classList.remove('hidden');
  }

  /*** UI rendering functions ***/
  const app = document.getElementById('app');

  function clearApp() {
    app.innerHTML = '';
  }

  function renderMenu() {
    state.currentGame = null;
    clearApp();
    updateScoreboard();
    const menu = document.createElement('div');
    menu.className = 'menu';
    const intro = document.createElement('p');
    intro.textContent =
      'Choose a game mode to practise definitions, concepts and algorithms from the case study.';
    menu.appendChild(intro);
    // Buttons for each mode
    const modes = [
      { id: 'flashcards', label: 'Flashcard Recall' },
      { id: 'multiple', label: 'Multiple‑choice Quiz' },
      { id: 'coding', label: 'Coding' },
      { id: 'timed', label: 'Timed Challenge' },
      { id: 'dashboard', label: 'Results Dashboard' },
    ];
    modes.forEach(({ id, label }) => {
      const btn = document.createElement('button');
      btn.className = 'menu-button';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        switch (id) {
          case 'flashcards':
            startFlashcards();
            break;
          case 'multiple':
            startMultipleChoice();
            break;
          case 'coding':
            startCoding();
            break;
          case 'timed':
            startTimedChallenge();
            break;
          case 'dashboard':
            showDashboard();
            break;
        }
      });
      menu.appendChild(btn);
    });
    app.appendChild(menu);
  }

  /*** Flashcard game ***/
  function startFlashcards() {
    state.currentGame = 'flashcards';
    clearApp();
    updateScoreboard();
    // Clone and shuffle the definitions for this session
    const items = shuffle(definitions.slice());
    let index = 0;
    let correctThisSession = 0;
    let totalThisSession = 0;
    let timeoutId;

    function renderCard() {
      clearApp();
      clearTimeout(timeoutId);
      if (index >= items.length) {
        // End of session
        const summary = document.createElement('div');
        summary.className = 'card';
        summary.innerHTML = `<h2>Flashcards complete!</h2><p>You got ${correctThisSession} out of ${totalThisSession} correct.</p>`;
        const backBtn = document.createElement('button');
        backBtn.className = 'menu-button';
        backBtn.textContent = 'Back to menu';
        backBtn.addEventListener('click', () => {
          renderMenu();
        });
        summary.appendChild(backBtn);
        app.appendChild(summary);
        // Update global progress
        state.progress.flashcards.correct += correctThisSession;
        state.progress.flashcards.total += totalThisSession;
        saveProgress(state.progress);
        updateScoreboard();
        return;
      }
      const item = items[index];
      const card = document.createElement('div');
      card.className = 'card question-container';
      const termTitle = document.createElement('div');
      termTitle.className = 'question-text';
      termTitle.textContent = `Define: ${item.term}`;
      const input = document.createElement('textarea');
      input.className = 'flashcard-input';
      input.rows = 3;
      input.placeholder = 'Type your definition here...';
      const submit = document.createElement('button');
      submit.className = 'submit-button';
      submit.textContent = 'Submit';
      const feedback = document.createElement('div');
      feedback.className = 'feedback';
      submit.addEventListener('click', () => {
        const userAnswer = input.value;
        totalThisSession++;
        if (evaluateAnswer(userAnswer, item)) {
          correctThisSession++;
          feedback.textContent = 'Correct!';
          feedback.classList.remove('incorrect');
          feedback.classList.add('correct');
        } else {
          feedback.textContent = `Incorrect. Correct answer: ${item.definition}`;
          feedback.classList.remove('correct');
          feedback.classList.add('incorrect');
        }
        // After feedback, show next card after delay
        timeoutId = setTimeout(() => {
          index++;
          renderCard();
        }, 4000);
      });
      const backBtn = document.createElement('button');
      backBtn.className = 'menu-button';
      backBtn.textContent = 'Back to menu';
      backBtn.addEventListener('click', () => {
        clearTimeout(timeoutId);
        renderMenu();
      });
      card.appendChild(termTitle);
      card.appendChild(input);
      card.appendChild(submit);
      card.appendChild(feedback);
      card.appendChild(backBtn);
      app.appendChild(card);
    }
    renderCard();
  }

  /*** Multiple choice quiz ***/
  function startMultipleChoice() {
    state.currentGame = 'multiple';
    clearApp();
    updateScoreboard();
    const questions = shuffle(mcQuestions.slice());
    let index = 0;
    let correctSession = 0;
    let totalSession = questions.length;
    let timeoutId;
    function renderQuestion() {
      clearApp();
      clearTimeout(timeoutId);
      if (index >= questions.length) {
        // End of quiz
        const summary = document.createElement('div');
        summary.className = 'card';
        summary.innerHTML = `<h2>Quiz complete!</h2><p>You got ${correctSession} out of ${totalSession} correct.</p>`;
        const backBtn = document.createElement('button');
        backBtn.className = 'menu-button';
        backBtn.textContent = 'Back to menu';
        backBtn.addEventListener('click', () => {
          renderMenu();
        });
        summary.appendChild(backBtn);
        app.appendChild(summary);
        // Update global progress
        state.progress.multiple.correct += correctSession;
        state.progress.multiple.total += totalSession;
        saveProgress(state.progress);
        updateScoreboard();
        return;
      }
      const q = questions[index];
      const container = document.createElement('div');
      container.className = 'card question-container';
      const qText = document.createElement('div');
      qText.className = 'question-text';
      qText.textContent = q.question;
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';
      q.options.forEach((opt, i) => {
        const optEl = document.createElement('div');
        optEl.className = 'option';
        optEl.textContent = opt;
        optEl.addEventListener('click', () => {
          // Disable all options after selection
          const children = Array.from(optionsDiv.children);
          children.forEach((child) => child.classList.add('selected'));
          if (i === q.answer) {
            optEl.classList.add('correct');
            correctSession++;
          } else {
            optEl.classList.add('incorrect');
            // highlight correct option
            children[q.answer].classList.add('correct');
          }
          const explanation = document.createElement('div');
          explanation.className = 'feedback';
          explanation.textContent = q.explanation;
          container.appendChild(explanation);
          // Next after delay
          timeoutId = setTimeout(() => {
            index++;
            renderQuestion();
          }, 4000);
        });
        optionsDiv.appendChild(optEl);
      });
      const backBtn = document.createElement('button');
      backBtn.className = 'menu-button';
      backBtn.textContent = 'Back to menu';
      backBtn.addEventListener('click', () => {
        clearTimeout(timeoutId);
        renderMenu();
      });
      container.appendChild(qText);
      container.appendChild(optionsDiv);
      container.appendChild(backBtn);
      app.appendChild(container);
    }
    renderQuestion();
  }

  /*** Coding practice ***/
  function startCoding() {
    state.currentGame = 'coding';
    clearApp();
    updateScoreboard();

    function renderTopicMenu() {
      clearApp();
      const menu = document.createElement('div');
      menu.className = 'menu';
      const intro = document.createElement('p');
      intro.textContent = 'Select a topic and practise writing Java code.';
      menu.appendChild(intro);
      codingTopics.forEach((topic) => {
        const btn = document.createElement('button');
        btn.className = 'menu-button';
        btn.textContent = topic.title;
        btn.addEventListener('click', () => renderEditor(topic));
        menu.appendChild(btn);
      });
      const backBtn = document.createElement('button');
      backBtn.className = 'menu-button';
      backBtn.textContent = 'Back to menu';
      backBtn.addEventListener('click', renderMenu);
      menu.appendChild(backBtn);
      app.appendChild(menu);
    }

    function renderEditor(topic) {
      clearApp();
      const container = document.createElement('div');
      container.className = 'card question-container';
      const title = document.createElement('div');
      title.className = 'question-text';
      title.textContent = topic.title;
      const textarea = document.createElement('textarea');
      textarea.className = 'code-editor';
      textarea.value = topic.starter;
      const runBtn = document.createElement('button');
      runBtn.className = 'submit-button';
      runBtn.textContent = 'Run (local)';
      const feedback = document.createElement('div');
      feedback.className = 'feedback';
      runBtn.addEventListener('click', () => {
        feedback.textContent = 'Code submitted. Execution is not available in this demo.';
      });
      const backBtn = document.createElement('button');
      backBtn.className = 'menu-button';
      backBtn.textContent = 'Back to topics';
      backBtn.addEventListener('click', startCoding);
      container.appendChild(title);
      container.appendChild(textarea);
      container.appendChild(runBtn);
      container.appendChild(feedback);
      container.appendChild(backBtn);
      app.appendChild(container);
    }

    renderTopicMenu();
  }

  /*** Timed challenge ***/
  function startTimedChallenge() {
    state.currentGame = 'timed';
    clearApp();
    updateScoreboard();
    // Create a copy of definitions and generate simple multiple choice questions
    const allItems = shuffle(definitions.slice());
    // We'll ask 8 questions or less depending on available items
    const questionCount = Math.min(8, allItems.length);
    const items = allItems.slice(0, questionCount);
    let index = 0;
    let correctSession = 0;
    const totalSession = items.length;
    let timeRemaining = 10; // seconds per question
    let timerInterval;
    let timeoutId;

    function startTimer(bar) {
      timeRemaining = 10;
      bar.style.width = '100%';
      timerInterval = setInterval(() => {
        timeRemaining--;
        const percent = (timeRemaining / 10) * 100;
        bar.style.width = percent + '%';
        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          // treat as wrong answer
          revealAnswer(null);
        }
      }, 1000);
    }

    function revealAnswer(selectedIndex) {
      // Disable timer
      clearInterval(timerInterval);
      // Evaluate answer; the container and options are accessible via closure
      const question = items[index];
      const optionElements = Array.from(document.querySelectorAll('.option'));
      const correctIdx = question.correctIdx;
      if (selectedIndex !== null && selectedIndex === correctIdx) {
        correctSession++;
        optionElements[selectedIndex].classList.add('correct');
      } else {
        if (selectedIndex !== null) optionElements[selectedIndex].classList.add('incorrect');
        optionElements[correctIdx].classList.add('correct');
      }
      // Explanation
      const explanation = document.createElement('div');
      explanation.className = 'feedback';
      explanation.textContent = question.definition;
      app.appendChild(explanation);
      timeoutId = setTimeout(() => {
        index++;
        nextQuestion();
      }, 4000);
    }

    function nextQuestion() {
      clearApp();
      clearTimeout(timeoutId);
      clearInterval(timerInterval);
      if (index >= items.length) {
        // End challenge
        const summary = document.createElement('div');
        summary.className = 'card';
        summary.innerHTML = `<h2>Timed challenge complete!</h2><p>You got ${correctSession} out of ${totalSession} correct.</p>`;
        const backBtn = document.createElement('button');
        backBtn.className = 'menu-button';
        backBtn.textContent = 'Back to menu';
        backBtn.addEventListener('click', () => {
          renderMenu();
        });
        summary.appendChild(backBtn);
        app.appendChild(summary);
        // Update global progress
        state.progress.timed.correct += correctSession;
        state.progress.timed.total += totalSession;
        saveProgress(state.progress);
        updateScoreboard();
        return;
      }
      // Build question object with random definition options
      const item = items[index];
      // Generate 3 wrong definitions from other items
      const wrongOptions = definitions
        .filter((def) => def.term !== item.term)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((def) => def.definition);
      const options = [item.definition, ...wrongOptions];
      const shuffled = shuffle(options.slice());
      const correctIdx = shuffled.indexOf(item.definition);
      item.correctIdx = correctIdx;
      item.definition = item.definition; // keep original definition for explanation
      const container = document.createElement('div');
      container.className = 'card question-container';
      const questionText = document.createElement('div');
      questionText.className = 'question-text';
      questionText.textContent = `Select the correct definition of: ${item.term}`;
      container.appendChild(questionText);
      // timer bar
      const barContainer = document.createElement('div');
      barContainer.style.background = '#e6eaf1';
      barContainer.style.borderRadius = 'var(--border-radius)';
      barContainer.style.overflow = 'hidden';
      barContainer.style.height = '8px';
      barContainer.style.marginTop = '0.5rem';
      const bar = document.createElement('div');
      bar.className = 'timer';
      barContainer.appendChild(bar);
      container.appendChild(barContainer);
      const backBtn = document.createElement('button');
      backBtn.className = 'menu-button';
      backBtn.textContent = 'Back to menu';
      backBtn.addEventListener('click', () => {
        clearTimeout(timeoutId);
        clearInterval(timerInterval);
        renderMenu();
      });
      const optsDiv = document.createElement('div');
      optsDiv.className = 'options';
      shuffled.forEach((defText, i) => {
        const optEl = document.createElement('div');
        optEl.className = 'option';
        optEl.textContent = defText;
        optEl.addEventListener('click', () => {
          revealAnswer(i);
        });
        optsDiv.appendChild(optEl);
      });
      container.appendChild(optsDiv);
      container.appendChild(backBtn);
      app.appendChild(container);
      // Start timer after DOM updated
      setTimeout(() => startTimer(bar), 100);
    }
    nextQuestion();
  }

  /*** Results dashboard ***/
  function showDashboard() {
    clearApp();
    updateScoreboard();
    const dash = document.createElement('div');
    dash.className = 'dashboard';
    const title = document.createElement('div');
    title.className = 'dashboard-title';
    title.textContent = 'Results Dashboard';
    dash.appendChild(title);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Game', 'Correct', 'Total', 'Accuracy'].forEach((h) => {
      const th = document.createElement('th');
      th.textContent = h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    Object.entries(state.progress).forEach(([game, { correct, total }]) => {
      const tr = document.createElement('tr');
      const cells = [
        game.charAt(0).toUpperCase() + game.slice(1),
        correct,
        total,
        total > 0 ? `${Math.round((correct / total) * 100)}%` : '—',
      ];
      cells.forEach((val) => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    dash.appendChild(table);
    const backBtn = document.createElement('button');
    backBtn.className = 'menu-button';
    backBtn.textContent = 'Back to menu';
    backBtn.addEventListener('click', () => {
      renderMenu();
    });
    dash.appendChild(backBtn);
    app.appendChild(dash);
  }

  // Initialize the application
  window.addEventListener('DOMContentLoaded', () => {
    renderMenu();
  });
})();