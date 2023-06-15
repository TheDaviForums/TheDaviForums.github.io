const firebaseConfig = {
    // Your Firebase configuration here
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize variables
  const auth = firebase.auth();
  const database = firebase.database();
  var ref = database.ref('members');
  
  // JavaScript code to handle the click event and show/hide the boxes
  document.addEventListener('DOMContentLoaded', function() {
    var announcementsBox = document.getElementById('announcements');
    var topicsBox = document.getElementById('topics-box');
    var musicBox = document.getElementById('music-box');
    var suggestionsBox = document.getElementById('suggestions');
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
  
    hideBoxes();
  
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
  
    // Start of announcements
    firebase.auth().onAuthStateChanged(function(user) {
      const userIdElement = document.getElementById('myid');
      const addAnnouncementButtonContainer = document.getElementById('addAnnouncementButtonContainer');
  
      if (user) {
        // User is signed in
        userIdElement.innerHTML = user.email;
  
        // Check if the user is an admin
        const adminsRef = firebase.database().ref('admins');
        adminsRef.child(user.uid).once('value', function(snapshot) {
          if (snapshot.exists()) {
            // User is an admin, show the "Add Announcement" button
            addAnnouncementButtonContainer.style.display = 'block';
          } else {
            // User is not an admin, hide the "Add Announcement" button
            addAnnouncementButtonContainer.style.display = 'none';
          }
        });
  
        signOutButtonContainer.style.display = 'inline';
      } else {
        // No user is signed in
        userIdElement.innerHTML = 'Login/Sign Up';
        addAnnouncementButtonContainer.style.display = 'none';
        signOutButtonContainer.style.display = 'none';
  
        const authButton = document.getElementById('authButton');
        authButton.addEventListener('click', function() {
          // Redirect to your login page
          window.location.href = 'html/login.html';
        });
      }
    });
  
    // Add Announcement button click event
    const addAnnouncementButton = document.getElementById('addAnnouncementButton');
    addAnnouncementButton.addEventListener('click', function() {
      const announcementFormContainer = document.getElementById('announcementFormContainer');
      announcementFormContainer.style.display = 'block';
    });
  
    // Cancel Announcement button click event
    const cancelAnnouncementButton = document.getElementById('cancelAnnouncementButton');
    cancelAnnouncementButton.addEventListener('click', function() {
      document.getElementById('announcementSubject').value = ''; // Clear subject field
      document.getElementById('announcementBody').value = ''; // Clear body field
      document.getElementById('announcementFormContainer').style.display = 'none'; // Hide the form
    });
  
    // Submit Announcement button click event
    const submitAnnouncementButton = document.getElementById('submitAnnouncementButton');
    submitAnnouncementButton.addEventListener('click', function() {
      const announcementSubject = document.getElementById('announcementSubject').value;
      const announcementBody = document.getElementById('announcementBody').value;
  
      if (announcementSubject.trim() === '' || announcementBody.trim() === '') {
        alert('Please fill in both the subject and body fields.');
        return;
      }
  
      const newAnnouncementRef = firebase.database().ref('Announcements').push();
      newAnnouncementRef.set({
        subject: announcementSubject,
        body: announcementBody,
        date: Date.now()
      }, function(error) {
        if (error) {
          console.log('Failed to add announcement:', error);
        } else {
          console.log('Announcement added successfully!');
          // Clear the form fields
          document.getElementById('announcementSubject').value = '';
          document.getElementById('announcementBody').value = '';
        }
      });
    });
  
    // Listen for changes in the announcements and update the UI
    const announcementsList = document.getElementById('announcementsList');
    firebase.database().ref('Announcements').orderByChild('date').on('value', function(snapshot) {
      announcementsList.innerHTML = ''; // Clear the existing announcements
  
      // Create an array to store the announcements
      const announcements = [];
  
      snapshot.forEach(function(childSnapshot) {
        const announcement = childSnapshot.val();
        announcements.push(announcement);
      });
  
      // Sort the announcements array by timestamp in ascending order (oldest first)
      announcements.sort(function(a, b) {
        return a.date - b.date;
      });
  
      // Render the sorted announcements
      announcements.forEach(function(announcement) {
        const announcementElement = document.createElement('div');
        announcementElement.classList.add('announcement-box'); // Add the 'announcement-box' class
  
        // Create the HTML structure for the announcement
        const announcementHTML = `
          <h3>${announcement.subject}</h3>
          <p>${announcement.body}</p>
        `;
  
        announcementElement.innerHTML = announcementHTML;
        announcementsList.appendChild(announcementElement);
      });
    });
  
    // Online user count
    firebase.database().ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val()) {
        // User is online
        firebase.database().ref('OnlineUsers/Count').set(firebase.database.ServerValue.increment(1));
      }
    });
  
    // Listen for changes in the online user count and update the UI
    firebase.database().ref('OnlineUsers/Count').on('value', function(snapshot) {
      const count = snapshot.val();
      document.getElementById('onlineUsers').textContent = 'Online User Count: ' + count;
    });
  
    // End of announcements
  
    function signOut() {
      firebase.database().ref('OnlineUsers/Count').set(firebase.database.ServerValue.increment(-1));
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert('User Signed Out');
      }).catch(function(error) {
        // An error happened.
        console.log(error);
      });
    }
  
    firebase.auth().onAuthStateChanged(function(user) {
      const userIdElement = document.getElementById('myid');
      // Check if there is a current user signed in.
      if (user) {
        // Get the user's email.
        const email = user.email;
        // Set the HTML content of the span element to the user's email.
        userIdElement.innerHTML = email;
        signOutButtonContainer.style.display = 'inline'; // Show the sign out button when the user is logged in
      } else {
        // If no user is signed in, display "Login/Sign Up" as the user ID.
        userIdElement.innerHTML = 'Login/Sign Up';
        signOutButtonContainer.style.display = 'none'; // Hide the sign out button when the user is not logged in
        // Add a click event listener to the authButton
        const authButton = document.getElementById('authButton');
        authButton.addEventListener('click', function() {
          // Redirect to your login page
          window.location.href = 'html/login.html';
        });
      }
    });
  
    // Start of suggestions
  
    // Add Suggestion button click event
    const addSuggestionButton = document.getElementById('addSuggestionButton');
    addSuggestionButton.addEventListener('click', function() {
      const suggestionFormContainer = document.getElementById('suggestionFormContainer');
      suggestionFormContainer.style.display = 'block';
    });
  
    // Cancel Suggestion button click event
    const cancelSuggestionButton = document.getElementById('cancelSuggestionButton');
    cancelSuggestionButton.addEventListener('click', function() {
      document.getElementById('suggestionSubject').value = ''; // Clear subject field
      document.getElementById('suggestionBody').value = ''; // Clear body field
      document.getElementById('suggestionFormContainer').style.display = 'none'; // Hide the form
    });
  
    // Submit Suggestion button click event
    const submitSuggestionButton = document.getElementById('submitSuggestionButton');
    submitSuggestionButton.addEventListener('click', function() {
      const suggestionSubject = document.getElementById('suggestionSubject').value;
      const suggestionBody = document.getElementById('suggestionBody').value;
  
      if (suggestionSubject.trim() === '' || suggestionBody.trim() === '') {
        alert('Please fill in both the subject and body fields.');
        return;
      }
  
      const newSuggestionRef = firebase.database().ref('Suggestions').push();
      newSuggestionRef.set({
        subject: suggestionSubject,
        body: suggestionBody,
        date: Date.now()
      }, function(error) {
        if (error) {
          console.log('Failed to add suggestion:', error);
        } else {
          console.log('Suggestion added successfully!');
          // Clear the form fields
          document.getElementById('suggestionSubject').value = '';
          document.getElementById('suggestionBody').value = '';
          document.getElementById('suggestionFormContainer').style.display = 'none'; // Hide the form
        }
      });
    });
  
    // End of suggestions
  });
  