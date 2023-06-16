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
    firebase.database().ref('OnlineUsers/Count').once('value')
  .then(function(snapshot) {
    const count = snapshot.val();
    document.getElementById('onlineUsers').textContent = 'Online User Count: ' + count;
  })
  .catch(function(error) {
    console.log("Error retrieving online user count:", error);
  });

 // Start of send a suggestion
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
// Start of topics
// Add Topic button click event
const addTopicButton = document.getElementById('addTopicButton');
addTopicButton.addEventListener('click', function() {
    const topicFormContainer = document.getElementById('topicFormContainer');
    topicFormContainer.style.display = 'block';
});

// Cancel Topic button click event
const cancelTopicButton = document.getElementById('cancelTopicButton');
cancelTopicButton.addEventListener('click', function() {
    document.getElementById('topicSubject').value = ''; // Clear subject field
    document.getElementById('topicBody').value = ''; // Clear body field
    document.getElementById('topicFormContainer').style.display = 'none'; // Hide the form
});

// Submit Topic button click event
const submitTopicButton = document.getElementById('submitTopicButton');
submitTopicButton.addEventListener('click', function() {
    const topicSubject = document.getElementById('topicSubject').value;
    const topicBody = document.getElementById('topicBody').value;

    if (topicSubject.trim() === '' || topicBody.trim() === '') {
        alert('Please fill in both the subject and body fields.');
        return;
    }

    const newTopicRef = firebase.database().ref('Topics').push();
    newTopicRef.set({
        subject: topicSubject,
        body: topicBody,
        date: Date.now()
    }, function(error) {
        if (error) {
            console.log('Failed to add topic:', error);
        } else {
            console.log('Topic added successfully!');
            // Clear the form fields
            document.getElementById('topicSubject').value = '';
            document.getElementById('topicBody').value = '';
            document.getElementById('topicFormContainer').style.display = 'none'; // Hide the form
        }
    });
});

// Listen for changes in the topics and update the UI
const topicsList = document.getElementById('topicsList');
firebase.database().ref('Topics').orderByChild('date').on('value', function(snapshot) {
    topicsList.innerHTML = ''; // Clear the existing topics

    // Create an array to store the topics
    const topics = [];

    snapshot.forEach(function(childSnapshot) {
        const topic = childSnapshot.val();
        topics.push({ key: childSnapshot.key, ...topic });
    });

    // Sort the topics array by timestamp in ascending order (oldest first)
    topics.sort(function(a, b) {
        return a.date - b.date;
    });

    // Render the sorted topics
    topics.forEach(function(topic) {
        const topicElement = document.createElement('div');
        topicElement.classList.add('topic-box'); // Add the 'topic-box' class

        // Create the HTML structure for the topic subject
        const topicSubjectHTML = `
            <h3>${topic.subject}</h3>
        `;

        topicElement.innerHTML = topicSubjectHTML;
        topicsList.appendChild(topicElement);
    });

        // Add click event listener to expand/collapse topic body.
// Start of topics

// Add click event listener to expand/collapse topic body
topicsList.addEventListener('click', function(event) {
    const topicElement = event.target.closest('.topic-box');
    if (topicElement) {
        const topicBody = topicElement.querySelector('.topic-body');
        topicBody.classList.toggle('expanded');
    }
    // Check browser compatibility
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
  
    // Configure speech recognition settings
    recognition.continuous = false;
    recognition.interimResults = false;
  
    // Function to handle recognized speech
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      processSpeech(transcript);
    };
  
    // Function to process recognized speech
    function processSpeech(transcript) {
      // Add your logic here to handle the recognized speech
      // You can perform actions based on the recognized commands or trigger specific functionality
      console.log('Recognized speech:', transcript);
      // Example: If transcript contains "show announcements", display the announcements box
      if (transcript.toLowerCase().includes('show announcements')) {
        hideBoxes();
        setActiveTab(document.querySelector('.tabs a[href="#announcements"]'));
        showBox(announcementsBox);
      }
      // Example: If transcript contains "sign out", call the signOut function
      if (transcript.toLowerCase().includes('sign out')) {
        signOut();
      }
    }
  
    // Function to start speech recognition
    function startRecognition() {
      recognition.start();
      console.log('Speech recognition started');
    }
  
    // Function to stop speech recognition
    function stopRecognition() {
      recognition.stop();
      console.log('Speech recognition stopped');
    }
  
    // Add event listeners for voice commands
    const voiceCommandButton = document.getElementById('voiceCommandButton');
    voiceCommandButton.addEventListener('click', startRecognition);
  
    // You can also add voice commands to specific elements or buttons
    const signOutButton = document.getElementById('signOutButton');
    signOutButton.addEventListener('click', function() {
      // Call the signOut function directly when the button is clicked
      signOut();
    });
  } else {
    console.log('Speech recognition not supported');
  }
  // Function to speak the given text using the Web Speech API
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
  
  // Function to enable voice chat functionality
  function enableVoiceChat() {
    const voiceChatButton = document.getElementById('voiceChatButton');
  
    // Check if the browser supports the SpeechRecognition API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
  
      // Start listening when the voice chat button is clicked
      voiceChatButton.addEventListener('click', function () {
        recognition.start();
      });
  
      // Handle the recognition result
      recognition.addEventListener('result', function (event) {
        const transcript = event.results[0][0].transcript;
        const textInput = document.activeElement;
  
        // If there is an active text input element, insert the transcript
        if (textInput && textInput.tagName === 'INPUT') {
          const startPosition = textInput.selectionStart;
          const endPosition = textInput.selectionEnd;
          textInput.value =
            textInput.value.substring(0, startPosition) +
            transcript +
            textInput.value.substring(endPosition);
        } else {
          // Otherwise, speak the transcript
          speak(transcript);
        }
      });
  
      // Stop listening when the voice recognition ends
      recognition.addEventListener('end', function () {
        recognition.stop();
      });
    } else {
      // SpeechRecognition API is not supported
      voiceChatButton.style.display = 'none';
      console.log('SpeechRecognition API is not supported in this browser.');
    }
  }
  
  // Call the enableVoiceChat function to enable voice chat functionality
  enableVoiceChat();
// Get references to the HTML elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const transcriptionDiv = document.getElementById('transcription');

// Create a SpeechRecognition object
const recognition = new webkitSpeechRecognition();

// Set properties for the recognition
recognition.continuous = true; // Continuous listening
recognition.interimResults = true; // Show interim results

// Event listener for the start button
startBtn.addEventListener('click', () => {
  recognition.start();
});

// Event listener for the stop button
stopBtn.addEventListener('click', () => {
  recognition.stop();
});

// Event listener for receiving speech recognition results
recognition.addEventListener('result', (event) => {
  const transcript = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join('');

  // Display the transcription in the HTML element
  transcriptionDiv.textContent = transcript;

});
});
