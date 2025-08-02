const jwt = require('jsonwebtoken');
const generateJWT = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
module.exports = generateJWT;
