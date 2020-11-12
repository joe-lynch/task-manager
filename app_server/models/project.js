const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tasks = new Schema({
    task_name: {
        type: String,
        required: "The task name is required"
    },
    task_description: {
        type: String,
        required: "The task description is required"
    },
    task_requiredSkills: {
        type: [String],
        required: "The required skills for the task are required"
    },
    task_dueDate: {
        type: Date,
        required: "The task due date is required"
    },
    task_priority: {
        type: String,
        required: "The priority of the task is required"
    },
    task_assignedTo: {
        type: [String],
        required: "The task must be assigned to someone"
    },
    task_dependencies: {
        type: [String]
    },
    task_estimatedHours: {
        type: Number,
    },
    task_index: {
        type: Number,
    },
    parent_project: {
        type: String
    }
});

const Project = new Schema({
    project_id: {
        type:String //probs don't need this, used for testing
    },
    project_name: {
        type:String,
        required: "The project name is required"
    },
    project_description: {
        type:String,
        required: "The project description is required"
    },
    project_users: {
        type:[String],
        required: "Project users are required"
    },
    project_start_date: {
        type: Date,
        required: "Start date required"
    },
    project_end_date: {
        type: Date,
        required: "End date required"
    },
    current: {
        type:Number,
        required: "Current required"
    },
    project_tasks: {
        type:[Tasks]
    }
});



module.exports = mongoose.model('projects', Project);