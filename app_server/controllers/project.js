var controller_account = require("../controllers/account");
const Project = require('../models/project');
const Account = require('../models/account');


/* This should load the dashboard pug file */
module.exports.dashboard = function(req, res, next){
  //console.log("--- render the dashboard ---");
  res.render('dashboard', {
        user : req.user,
        account_details: res.account,
        accounts_details: res.accounts,
        projects: res.projects
    }); 
};

/* This is called to load the projects for the logged in user */
module.exports.load_project = (req, res, next) => {
    //console.log("--- load project ---");
    Project.find
    (
        /* gets the logged in user */
        {project_users: res.account.username}, 

        /* stores projects so it can be loaded in dashboard pug */
        function(err, projects){
            if (err) console.log("PROJECT LOAD ERROR: ", err.message);
            res.projects = projects;
            next();
        }
    );
};


module.exports.get_project_info = (req, res) => {

    Project.find
    (
        {_id: req.query.project_id},

        function(err, returnInfo){
            var sendArray = new Array(
                returnInfo[0].project_name,
                returnInfo[0].project_description,
                returnInfo[0].project_start_date,
                returnInfo[0].project_end_date);

            console.log("sendarr: ", sendArray);

            res.send(JSON.stringify(sendArray));
        }
    )
}

/*  ######################################
    #########  PROJECT METHODS  ##########                      
    ###################################### */

/* This creates a project in the database */
/* This creates a project in the database */
module.exports.create_project = (req, res) => {
  //console.log("--- create project ---");
  //req.user.username);
  //req.body.project_users
  var arr = new Array();
  arr.push(req.user.username);
  if(req.body.project_users){
    arr.push(req.body.project_users);
  }

  console.log(arr);
  
  Project.create
  (
        {
          project_id: req.body.project_id, 
          project_name: req.body.project_name,
          project_description: req.body.project_description,
          project_users: arr,
          project_start_date: req.body.project_start_date,
          project_end_date: req.body.project_end_date,
          current: 0
        },
        function(err, res){ if (err) console.log("PROJECT CREATE ERROR: ", err.message); }
  );
  res.status(200);
  res.redirect('back');
};

/* This updates project details (except for tasks) in the database */
module.exports.update_project = (req, res) => {
  //console.log("--- update project ---");
  console.log(req.body.project_id);
  console.log(req.body.project_name);

  //Project.find({_id: req.body.project_id}, function(err, r){
  //    console.log("r: ",r);
  //});
  Project.find
  (
    {_id:req.body.project_id},

    function(err, project){
        if(err) console.log(err.message);
        console.log(project);
        var current_users = new Array();
        current_users = project[0].project_users
        current_users.push(req.body.project_users);
        console.log("current_users: ", current_users);

        Project.update
        (
                
              {_id: req.body.project_id},

              {$set:
                {
                    project_name: req.body.project_name,
                    project_description: req.body.project_description, 
                    project_end_date: req.body.project_end_date,
                    project_users: current_users
                  }
              },

              function(err, update_project){
                if(err) console.log("ADD USER ERROR", err.message);
                res.redirect('back');
              }
      );
    }
 );
}

/* This deletes a project from the database */
module.exports.delete_project = (req, res) => {
    //console.log("--- delete project ---");
    Project.deleteOne
    (
        /* uses the project id to find the project to delete */
        {_id: req.body.project_id},
        /* error handling */
        function(err, proj){
            if(err) console.log("DELETE PROJECT ERROR: ", err.message);
        }
    );
    res.sendStatus(200);
};

/* This deletes a project from the database */
module.exports.current_project = (req, res) => {
    //console.log("--- set current_project ---");
    //console.log("pn: ", req.body.project_name);
    //console.log(Project.find({current:1}));
    Project.update
    (
        {current: 1},

        {$set:
          {
            current: 0
          }
        },

        function(err, proj){
            if(err) console.log("DELETE PROJECT ERROR: ", err.message);
            //console.log("1: ", proj);
            Project.update
            (
                /* uses the project id to find the project to delete */

                {project_name: req.body.project_name},

                {$set:
                  {
                    current: 1
                  }
                },
                /* error handling */
                function(err, proj){
                    if(err) console.log("DELETE PROJECT ERROR: ", err.message);
                    //console.log("2: ", proj);
                }
            );
        }       

    );
    res.sendStatus(200);
};


//new method needed to add users to project when they accept an invite


/*  ######################################
    ############ TASK METHODS ############                          
    ###################################### */
//update tasks so we know the column it's in                    

/* this creates and adds a task to the specified project */
module.exports.create_task = (req, res) => {
  console.log("--- create task ---");
  console.log("here: ",req.body.assigned_to)
  Project.update
  (
        /* uses the project id to find what project the task belongs to */
        //{project_id: req.body.parent_project},
        {_id: req.body.parent_project},

        /* appends a new task to the tasks in the project */
        {$push: 
          {project_tasks:
            {$each:
              [{
                task_name: req.body.task_name,
                task_description: req.body.task_description,
                task_requiredSkills: req.body.required_skills,
                task_dueDate: req.body.task_due_date,
                task_priority: req.body.task_priority,
                task_assignedTo: req.body.assigned_to,
                task_dependencies: req.body.dependencies,
                task_estimatedHours: req.body.task_estimated_hours,
                task_index: req.body.task_index,
                parent_project: req.body.parent_project
              }]
            }
          }
        },
        /* error handling */
        function(err, create_task){ if(err) console.log("ADD TASK ERROR: ", err); }
  );
  res.status(200);
  res.redirect('back');
};


module.exports.get_task_info = (req, res) => {
    console.log("--- get task info ---");
    console.log(req.query.parent_project);
    console.log(req.query.task_name);

    Project.find
    (
        {
            _id: req.query.parent_project,
            "project_tasks" : {
                $elemMatch : {
                    "task_name" : req.query.task_name
                }
            }
        },

        {
            "project_tasks.$.task_name":req.query.task_name,
            _id:0
        },

        function(err, returnInfo){
            console.log("fd: ",returnInfo[0].project_tasks[0]);
            var sendArray = new Array(
                returnInfo[0].project_tasks[0].task_name,
                returnInfo[0].project_tasks[0].task_description,
                returnInfo[0].project_tasks[0].task_requiredSkills,
                returnInfo[0].project_tasks[0].task_assignedTo,
                returnInfo[0].project_tasks[0].task_dueDate,
                returnInfo[0].project_tasks[0].task_priority,
                returnInfo[0].project_tasks[0].task_dependencies,
                returnInfo[0].project_tasks[0].task_estimatedHours
            );

            res.send(JSON.stringify(sendArray));
        }
    )
}

module.exports.assign_task = (req, res) => {
    console.log("--- assign task ---");
    var sendArray = new Array();
    

    var assign_arr = new Array();
    assign_arr = req.body.task_expertise.split(",")
    console.log(assign_arr);
    Project.find
    (
        {
            _id: req.body.parent_project
        },

        function(err, proj){
            if(err) console.log("ASSIGN TASK ERROR: ", err.message);
            console.log(proj[0].project_users);
            Account.find
            (
                {username: {$in: proj[0].project_users}},

                function(err, acc){
                    var ignore_duplicates = new Array();
                    if(err) console.log("error: ", err.message);
                    for(var j=0; j<assign_arr.length;j++){
                        for(var i=0; i<acc.length;i++){
                            for(var k=0; k<acc[i].expertise.length;k++){
                                console.log(acc[i].expertise[k] + "==" + assign_arr[j]);
                                if(acc[i].expertise[k] == assign_arr[j]){
                                    if(!(ignore_duplicates).includes(acc[i].username)){
                                        ignore_duplicates.push(acc[i].username);
                                    }
                                }
                            }
                        }
                    }
                    console.log(ignore_duplicates);
                    res.send(JSON.stringify(ignore_duplicates));
                }
            );
        }
    );
};

/* this updates task information in the database */
module.exports.update_task = (req, res) => {
    console.log("--- update the whole task ---");
    Project.update
    (
            //change this to task_id
            {
                _id: req.body.parent_project,
                "project_tasks" : {
                    $elemMatch : {
                        "task_name" : req.body.original_task_name
                    }
                }
            },

            /* update the task information */
            {$set:
                {
                    "project_tasks.$.task_name":req.body.task_name,
                    "project_tasks.$.task_description":req.body.task_description,
                    "project_tasks.$.task_requiredSkills":req.body.required_skills,
                    "project_tasks.$.task_dueDate":req.body.task_due_date,
                    "project_tasks.$.task_priority":req.body.task_priority,
                    //"project_tasks.$.task_votes":60,
                    "project_tasks.$.task_assignedTo":req.body.assigned_to,
                    "project_tasks.$.task_dependencies":req.body.dependencies,
                    "project_tasks.$.task_estimatedHours":req.body.task_estimated_hours
                }
            },
            /* error handling */
            function(err, update_task){
                if(err) console.log("UPDATE TASK ASSIGNED TO ERROR: ", err.message);
                res.redirect('back');
            }
    );
    
};

/* this deletes a task from a project */
module.exports.delete_task = (req, res) => {
    console.log("--- delete task ---");
    Project.update
    (
        /* uses project id to get the project parent of the task */
        {_id: req.body.parent_project},
        /* gets task name (probs change to task id) and deletes corresponding task */ 
        {$pull: {project_tasks: {task_name: req.body.task_name}}},
        /* error handling */
        function(err, delete_task){
            if(err) console.log("TASK DELETE ERROR", err.message);
            //console.log()
            res.redirect('/back');
        }
    );
};

module.exports.update_task_index = (req, res) => {
    console.log("--- update task index ---");
    console.log(req.body.parent_project);
    console.log(req.body.task_index);
    Project.update
    (       
            {
                _id: req.body.parent_project,
                "project_tasks" : {
                    $elemMatch : {
                        "task_name" : req.body.task_name
                    }
                }
            },
            /* update the task information */
            {$set:
                {
                    "project_tasks.$.task_index":req.body.task_index
                }
            },
            /* error handling */
            function(err, update_task){ if(err) console.log("UPDATE TASK ASSIGNED TO ERROR: ", err.message); }
    );
    res.sendStatus(200);
}