// Function to show the "why?" modal
function showWhy() {
    const modal = document.getElementById('whyModal');
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('whyModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('whyModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('whyModal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});
