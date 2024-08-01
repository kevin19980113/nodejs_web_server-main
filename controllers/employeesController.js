const EmployeeDB = require("../model/Empolyee");

const getAllEmployees = async (req, res) => {
  const employees = await EmployeeDB.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found" }); // 204 No Content
  res.json(employees);
};

const newEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname)
    return res
      .status(400)
      .json({ error: "Firstname and lastname are required" }); // 400 Bad Request

  try {
    const result = await EmployeeDB.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    // mongoDB automatically generates an id so we don't need to set it manually
    console.log(`New employee created: ${result.firstname} ${result.lastname}`);
    res.status(201).json(result); // 201 Created
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ error: "Employee ID is required" }); // 400 Bad Request

  const updateEmployee = await EmployeeDB.findById(req.body.id).exec();
  if (!updateEmployee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.body.id} not found` });
  } //  204 No Content

  if (req.body?.firstname) updateEmployee.firstname = req.body.firstname;
  if (req.body?.lastname) updateEmployee.lastname = req.body.lastname;
  const result = await updateEmployee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ error: "Employee ID is required" }); // 400 Bad Request

  const deleteEmployee = await EmployeeDB.findById(req.body.id).exec();
  if (!deleteEmployee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.body.id} not found` });
  } //  204 No Content
  const result = await deleteEmployee.deleteOne();
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ error: "Employee ID is required" }); // 400 Bad Request

  const specificEmployee = await EmployeeDB.findById(req.params.id).exec();
  if (!specificEmployee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.body.id} not found` }); //  204 No Content
  }
  res.json(specificEmployee);
};

// this contoller doesn't actually add or update or delete employess to DB for practice purposes
module.exports = {
  getAllEmployees,
  newEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
