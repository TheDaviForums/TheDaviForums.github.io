const firebaseConfig = {
  apiKey: "AIzaSyA0lgyqDkVdCJrC0u6T1_mv9jIJZDDvxDw",
  authDomain: "thedaviforums.firebaseapp.com",
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

     function login() {
      var email = document.getElementById("email").value
      var password = document.getElementById("password").value
        expression = /^[^@]+@\w+(\.\w+)+\w$/
        if (expression.test(email) == false || password < 6) {
          alert('Email or Password is Outta Line!!')
          return
        }
        auth.signInWithEmailAndPassword(email, password).then(function() {
          // Declare user variable
          var user = auth.currentUser
          // Add this user to Firebase Database
          var database_ref = database.ref()

          var user_data = {
            last_login : Date.now()
          }
          // Push to Firebase Database
    var updatePromise = database_ref.child('members/' + user.uid).update(user_data)
    var updatePromise = database_ref.child('admins/' + user.uid).update(user_data)
    //Increment online count by one
    firebase.database().ref('OnlineUsers/Count').set(firebase.database.ServerValue.increment(1));


    // Return the update promise
    return updatePromise;
  }).then(() => {
    alert('User Logged In!!')
    window.location.href = "https://thedaviforums.github.io/"
  }).catch(function(error) {
    // Firebase will use this to alert of its errors
    alert(error.message)
    //location.href = "https://mean-green-deal.github.io";
  });
}

  function registerUser() {
    var registerUser = document.getElementById("newUser").value
    var registerEmail = document.getElementById("newEmail").value
    var registerPassword = document.getElementById("newPassword").value
    var registerConfirmPassword = document.getElementById("confirmPassword").value
    auth.createUserWithEmailAndPassword(registerEmail, registerPassword).then(function() {
      // Declare user variable
      var user = auth.currentUser
      // Add this user to Firebase Database
      var database_ref = database.ref()
      // Create User data
      var user_data = {
        registerEmail : registerEmail,
        registerUser : registerUser,
        last_login : Date.now(),
      }
      // Push to Firebase Database
      //database_ref.child('users/' + user.uid).set(user_data)
        //NEW REDIRECT//
        var updatePromise = database_ref.child('members/' + user.uid).set(user_data)

      //increment online count by one
      firebase.database().ref('OnlineUsers/Count').set(firebase.database.ServerValue.increment(1));




      //NEW REDIRECT//
        return updatePromise;
    }).then(() => {
        alert('User Logged In!!')
        window.location.href = "https://thedaviforums.github.io/"
      }).catch(function(error) {
        // Firebase will use this to alert of its errors
        alert(error.message)
        //location.href = "https://mean-green-deal.github.io";
      });
    expression = /^[^@]+@\w+(\.\w+)+\w$/

    if (expression.test(registerEmail) == false || registerPassword < 6) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  ///////////////////////////////Valid Credentials ///////////////////////////////////////////
  
  if (registerUser.length < 3) return alert("That username is too short.");
  
  else if (registerEmail.length < 3) return alert("That email is too short.");
  
  else if(emailRegex(registerEmail) == false) return alert("Invalid email.");
  
  else if (registerPassword.length < 3) return alert("That password is too short.");

  for (i = 0; i <LoginInfo.length; i++){
      if(registerUser==LoginInfo[i].username){
          alert("That username is already in use, choose another")
          return
      }
  }
  for (i = 0; i <LoginInfo.length; i++){
      if(registerEmail==LoginInfo[i].email){
          alert("That email is already in use, choose another")
          return
      }
  }
  if (registerPassword == registerConfirmPassword)
  {
      var newUser = {
          username: registerUser,
          email: registerEmail
      }
      LoginInfo.push(newUser)
      alert("Your Account has been created!")

      location.href = '/';
      return
  }
  else{
      alert("Passwords do not match. Try again")
      return
  }
  }

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContext = message;
    messageElement.classList.remove("form__message--success", "form_message-error");
    messageElement.classList.add('form__message--${type}');
}

//setFormMessage(loginFoirm, "success", "You're logged in!");

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input-error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";

}
///////////////////////////////Valid Credentials///////////////////////////////////////////


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    //Tutorial's login method.
/*
    loginForm.addEventListener("submit", e=> {
        e.preventDefault();

        // Perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id == "newUser" && e.target.value.length > 0 && e.target.value.length < 4) {
                setInputError(inputElement, "Username must be at least 4 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        })
    });
    */
   
});
/*
//FIREBASE DATABASE AUTHENTICATION
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFvVTARYzQrWvE9OXCTY3JV3o9SxHbJ7U",
  authDomain: "mean-green-deal-726f9.firebaseapp.com",
  projectId: "mean-green-deal-726f9",
  storageBucket: "mean-green-deal-726f9.appspot.com",
  messagingSenderId: "747867835951",
  appId: "1:747867835951:web:084db4a1feb703eafe00da",
  measurementId: "G-2QKNB5QXF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, user => {
    if(user != null){
        console.log('logged in!');
    }else{
        console.log('No user');
    }
});
*/