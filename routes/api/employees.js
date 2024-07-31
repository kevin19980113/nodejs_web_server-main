const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  newEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = require("../../controllers/employeesController");

router
  .route("/")
  .get(getAllEmployees)
  .post(newEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

// get id parameter right away
router.route("/:id").get(getEmployee);
module.exports = router;
