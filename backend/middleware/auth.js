const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let jwtToken = req.header("Authorization");
  if (!jwtToken) return res.status(400).send("Authorization denied: No token");
  //[Bearer,1324123afefqe43f3f434f]
  // 0, 1
  
  jwtToken = jwtToken.split(" ")[1];

  if (!jwtToken) return res.status(400).send("Authorization denied: No token");

  // EL Pyload son los datos del usaurio

  try {
    const payload = await jwt.verify(jwtToken, process.env.SECRET_KEY_JWT);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(400).send("Authorization denied: Invalid token");
  }
};

module.exports = auth;