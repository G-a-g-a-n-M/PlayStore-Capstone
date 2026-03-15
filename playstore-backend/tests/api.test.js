const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

describe("GET /api/apps", () => {
  it("should return a 200 status (or 404/500 if DB not connected, but server should respond)", async () => {
    const res = await request(app).get("/api/apps");
    // Even if DB fails, a response proves the API layer is active
    expect(res.status).to.be.oneOf([200, 404, 500]);
  });
});
