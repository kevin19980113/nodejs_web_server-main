const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const newEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ error: "Firstname and lastname are required" });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees); // status 201 means created new one
};

const updateEmployee = (req, res) => {
  const updateEmployee = data.employees.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!updateEmployee) {
    return res
      .status(400)
      .json({ error: `Employee ID ${req.body.id} not found` });
  }
  if (req.body.firstname) updateEmployee.firstname = req.body.firstname;
  if (req.body.lastname) updateEmployee.lastname = req.body.lastname;
  const filteredArray = data.employees.filter(
    (employee) => employee.id !== updateEmployee.id
  );
  const unsortedArray = [...filteredArray, updateEmployee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)) // sort by id
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const deleteEmployee = data.employees.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!deleteEmployee) {
    return res
      .status(400)
      .json({ error: `Employee ID ${req.body.id} not found` });
  }
  const filteredArray = data.employees.filter(
    (employee) => employee.id !== deleteEmployee.id
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const specificEmployee = data.employees.find(
    (employee) => employee.id === parseInt(req.params.id)
  );
  if (!specificEmployee) {
    return res
      .status(400)
      .json({ error: `Employee ID ${req.params.id} not found` });
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
