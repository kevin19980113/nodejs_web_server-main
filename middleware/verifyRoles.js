const verifyRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const allowedRolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => allowedRolesArray.includes(role))
      .find((val) => val === true);

    if (!result) return res.sendStatus(401);
    next();
  };

module.exports = verifyRoles;
