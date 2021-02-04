import bcrypt from "bcryptjs";

export default [
  {
    id: "id1",
    login: "login1",
    email: "login1@google.com",
    password: bcrypt.hashSync("secret-password"),
  },
  {
    id: "id2",
    login: "login2",
    email: "login2@google.com",
    password: bcrypt.hashSync("secret-password-2"),
  },
];
