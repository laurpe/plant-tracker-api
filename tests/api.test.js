const bcrypt = require("bcrypt");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const User = require("../models/User");

beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({
        email: "tester@example.org",
        password: passwordHash,
    });

    await user.save();
});

afterAll(() => {
    mongoose.connection.close();
});

describe("User", () => {
    test("gets token and refreshToken when they log in", async () => {
        const response = await api
            .post("/api/login")
            .send({ email: "tester@example.org", password: "secret" });

        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
    });

    test("token is valid for 24 hours, refreshToken for 7 days", async () => {
        const response = await api
            .post("/api/login")
            .send({ email: "tester@example.org", password: "secret" });

        const token = response.body.token;
        const refreshToken = response.body.refreshToken;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const tokenExp = new Date(decodedToken.exp * 1000);
        const refreshTokenExp = new Date(decodedRefreshToken.exp * 1000);

        const tokenExpDayjs = dayjs(tokenExp).utcOffset(0).startOf("date");
        const tomorrow = dayjs().add(1, "day").utcOffset(0).startOf("date");

        const refreshTokenExpDayjs = dayjs(refreshTokenExp)
            .utcOffset(0)
            .startOf("date");
        const in7Days = dayjs().add(7, "day").utcOffset(0).startOf("date");

        expect(tomorrow.isSame(tokenExpDayjs));
        expect(in7Days.isSame(refreshTokenExpDayjs));
    });

    test("gets new token when requesting it with a valid refreshToken", async () => {
        const response = await api
            .post("/api/login")
            .send({ email: "tester@example.org", password: "secret" });

        const refreshToken = response.body.refreshToken;

        const refreshResponse = await api
            .post("/api/refresh")
            .send({ refreshToken });

        expect(refreshResponse.body).toHaveProperty("token");
    });

    test("gets status code 400 if given refresh token is not valid", async () => {
        await api
            .post("/api/refresh")
            .send({ refreshToken: "sdfsdfsfui4354h5435" })
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });
});
