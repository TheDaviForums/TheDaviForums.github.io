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