function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    let finalTranscript = '';

    recognition.onresult = function(event) {
        const voiceMessage = event.results[0][0].transcript;

        // Check if the message contains "over"
        if (voiceMessage.toLowerCase().includes('over')) {
            // Append only the part before "over" to finalTranscript
            finalTranscript += voiceMessage.split('over')[0].trim() + ' ';
            recognition.stop(); // Stop the recognition
        } else {
            finalTranscript += voiceMessage + ' ';
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        alert('An error occurred during speech recognition: ' + event.error);
    };

    recognition.onend = function() {
        console.log('Speech recognition service disconnected');
        document.getElementById('voiceMessageContent').innerText = finalTranscript.trim();
        document.getElementById('voiceMessageContent').dataset.message = finalTranscript.trim();
        document.getElementById('messageContainer').style.display = 'block';
    };
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+\d{1,12}$/;
    return phoneRegex.test(phoneNumber);
}

function makeCall() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const phoneError = document.getElementById('phoneError');
    const message = document.getElementById('voiceMessageContent').dataset.message || 'Default message if no voice input';

    // Validate the phone number
    if (!phoneNumber) {
        phoneError.textContent = 'Please enter a phone number.';
        return;
    } else if (!isValidPhoneNumber(phoneNumber)) {
        phoneError.textContent = 'Please enter a valid phone number with up to 12 characters, including only numbers and the "+" symbol.';
        return;
    } else {
        phoneError.textContent = ''; // Clear any previous error
    }

    fetch('/api/makeCall', {  // Correct API path for Vercel
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, message })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}


// Restrict input to numbers and "+" symbol only
document.getElementById('phoneNumber').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^\d+]/g, '');
});
