document.addEventListener('DOMContentLoaded', () => {
    const seatMap = document.getElementById('seat-map');
    const selectedSeatsDisplay = document.getElementById('selected-seats');
    const resetButton = document.getElementById('reset-seats');
    const lockButton = document.getElementById('lock-seats');
    const unlockButton = document.getElementById('unlock-seats');
    const addFlightForm = document.getElementById('add-flight-form');
    const deleteFlightForm = document.getElementById('delete-flight-form');
    let selectedSeats = [];

    fetchSeats();

    function fetchSeats() {
        fetch('http://localhost:5000/api/seats')
            .then(response => response.json())
            .then(seats => {
                seats.forEach(seat => {
                    const seatElement = createSeat(seat);
                    seatMap.appendChild(seatElement);
                });
            });
    }

    function createSeat(seatData) {
        const seat = document.createElement('div');
        seat.classList.add('seat', seatData.status);
        seat.dataset.id = seatData._id;
        seat.dataset.row = seatData.row;
        seat.dataset.col = seatData.col;
        seat.textContent = `${seatData.row}${String.fromCharCode(65 + seatData.col)}`;

        if (seatData.status === 'available') {
            seat.addEventListener('click', () => toggleSeatSelection(seat));
        }

        return seat;
    }

    function toggleSeatSelection(seat) {
        const seatId = seat.dataset.id;

        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            updateSeatStatus(seatId, 'available');
            selectedSeats = selectedSeats.filter(id => id !== seatId);
        } else {
            seat.classList.add('selected');
            updateSeatStatus(seatId, 'selected');
            selectedSeats.push(seatId);
        }

        updateSelectedSeatsDisplay();
    }

    function updateSeatStatus(seatId, status) {
        fetch(`http://localhost:5000/api/seats/${seatId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        }).then(response => response.json())
          .then(data => console.log('Seat updated:', data))
          .catch(err => console.error('Error updating seat:', err));
    }

    function updateSelectedSeatsDisplay() {
        if (selectedSeats.length > 0) {
            selectedSeatsDisplay.textContent = `You have selected: ${selectedSeats.join(', ')}`;
        } else {
            selectedSeatsDisplay.textContent = 'You have selected: None';
        }
    }

    function resetSelectedSeats() {
        selectedSeats = [];
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
            updateSeatStatus(seat.dataset.id, 'available');
        });
        updateSelectedSeatsDisplay();
    }

    function lockSelectedSeats() {
        selectedSeats.forEach(seatId => {
            updateSeatStatus(seatId, 'occupied');
        });
        resetSelectedSeats();
    }

    function unlockSelectedSeats() {
        selectedSeats.forEach(seatId => {
            updateSeatStatus(seatId, 'available');
        });
        resetSelectedSeats();
    }

    function addFlight(event) {
        event.preventDefault();
        const flightNumber = document.getElementById('flight-number').value;

        // Add flight logic here (e.g., API call to add flight)

        alert(`Flight ${flightNumber} added.`);
    }

    function deleteFlight(event) {
        event.preventDefault();
        const flightNumber = document.getElementById('delete-flight-number').value;

        // Delete flight logic here (e.g., API call to delete flight)

        alert(`Flight ${flightNumber} deleted.`);
    }

    resetButton.addEventListener('click', resetSelectedSeats);
    lockButton.addEventListener('click', lockSelectedSeats);
    unlockButton.addEventListener('click', unlockSelectedSeats);
    addFlightForm.addEventListener('submit', addFlight);
    deleteFlightForm.addEventListener('submit', deleteFlight);
});
