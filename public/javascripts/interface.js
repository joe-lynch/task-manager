var beforeCard;
var current_project=0;
var len = 0;
var current_task="";
var users = new Array();
var global_flag = false;
var ignore_duplicate = new Array();
onload = function(){
    // document.getElementById("last-modified").innerHTML = "Last modified: " + document.lastModified.split(" ")[0];
    
    $("#delete_task").click(function(){
        console.log("item: ",globalItem)
        if(globalItem == "project")
            $.post("/delete_project", "project_id="+get_current_project());    
        else if(globalItem == "task")
            $.post("/delete_task", "parent_project="+get_current_project()+"&task_name="+get_current_task());
    });

     $(".edit-icon").on("click", function(e){
        e.stopPropagation();
        $.get("/get_project_info", "project_id="+get_current_project(), function(data){
            var data = JSON.parse(data);
            console.log(data);
            var t = new Date(data[2]);
            $("#project-name").val(data[0]);
            $("#project-description").val(data[1]);
            $("#kickoff-date").val(t);
        });
        editProject($(this).parent().attr('id'));
    });

    //* SETUP listeners and drag and drop *//
    //* SideNav dropdown menus */
    var dropdowns = document.getElementsByClassName("sidenav-dropdown");
    var d;
    for (d = 0; d < dropdowns.length; d++) {
        dropdowns[d].addEventListener("click", function() {
            var dropdownContent = this.nextElementSibling;
                    if (dropdownContent.style.display === "block") {
                    dropdownContent.style.display = "none";
                    } else {
                    dropdownContent.style.display = "block";
                    }
        });
    }
    //* Cards - listeners; drag & drop *//
    var cards = document.getElementsByClassName("kanban-card");
    var c;
    for (c = 0; c < cards.length; c++) {
        $(cards[c]).on("click mouseenter", function() { 
            console.log("okay");
            var task = $(this).children()[0].innerText;
            set_current_task(task);
            //$('#task-name,#task-description,#required-skills,#task-due-date,'+
              //  '#priority,#dependencies,#estimate').val("");
            $('#original_task_name').val(task);
            $.get("/get_task_info", "parent_project="+get_current_project()+"&task_name="+task, function(data){
                var data = JSON.parse(data);
                console.log(data);
                $("#task-name").val(data[0]);
                $("#task-description").val(data[1]);
                var checkBoxes = new Array('#cb_2', '#cb_3', '#cb_4', '#cb_5', '#cb_6');
                for(var i=0; i<checkBoxes.length; i++){
                    $(checkBoxes[i]).prop('checked', false);
                    if ($(checkBoxes[i]).val() == data[2]){
                        $(checkBoxes[i]).prop('checked', true);
                    }
                }
                $("#assigned-to input").val(data[3]);
                $("#task-due-date").val(data[4]);
                $("#priority").val(data[5]);
                $("#estimate").val(data[7]);

            });
        });

        cards[c].addEventListener("click", function() { editCard(this);});
        cards[c].setAttribute("draggable", "true");
        cards[c].setAttribute("ondragstart", "drag(event)");
        cards[c].setAttribute("ondragover", "makeGap(this)");
        cards[c].setAttribute("ondragleave", "dragLeave(this)");
        cards[c].setAttribute("ondrop", "closeGap(this)");
        cards[c].setAttribute("id","card"+c); // have to set card Ids as a reference for dragging
    }
    
    //* Card containers - drag & drop *//
    var containers = document.getElementsByClassName("kanban-card-container");
    var co;
    for (co = 0; co < containers.length; co++) {
        containers[co].setAttribute("ondragover","allowDrop(event)");
        containers[co].setAttribute("ondrop","drop(event,this)");
        containers[co].setAttribute("id","column"+co); // have to set card Ids as a reference for dragging
    }
    
    //* Add card buttons - listeners *//
    var addCardBtns = document.getElementsByClassName("kanban-add-card");
    var addCardBtn;
    for (addCardBtn = 0; addCardBtn < addCardBtns.length; addCardBtn++) {
        addCardBtns[addCardBtn].addEventListener("click", function() {
            ignore_duplicate = new Array();
            $('#task-name,#task-description,#required-skills,#task-due-date,'+
            '#priority,#dependencies,#estimate').val("");
            var checkBoxes = new Array('#cb_2', '#cb_3', '#cb_4', '#cb_5', '#cb_6');
            for(var i=0; i<checkBoxes.length; i++){
                if ($(checkBoxes[i]).is(":checked")){
                    $(checkBoxes[i]).prop('checked', false);
                }
            }

            addCard();
     });
    }
    
    //* Add project + user listeners *//
    // $('#mydiv').on('click', '*', editProject())

    //* ADD STATUS BAR FUNCTIONALITY *//
  var error = document.getElementById('status-bar-error')
  if(error) {
    var statusBar = document.getElementsByClassName('status-bar')[0];
        statusBar.innerHTML = error.innerHTML;
        statusBar.style.display = 'inline-block';
        setTimeout(function() {
            statusBar.style.display = 'none';
        }, 5000);
  }

  /* add logic so you can press enter on rpword field to proceed to sign up modal */
  $("#rpword").keypress(function(event) {
    if (event.keyCode === 13) {
      validate_passwords();
    }     
  });
  
    /*
    $("delete_task").click(function(){
        $.post("/delete_task")
    })
*/
    // PROJECT DETAILS
    var arr= new Array();
    for(var i=0; i<len; i++){
        arr.push("#"+i);
    }

    $.each(arr, function(key, value) {
        $(value).click(function() {
            $.post("/current_project", "project_name="+$(value)[0].innerText);
            location.reload(true);
            //window.location.search = jQuery.query.set("project_name", $(value)[0].innerHTML);
        });
    });

    $("#suggest").click(function(){

        $('#assigned-to input').focus();
        var parent_project = get_current_project();
        var checkBoxes = new Array('#cb_2', '#cb_3', '#cb_4', '#cb_5', '#cb_6');
        var task_expertise = new Array();
        for(var i=0; i<checkBoxes.length; i++){
            if ($(checkBoxes[i]).is(":checked")){
                task_expertise.push($(checkBoxes[i]).val());
            }
        }
        $.post("/assign_task", "parent_project="+parent_project+"&task_expertise="+task_expertise, function(data){
            var data = JSON.parse(data);
            console.log(data);
            if(data.length == 0){
                $('#assigned-to input').attr('placeholder', 'Suggested users will list below if available!').val("").focus();
            }
            else{
                $('#assigned-to input').attr('placeholder', 'Suggested users are listed below!').val("").focus();
            }
            $('#assign-users').empty();
            for(var i=0; i<data.length;i++){
                $('#assign-users').append("<option value='" + data[i] + "'>");
            }
            
        });
    });
}

function showStatusBar(message2) {
        document.getElementById('status-bar-message').innerHTML = message2;
        var statusBar = document.getElementsByClassName('status-bar')[0];
        statusBar.style.display = 'inline-block';
        setTimeout(function() {
            statusBar.style.display = 'none';
        }, 5000);
}

function set_this(s){
    len = s
}

function set_suggested_users(data){
    users = data;
}

// DATA RETRIEVAL + FILLING FORMS
function set_current_task(task){
    current_task = task;
    console.log("set_current_task: ", current_task);
}

function get_current_task(){
    console.log("current_task: ", current_task);
    return current_task;
}

function set_current_project(project){
current_project = project;
}

function get_current_project(){
return current_project;
}

/* DRAG & DROP FUNCTIONALITY */
function drag(ev) {
    var curr_proj = get_current_project();
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("name", ev.target.innerText);
    ev.dataTransfer.setData("parent", curr_proj);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev, el) {
    ev.preventDefault();
    //find the element the mouse .is over
    // var x = event.clientX, y = event.clientY, beforeCard = document.elementFromPoint(x, y);
    var data = ev.dataTransfer.getData("text");
    var name = ev.dataTransfer.getData("name");
    var parent = ev.dataTransfer.getData("parent");
   
    if(ev.path[0].id == 'column0'){
        $.post("/update_task_index", "task_index=0&parent_project="+parent+"&task_name="+name.trim());
    }
    else if(ev.path[0].id == 'column1'){
        $.post("/update_task_index", "task_index=1&parent_project="+parent+"&task_name="+name.trim());
    }
    else if(ev.path[0].id == 'column2'){
        $.post("/update_task_index", "task_index=2&parent_project="+parent+"&task_name="+name.trim());
    }
    //console.log(data);
    if(beforeCard)
        el.insertBefore(document.getElementById(data), beforeCard);
    else
        el.appendChild(document.getElementById(data));

}

function makeGap(el) {
    var mTop = el.style.marginTop.value;
    el.style.marginTop = "20px";
    beforeCard = el;
}

function dragLeave(el) {
    beforeCard = null;
    closeGap(el);
}

function closeGap(el) {
    el.style.marginTop = "8px";
}
