var controller_account = require("../controllers/account")
var controller_project = require("../controllers/project")
var express = require('express');
var router = express.Router();

router.use(function timeLog (req, res, next) {
  res.time = Date.now();
  next();
});

/* GET home page. */
router.get('/', controller_account.index);

router.post('/register', controller_account.register);
router.get('/login', controller_account.login_form);
router.post('/login', controller_account.login);
router.get('/project', [
  controller_account.find_account,
  controller_account.find_accounts,
  controller_project.load_project,
  controller_project.dashboard,
]);
router.post('/current_project', controller_project.current_project);
/* project handlers */
router.post('/create_project', controller_project.create_project);
router.post('/update_project', controller_project.update_project);
router.post('/delete_project', controller_project.delete_project);
router.get('/get_project_info', controller_project.get_project_info);

/* task handlers */
router.post('/create_task', controller_project.create_task);
router.post('/update_task', controller_project.update_task);
router.post('/delete_task', controller_project.delete_task);
router.post('/update_task_index', controller_project.update_task_index);
router.post('/assign_task', [
    controller_project.assign_task
]);
router.get('/get_task_info', controller_project.get_task_info);
/* account handlers */
router.get('/logout', controller_account.logout);
router.get('/delete_account', controller_account.delete_account);
router.post('/update_account', controller_account.update_account);
router.post('/update_email', controller_account.update_email);
router.post('/update_pw', controller_account.update_pw);
module.exports = router;
