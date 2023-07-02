const supertest = require('supertest');
const appFile = require('./server');
const path = require('path');

describe("serving app", () => {
  let sendFileSpy;

  afterAll(async () => {
    sendFileSpy.mockRestore();
    await appFile.server.close();
  });

  it("should send an index.html file", async () => {
    sendFileSpy = jest.spyOn(appFile.app.response, 'sendFile');
    const file = path.join(__dirname, 'dist', 'index.html');

    await supertest(appFile.app)
      .get("/*")
      .expect(200)
      .expect('Content-Type', /html/);

    expect(sendFileSpy).toHaveBeenCalledWith(file);
  });
});





