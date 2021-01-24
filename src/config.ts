import rc from "rc";

const conf = {
  port: 3000,
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: 5 * 60,
  jwtAlgorithm: "HS256",
  mongo: {
    host: process.env.MONGO_HOSTNAME,
    port: process.env.MONGO_PORT,
    db: process.env.MONGO_DB,
    user: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
};

export default rc("express-jwt-example", conf);
