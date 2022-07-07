const verifyRoles = (...allowedRoles) => {
    return (req, res, nest) => {
        if(!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles]
        console.log(rolesArray);
        console.log(req.roles);
        // check if req has one of the roles inside of the allowedRoles. find() finds any true value
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)
        if(!result) res.sendStatus(401) // Unauthorized
        nest()
    }
}

module.exports = verifyRoles;