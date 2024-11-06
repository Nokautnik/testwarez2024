import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import 'dotenv/config'; // Użycie zmiennych środowiskowych
import { baseUrl,userID } from "../helpers/data.js";

describe("Api tests", () => {
  
  // Pierwszy test - Get request
  it("get request", async () => {  // Zmieniamy it.skip na it, żeby test się uruchamiał
    const response = await spec()
      .get(`${baseUrl}/BookStore/v1/Books`)
      .inspect();
    
    const responseB = JSON.stringify(response.body);
    //console.log("is dotenv work ?" + " " + process.env.SECRET_PASSWORD)
    expect(response.statusCode).to.eql(200);

    // Możliwe testy, które były zakomentowane:
    // expect(response.body.books[1].title).to.eq("Learning JavaScript Design Patterns");
    // expect(response.body).to.include("Kyle Simpson");
    // expect(response.body.books[4].author).to.eq("Kyle Simpson");
    // const allBooksByKyle = response.body.books.every(b => b.author === "Kyle Simpson");
    // expect(allBooksByKyle).to.be.true;
  });

  // Drugi test - Create a user
  it.skip("Create a user", async () => {  // Poprawka: asynchroniczna funkcja it
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)
      .withBody({
        userName: "nokautnik2",
        password: process.env.SECRET_PASSWORD,  // Użycie zmiennej środowiskowej
      })
      .inspect();

    expect(response.statusCode).to.eql(201);  // Oczekiwany status odpowiedzi 201
  });

});  // Zamknięcie funkcji describe