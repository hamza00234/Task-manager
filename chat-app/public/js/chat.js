const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messageLocationButton= document.querySelector('#location')

socket.on('welcome', (w) => {
    console.log(w);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable the send button to prevent multiple submissions
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendmessage', message, () => {
        // Re-enable the send button after message is delivered
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = ''; // Clear the input field
        $messageFormInput.focus(); // Focus back on the input field
        console.log('The message was delivered', message);
    });
});

$messageLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    $messageLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            $messageLocationButton.removeAttribute('disabled');
            console.log('Location shared');

        });
    });
});
