document.addEventListener('DOMContentLoaded', function() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link-custom').forEach(link => link.classList.remove('active'));
    // Add active class to Quiz link
    document.querySelector('a[href="/quiz"]').classList.add('active');
});
