// CUSTOM ACTIONS
var aboutTab = 0;
var globalItem = "";
function addProject() {
    $("#project-name,#project-description").val("");
    showHideDeleteButton('project-popup', "none");
    setFormAction('project-popup', '/create_project');
    showPopup('project-popup');
}

function editProject(projectIndex) {
    showHideDeleteButton('project-popup', "block");
    setFormAction('project-popup', '/update_project');
    showPopup('project-popup');
}

function addCard() {
    showHideDeleteButton('card-popup', "none");
    setFormAction('card-popup', '/create_task');
    showPopup('card-popup');
}

function editCard(card) {
    showHideDeleteButton('card-popup', "block");
    setFormAction('card-popup', '/update_task');
    showPopup('card-popup');

    // // TODO: This part will be replaced once back-end is set up
    // document.getElementById('card-name').value = card.getElementsByTagName('h4')[0].innerHTML.trim();
}

function setFormAction(parent, actionPath) {
    var i = document.getElementById(parent);
    var j = i.getElementsByTagName('form')[0];
    j.setAttribute('action', actionPath)
}


function deleteConfirm(item) {
    globalItem = item;
    show("delete-confirm-popup");
}


function deleteConfirm1(actionPath) {
    document.getElementById("delete-confirm-form").setAttribute('action', actionPath);
    show("delete-confirm-popup");
}

// HIDE AND SHOW POP-UPS / FORMS
function showPopup(string) {
    show(string);
    style = "width: auto";
    var i = document.getElementById(string);
    var j = i.getElementsByTagName('input')[0];
    if(i.getElementsByTagName('input').length != 0) {
        j.focus();
    }
}
function show(string) {
    var i = document.getElementById(string);
    var j = i.style.display = "block";
}

function hide(string) {
    var i = document.getElementById(string);
    var j = i.style.display = "none";
}

function showHideDeleteButton(parent, display) {
    var i = document.getElementById(parent);
    var j = i.getElementsByClassName('red-button')[0];
    j.style.display = display;
}

// ABOUT SECTION
function launchAbout() {
    showPopup('about-popup');
    aboutTab = 0;
    showTab();
}

function showTab() { 
    var parent = document.getElementById('about');
    var children = parent.getElementsByClassName('container');
    var steps = parent.getElementsByClassName('step');
    for (var i=0; i<children.length; ++i) {
        var child = children[i];
        var step = steps[i];
        if (aboutTab == i) { 
            child.style.display = "block";
            step.className += " active";
        }
        else {
            child.style.display = "none";
            step.className = step.className.replace(" active", "");
        }
    }
    
    var prevButton = document.getElementsByClassName('prev-button')[0];
    var nextButton = document.getElementsByClassName('next-button')[0];
    prevButton.style.display = "inline-block";
    nextButton.style.display = "inline-block";
    if (aboutTab == 0) {
        prevButton.style.display = "none";
    }
    if (aboutTab == (steps.length-1)) { 
        nextButton.style.display = "none";
    }
}

function navigateAbout(n) {
    aboutTab += n;
    console.log(aboutTab);
    showTab();
}

function closeAbout() {
    aboutTab=-1;
    hide('about-popup');
}

function sideNavPush(el) {
    el.classList.toggle("change");
    if (document.getElementById("sidenav-menu").style.display === "block") {
        document.getElementById("sidenav").style.width = "40px";
        document.getElementById("main-window").style.marginLeft = "40px";
        document.getElementById("sidenav-menu").style.display = "none";
    }
    else {
        document.getElementById("sidenav").style.width = "160px";
        document.getElementById("main-window").style.marginLeft = "160px";
        document.getElementById("sidenav-menu").style.display = "block";
    }
}

// VALIDATION

function passwordMatch(input) {
    if(document.getElementById('rpword').value !== document.getElementById('pword').value) {
        document.getElementById('rpword').setCustomValidity("Passwords do not match!");
        document.getElementById('rpword').focus;
    }
}

// CHANGELOG
function viewChangelog() {
    // var data = res.changelog
    if (document.getElementById("changelog-container").style.display === "block") {
        document.getElementById("changelog").style.width = "0px";
        // document.getElementById("main-window").style.marginRight = "0px";
        document.getElementById("changelog-container").style.display = "none";
    }
    else {
        document.getElementById("changelog").style.width = "400px";
        // document.getElementById("main-window").style.marginRight = "300px";
        document.getElementById("changelog-container").style.display = "block";
    }
}

/* Password validation */
function validate_passwords() {
    if (document.getElementById('pword').value.length < 8) {
      document.getElementById('pword-error-text').innerHTML = "Passwords must be at least 8 characters long";
         document.getElementById('pword').focus;
    }
    else if (document.getElementById('pword').value !== document.getElementById('rpword').value) {
        document.getElementById('pword-error-text').innerHTML = "Passwords dont match. Try again";
        document.getElementById('pword').focus;
    }
    else {
        document.getElementById('pword-error-text').innerHTML = "";
        hide('form-register'); 
        show('form-user-details');
    }
}

/* Expertise validation */
function validate_expertise() {
    var checked = false;

    /* validate checkboxes*/
    var cb_elements = document.getElementsByName("expertise");
    for (var i = 0; i < cb_elements.length; i++) {
        if (cb_elements[i].checked) {
        document.getElementById('expertiseText').value = '';
        checked = true;
        break;
        }
    }

    if (!checked) {
        document.getElementById('expertiseText').innerHTML = 'Please select at least 1 expertise';
        checked = false;
    }

    return checked;
}
