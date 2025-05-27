// Get DOM elements
const timeLeftDisplay = document.getElementById('time-left');
const durationInput = document.getElementById('duration');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
// const bellSound = document.getElementById('bell');

let countdown; // Variable to store the interval ID
let timeInSeconds; // Total time in seconds for the countdown
let isPaused = false; // Flag to check if timer is paused

// Function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to update the timer display
function updateDisplay() {
    timeLeftDisplay.textContent = formatTime(timeInSeconds);
}

// Function to start the timer
function startTimer() {
    if (countdown) { // If a countdown is already running, clear it
        clearInterval(countdown);
    }

    if (!isPaused) { // If not resuming from a pause, get new duration
        const durationMinutes = parseInt(durationInput.value);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            alert("Please enter a valid duration in minutes.");
            return;
        }
        timeInSeconds = durationMinutes * 60;
    }

    isPaused = false;
    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = false;
    durationInput.disabled = true;

    updateDisplay(); // Initial display update

    countdown = setInterval(() => {
        timeInSeconds--;
        updateDisplay();

        if (timeInSeconds <= 0) {
            clearInterval(countdown);
            timeLeftDisplay.textContent = "Time's up!";
            // bellSound.play();
            playBeep(); // Call the new beep function
            startButton.disabled = false;
            stopButton.disabled = true;
            durationInput.disabled = false;
        }
    }, 1000);
}

// Function to stop/pause the timer
function stopTimer() {
    clearInterval(countdown);
    isPaused = true;
    startButton.disabled = false;
    startButton.textContent = 'Resume'; // Change start button text to Resume
    stopButton.disabled = true;
}

// Function to reset the timer
function resetTimer() {
    clearInterval(countdown);
    isPaused = false;
    const defaultMinutes = parseInt(durationInput.defaultValue) || 5; // Use default or 5 min
    timeInSeconds = defaultMinutes * 60; // Reset to initial input or default
    durationInput.value = defaultMinutes; // Reset input field to default
    updateDisplay();
    startButton.disabled = false;
    startButton.textContent = 'Start'; // Reset start button text
    stopButton.disabled = true;
    resetButton.disabled = true;
    durationInput.disabled = false;
}

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Function to play a beep sound using Web Audio API
function playBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) {
        console.warn("Web Audio API is not supported in this browser.");
        return;
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine'; // Type of sound wave
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Frequency in Hz (A4 note)
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Volume

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5); // Play for 0.5 seconds
}

// Initial setup
resetButton.disabled = true; // Reset button initially disabled
stopButton.disabled = true; // Stop button initially disabled
// Set initial display based on default input value
timeInSeconds = (parseInt(durationInput.value) || 5) * 60;
updateDisplay();
