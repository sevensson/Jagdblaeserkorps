const signals = [
  { name: 'Das Ganze', file: 'audio/das-ganze.mp3' },
  { name: 'Aufbruch zur Jagd', file: 'audio/aufbruch-zur-jagd.mp3' },
  { name: 'Anblasen des Treibens', file: 'audio/anblasen-des-treibens.mp3' },
  { name: 'Aufmunterung zum Treiben', file: 'audio/aufmunterung-zum-treiben.mp3' },
  { name: 'Treiben zurück', file: 'audio/treiben-zurueck.mp3' },
  { name: 'Treiber in den Kessel', file: 'audio/treiber-in-den-kessel.mp3' },
  { name: 'Aufhören zu schießen (Hahn in Ruh)', file: 'audio/hahn-in-ruh.mp3' },
  { name: 'Jagd vorbei', file: 'audio/jagd-vorbei.mp3' },
  { name: 'Sammeln der Jäger', file: 'audio/sammeln-der-jaeger.mp3' },
  { name: 'Sau tot', file: 'audio/sau-tot.mp3' },
  { name: 'Reh tot', file: 'audio/reh-tot.mp3' },
  { name: 'Fuchs tot', file: 'audio/fuchs-tot.mp3' },
  { name: 'Hase tot', file: 'audio/hase-tot.mp3' },
  { name: 'Kaninchen tot', file: 'audio/kaninchen-tot.mp3' },
  { name: 'Flugwild tot', file: 'audio/flugwild-tot.mp3' },
];

const views = [...document.querySelectorAll('.view')];
const homeBtn = document.getElementById('homeBtn');
const practiceBtn = document.getElementById('practiceBtn');
const examBtn = document.getElementById('examBtn');
const signalsBtn = document.getElementById('signalsBtn');
const playBtn = document.getElementById('playBtn');
const audioPlayer = document.getElementById('audioPlayer');
const audioNotice = document.getElementById('audioNotice');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const modeLabel = document.getElementById('modeLabel');
const progressLabel = document.getElementById('progressLabel');
const signalList = document.getElementById('signalList');
const resultHeadline = document.getElementById('resultHeadline');
const resultScore = document.getElementById('resultScore');
const resultText = document.getElementById('resultText');
const retryBtn = document.getElementById('retryBtn');
const resultHomeBtn = document.getElementById('resultHomeBtn');

let mode = 'practice';
let currentSignal = null;
let questionNumber = 0;
let score = 0;
let examQuestions = [];
let answered = false;

function showView(id) {
  views.forEach(v => v.classList.toggle('active', v.id === id));
  homeBtn.classList.toggle('hidden', id === 'homeView');
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function randomOptions(correct) {
  const others = shuffle(signals.filter(s => s.name !== correct.name)).slice(0,3);
  return shuffle([correct, ...others]);
}

function startPractice() {
  mode = 'practice';
  score = 0;
  questionNumber = 0;
  modeLabel.textContent = 'Üben';
  showView('quizView');
  nextPracticeQuestion();
}

function startExam() {
  mode = 'exam';
  score = 0;
  questionNumber = 0;
  examQuestions = shuffle(signals).slice(0,10);
  modeLabel.textContent = 'Prüfung';
  showView('quizView');
  nextExamQuestion();
}

function nextPracticeQuestion() {
  questionNumber += 1;
  currentSignal = signals[Math.floor(Math.random() * signals.length)];
  renderQuestion();
}

function nextExamQuestion() {
  if (questionNumber >= examQuestions.length) return finishExam();
  currentSignal = examQuestions[questionNumber];
  questionNumber += 1;
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = currentSignal.file;
  audioNotice.classList.add('hidden');
  feedbackEl.className = 'feedback hidden';
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
  answersEl.innerHTML = '';

  progressLabel.textContent = mode === 'exam'
    ? `Frage ${questionNumber} von ${examQuestions.length}`
    : `Frage ${questionNumber}`;

  randomOptions(currentSignal).forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = option.name;
    btn.addEventListener('click', () => chooseAnswer(option.name, btn));
    answersEl.appendChild(btn);
  });
}

function chooseAnswer(name, clickedBtn) {
  if (answered) return;
  answered = true;
  const correct = name === currentSignal.name;
  if (correct) score += 1;

  const buttons = [...answersEl.querySelectorAll('.answer-btn')];
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === currentSignal.name) btn.classList.add('correct');
  });
  if (!correct) clickedBtn.classList.add('wrong');

  if (mode === 'practice') {
    feedbackEl.textContent = correct
      ? 'Richtig – sehr gut.'
      : `Nicht ganz. Richtig wäre: ${currentSignal.name}`;
    feedbackEl.className = `feedback ${correct ? 'good' : 'bad'}`;
  }

  nextBtn.textContent = mode === 'exam' && questionNumber === examQuestions.length
    ? 'Ergebnis anzeigen'
    : 'Nächste Frage';
  nextBtn.classList.remove('hidden');
}

function finishExam() {
  const pct = Math.round((score / examQuestions.length) * 100);
  const passed = pct >= 80;
  resultHeadline.textContent = passed ? 'Bestanden' : 'Noch nicht bestanden';
  resultScore.textContent = `${score} / ${examQuestions.length}`;
  resultText.textContent = passed
    ? `Du hast ${pct} % erreicht.`
    : `Du hast ${pct} % erreicht. Für diese Demo liegt die Bestehensgrenze bei 80 %.`;
  showView('resultsView');
}

function buildSignalList() {
  signalList.innerHTML = '';
  signals.forEach(signal => {
    const row = document.createElement('div');
    row.className = 'signal-item';
    const label = document.createElement('strong');
    label.textContent = signal.name;
    const btn = document.createElement('button');
    btn.textContent = '▶';
    btn.setAttribute('aria-label', `${signal.name} abspielen`);
    btn.addEventListener('click', () => playFile(signal.file));
    row.append(label, btn);
    signalList.appendChild(row);
  });
}

function playFile(file) {
  audioPlayer.pause();
  audioPlayer.src = file;
  audioNotice.classList.add('hidden');
  audioPlayer.play().catch(() => {
    audioNotice.textContent = 'Für dieses Signal ist noch keine MP3-Datei hinterlegt.';
    audioNotice.classList.remove('hidden');
  });
}

playBtn.addEventListener('click', () => playFile(currentSignal.file));
practiceBtn.addEventListener('click', startPractice);
examBtn.addEventListener('click', startExam);
signalsBtn.addEventListener('click', () => { buildSignalList(); showView('signalsView'); });
homeBtn.addEventListener('click', () => showView('homeView'));
nextBtn.addEventListener('click', () => mode === 'exam' ? nextExamQuestion() : nextPracticeQuestion());
retryBtn.addEventListener('click', startExam);
resultHomeBtn.addEventListener('click', () => showView('homeView'));

audioPlayer.addEventListener('error', () => {
  if (audioPlayer.src) {
    audioNotice.textContent = 'Für dieses Signal ist noch keine MP3-Datei hinterlegt.';
    audioNotice.classList.remove('hidden');
  }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
