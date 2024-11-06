import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import 'dotenv/config'; // Załadowanie zmiennych środowiskowych
import { baseUrl, user, password, userID } from "../helpers/data.js";  // Import danych

let token_response; // Globalna zmienna do przechowywania tokenu

describe("Api tests", () => {

  // Test GET request - pobranie książek
  it("get request", async () => {
    const response = await spec()
      .get(`${baseUrl}/BookStore/v1/Books`)
      .inspect();  // Zwykle używamy tylko podczas debugowania, można usunąć
    
    expect(response.statusCode).to.eql(200);
    
    // Możliwe testy:
    // expect(response.body.books[1].title).to.eq("Learning JavaScript Design Patterns");
    // expect(response.body.books[4].author).to.eq("Kyle Simpson");
    // const allBooksByKyle = response.body.books.every(b => b.author === "Kyle Simpson");
    // expect(allBooksByKyle).to.be.true;
  });

  // Test tworzenia użytkownika (odkomentuj, aby uruchomić)
  it.skip("Create a user", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)
      .withBody({
        userName: user,
        password: password,  // Użycie zmiennych środowiskowych
      })
      .inspect();

    expect(response.statusCode).to.eql(201);  // Sprawdzenie statusu odpowiedzi
  });

  // Test generowania tokenu
  it("Generate token", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: password,
      })
      .inspect();

    // Przypisanie tokenu z odpowiedzi
    token_response = response.body.token;
    console.log("Generated Token: ", token_response);

    // Sprawdzamy status odpowiedzi oraz zawartość
    expect(response.statusCode).to.eql(200);
    expect(response.body.result).to.eql("User authorized succesfully.");
  });

  // Test sprawdzający, czy token został wygenerowany
  it("check token", async () => {
    console.log("Token in check token block: ", token_response);

    // Sprawdzamy, czy token jest dostępny i poprawnego typu
    expect(token_response).to.exist;
    expect(token_response).to.be.a("string");
  });

  // Test dodawania książki
  it("Add book", async () => {
    const response = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      .withBearerToken(token_response)
      .withBody({
        "userId": userID,
        "collectionOfIsbns": [
          { "isbn": "9781449325862" }
        ]
      })
      .inspect();

    // Sprawdzamy status odpowiedzi
    expect(response.statusCode).to.eql(201);

    // Sprawdzamy, czy ISBN jest zgodny z tym, który wysłaliśmy
    expect(response.body.result).to.eql("ISBN: 9781449325862"); // Sprawdzamy, czy ISBN w odpowiedzi jest poprawny
  });

  it("Check books in user", async () => {
    const response = spec()
    .get(`${baseUrl}/Account/v1/User/${baseUrl}/{${userID}}`)
    .inspect()
    .withBearerToken(token_response)
    expect(response.statusCode).to.eql(204)
  })

  it("Delete all books", async () => {
    const response = await spec()
    .delete(`${baseUrl}/BookStore/v1/Books/?UserId=${userID}`)
    .withBearerToken(token_response)
    .inspect()
    expect(response.statusCode).to.eql(204)
  })

});
