import request from "supertest";
import initApp from "../../app";
import jwt from "jsonwebtoken";
import config from "../../config";

const app = initApp();

it("should return 401 Unauthorized when request without auth header", (done) => {
  request(app).get("/users/all").expect(401).end(done);
});

it("should throw 403 when creating user", async () => {
  const body = {
    login: "newuser",
    password: "newpassword",
  };

  const response = await request(app).post("/auth/register").send(body);
  expect(response.status).toBe(403);
});

it("should not create existing user and return status - failure", async () => {
  const body = {
    login: "login1",
    email: "login1@google.com",
    password: "newpassword",
  };

  const response = await request(app).post("/auth/register").send(body);
  expect(response.status).toBe(200);
  expect(response.body.status).toBe("error");
  expect(response.body.message).toBe("Unable to create user");
});

it("should create user", async () => {
  const body = {
    login: "newuser",
    email: "newuser@google.com",
    password: "newpassword",
  };

  const response = await request(app).post("/auth/register").send(body);
  expect(response.status).toBe(200);
  expect(response.body.status).toEqual("success");
  expect(response.body.user).toEqual({ login: body.login, email: body.email });
});

it("should not authorize - invalid credentials", async () => {
  const body = {
    login: "login1",
    password: "wrong-password1",
  };

  const response = await request(app).post("/auth/login").send(body);
  expect(response.status).toBe(401);
});

it("should authorize user and return access token and refresh token", async () => {
  const body = {
    login: "login1",
    password: "secret-password",
  };

  const response = await request(app).post("/auth/login").send(body);
  expect(response.status).toBe(200);

  const { token, refreshToken } = response.body;
  expect(token).toBeDefined();
  expect(refreshToken).toBeDefined();

  const { login } = jwt.decode(token) as { login: string };

  expect(login).toBe(body.login);
});

it("should return info about user", async () => {
  const token = await jwt.sign(
    { login: "login1", email: "login1@google.com" },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
      algorithm: config.jwtAlgorithm,
    }
  );

  const response = await request(app)
    .get("/users/whoami")
    .set("Authorization", `Bearer ${token}`)
    .send();

  expect(response.status).toEqual(200);
  expect(JSON.parse(response.text)).toEqual({
    me: {
      login: "login1",
      email: "login1@google.com",
    },
  });
});

it("should return all users", async () => {
  const token = await jwt.sign(
    { login: "login1", email: "login1@google.com" },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
      algorithm: config.jwtAlgorithm,
    }
  );

  const response = await request(app)
    .get("/users/all")
    .set("Authorization", `Bearer ${token}`)
    .send();

  expect(response.status).toEqual(200);
  expect(JSON.parse(response.text)).toEqual({
    users: [
      {
        login: "login1",
        email: "login1@google.com",
      },
      {
        login: "login2",
        email: "login2@google.com",
      },
    ],
  });
});

it("should return 403 - expired token", async () => {
  const delay = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const token = await jwt.sign(
    { login: "login1", email: "login1@google.com" },
    config.jwtSecret,
    {
      expiresIn: 0,
      algorithm: config.jwtAlgorithm,
    }
  );

  await delay(1);

  const response = await request(app)
    .get("/users/whoami")
    .set("Authorization", `Bearer ${token}`)
    .send();

  expect(response.status).toEqual(401);
});
