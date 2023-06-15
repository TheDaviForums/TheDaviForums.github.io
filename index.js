const firebaseConfig = {
    apiKey: "AIzaSyA0lgyqDkVdCJrC0u6T1_mv9jIJZDDvxDw",
    authDomain: "thedaviforums.firebaseapp.com",
    databaseURL: "https://thedaviforums-default-rtdb.firebaseio.com",
    projectId: "thedaviforums",
    storageBucket: "thedaviforums.appspot.com",
    messagingSenderId: "208690814999",
    appId: "1:208690814999:web:d1d48bbe6028debbc4bc52",
    measurementId: "G-FM0NSTQLXQ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  var ref = database.ref('members');
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

firebase.auth().onAuthStateChanged(function(user) {
    const userIdElement = document.getElementById('myid');
    // Check if there is a current user signed in.
    if (user) {
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
      window.location.href = 'html/login.html';
    });
    }
  });
  function signOut(){
    firebase.database().ref('OnlineUsers/Count').set(firebase.database.ServerValue.increment(-1));
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      alert('User Signed Out')
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }
  firebase.database().ref('OnlineUsers/Count').once('value')
  .then(function(snapshot) {
    const count = snapshot.val();
    document.getElementById('onlineUsers').textContent = 'Online User Count: ' + count;
  })
  .catch(function(error) {
    console.log("Error retrieving online user count:", error);
  });

  //Start of announments
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
    document.getElementById('announcementSubject').value = '';
    document.getElementById('announcementBody').value = '';
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
        body: announcementBody
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
firebase.database().ref('announcements').on('value', function(snapshot) {
    announcementsList.innerHTML = ''; // Clear the existing announcements
    
    snapshot.forEach(function(childSnapshot) {
        const announcement = childSnapshot.val();
        const announcementElement = document.createElement('div');
        announcementElement.innerHTML = `<h3>${announcement.subject}</h3><p>${announcement.body}</p>`;
        announcementsList.appendChild(announcementElement);
    });
});
});