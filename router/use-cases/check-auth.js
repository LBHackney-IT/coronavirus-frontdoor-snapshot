const jwt = require('jsonwebtoken');

class CheckAuth {
  constructor({ allowedGroups }) {
    this.allowedGroups = allowedGroups;
  }

  execute({ token }) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      return (
        Boolean(payload) &&
        Boolean(payload.groups) &&
        payload.groups.some(g => this.allowedGroups.includes(g))
      );
    } catch (err) {
      return false;
    }
  }

  getEmail = token => {
    if (!token) return '';
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload ? payload.email : '';
  };

  getIat = token => {
    if (!token) return '';
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload ? payload.iat : '';
  };
}
module.exports = CheckAuth;
