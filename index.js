const firebaseConfig = {
    apiKey: "AIzaSyAFvVTARYzQrWvE9OXCTY3JV3o9SxHbJ7U",
    authDomain: "mean-green-deal-726f9.firebaseapp.com",
    projectId: "mean-green-deal-726f9",
    storageBucket: "mean-green-deal-726f9.appspot.com",
    messagingSenderId: "747867835951",
    appId: "1:747867835951:web:084db4a1feb703eafe00da",
    measurementId: "G-2QKNB5QXF4"
  };
  
// JavaScript code to handle the click event and show/hide the boxes
document.addEventListener('DOMContentLoaded', function() {
    var announcementsBox = document.getElementById('announcements-box');
    var topicsBox = document.getElementById('topics-box');
    var musicBox = document.getElementById('music-box');
    var suggestionsBox = document.getElementById('suggestions-box');
    var tabs = document.querySelectorAll('.tabs a');

    function showBox(box) {
        box.style.display = 'block';
    }

    function hideBoxes() {
        var boxes = [announcementsBox, topicsBox, musicBox, suggestionsBox];
        boxes.forEach(function(box) {
            box.style.display = 'none';
        });
    }

    function setActiveTab(tab) {
        tabs.forEach(function(tab) {
            tab.classList.remove('active');
        });
        tab.classList.add('active');
    }

    function handleTabClick(event) {
        event.preventDefault();
        var clickedTab = event.target;
        hideBoxes();
        setActiveTab(clickedTab);
        if (clickedTab.getAttribute('href') === '#announcements') {
            showBox(announcementsBox);
        } else if (clickedTab.getAttribute('href') === '#topics') {
            showBox(topicsBox);
        } else if (clickedTab.getAttribute('href') === '#music') {
            showBox(musicBox);
        } else if (clickedTab.getAttribute('href') === '#suggestions') {
            showBox(suggestionsBox);
        }
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', handleTabClick);
    });
});

firebase.auth().onAuthStateChanged(function(members) {
    const userIdElement = document.getElementById('myid');
    // Check if there is a current user signed in.
    if (members) {
      // Get the user's email.
      const email = user.email;
      // Set the HTML content of the span element to the user's email.
      userIdElement.innerHTML = email;
      signOutButtonContainer.style.display = 'inline'; // Show the sign out button when user is logged in
    } else {
      // If no user is signed in, display "Guest" as the user ID.
      userIdElement.innerHTML = 'Login/Sign Up';
      signOutButtonContainer.style.display = 'none'; // Hide the sign out button when user is not logged in
      // Add a click event listener to the authButton
      const authButton = document.getElementById('authButton');
      authButton.addEventListener('click', function() {
      // Redirect to your login page
      window.location.href = 'content/login.html';
    });
    }
  });