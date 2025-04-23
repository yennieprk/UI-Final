document.addEventListener('DOMContentLoaded', function() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link-custom').forEach(link => link.classList.remove('active'));
    // Add active class to About link
    document.querySelector('a[href="/about"]').classList.add('active');
});
//hello
