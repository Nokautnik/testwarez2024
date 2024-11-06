import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import { baseUrl, userID, user, password } from "../helpers/data.js";

let token_response;
describe("Api tests", () => {
  it("get request", async () => {
    const response = await spec()
    .get(`${baseUrl}/BookStore/v1/Books`)
    .inspect()
    const responseB = JSON.stringify(response.body);
    expect(response.statusCode).to.eql(200);
    expect(responseB).to.include("Learning JavaScript Design Patterns");
    expect(responseB).to.include("Eloquent JavaScript, Second Edition");
  });

  it.skip("Create a user", async () => {
    const response = await spec().post(`${baseUrl}/Account/v1/User`).withBody({
      userName: user,
      password: password,
    });
    expect(response.statusCode).to.eql(201);
  });

  it("Generate token", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: password,
      })
      .inspect();
    token_response = response.body.token;
    console.log(token_response);
    expect(response.statusCode).to.eql(200);
    expect(response.body.result).to.eql("User authorized successfully.");
  });

  it.skip("Add a book", async () => {
    const response = await spec()
    .post(`${baseUrl}/BookStore/v1/Books`)
    .withBearerToken(token_response)
    .inspect()
    .withBody({
        "userId": userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449331818"
          }
        ]
      })
      expect(response.statusCode).to.eql(201)
  })

  it("Check books in user", async () => {
    const response = await spec()
    .get(`${baseUrl}/Account/v1/User/${userID}`)
    .inspect()
    .withBearerToken(token_response)
    expect(response.statusCode).to.eql(200)
  })

  it("Delete all books", async () => {
    const response = await spec()
    .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userID}`)
    .inspect()
    .withBearerToken(token_response)
    expect(response.statusCode).to.eql(204)
  })

  it("Check books in user", async () => {
    const response = await spec()
    .get(`${baseUrl}/Account/v1/User/${userID}`)
    .inspect()
    .withBearerToken(token_response)
    expect(response.statusCode).to.eql(200)
    expect(response.body.books).to.eql([])
  })
});