// process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const sorted = require("jest-sorted");
const connection = require("../db/connection");

describe("/api", () => {
  afterAll(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  test("GET /api responds with a JSON object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { API } }) => {
        expect(API).toEqual(expect.any(Object));
      });
  });
  test("Returns 404 if passed invalid path", () => {
    const methods = ["get", "post", "delete", "patch"];
    const requestPromises = methods.map((method) => {
      return request(app)
        [method]("/nonExistentURL")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    return Promise.all(requestPromises);
  });
  /********************* TOPICS ********************/
  describe("/topics", () => {
    test("GET topics responds with all the topics in the database", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual(expect.any(Array));
          expect(topics.length).toBe(3);
        });
    });
    test("405 - invalid method", () => {
      const methods = ["post", "delete", "put", "patch"];
      const promiseArr = methods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid method");
          });
      });
      return Promise.all(promiseArr);
    });
  });
  /********************* USERS ********************/
  describe("/users", () => {
    describe("GET", () => {
      test("GET users by username responds with a user object", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual(expect.any(Object));
          });
      });
      test("GET users by username's object has the expected keys", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(Object.keys(user)).toEqual([
              "username",
              "name",
              "avatar_url",
            ]);
          });
      });
    });
    describe("Error handling", () => {
      test("404 - user not found", () => {
        return request(app)
          .get("/api/users/not_a_user")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User not found");
          });
      });
      test("405 - invalid method type /users", () => {
        const methods = ["patch", "delete", "put", "post"];
        const promiseArr = methods.map((method) => {
          return request(app)
            [method]("/api/users/butter_bridge")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid method");
            });
        });
        return Promise.all(promiseArr);
      });
    });
  });
  /********************* ARTICLES ********************/
  describe("/articles", () => {
    describe("GET", () => {
      test("GET ALL articles responds with an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual(expect.any(Object));
          });
      });
      test("GET ALL articles' objects have the expected keys", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Object.keys(articles[0])).toEqual([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            ]);
            expect(articles[0].comment_count).toEqual("13");
          });
      });
      test("GET ALL articles accepts sort_by query which defaults to date, desc", () => {
        return request(app)
          .get(`/api/articles`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("GET ALL articles accepts sort_by query", () => {
        const queries = ["author", "topic", "title"];
        const promiseArr = queries.map((query) => {
          return request(app)
            .get(`/api/articles?sort_by=${query}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy(query, { descending: true });
            });
        });
        return Promise.all(promiseArr);
      });
      test("GET ALL articles accepts order query", () => {
        const queries = ["asc", "desc"];
        const promiseArr = queries.map((query) => {
          let order = "";
          if (query === "desc") {
            order = { descending: true };
          }

          return request(app)
            .get(`/api/articles?sort_by=author&order=${query}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("author", order);
            });
        });
        return Promise.all(promiseArr);
      });
      test("GET ALL articles accepts an author filter which filters all articles by selected username", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(6);
            expect(articles[0].author).toBe("icellusedkars");
            // check all articles from this author
          });
      });
      test("GET ALL articles accepts topic filter which filters all articles by selected topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(11);
            expect(articles[0].topic).toBe("mitch");
          });
      });
      test("GET article by article ID responds with an article object", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(expect.any(Object));
          });
      });
      test("GET article by article ID contains the expected keys", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(Object.keys(article)).toEqual([
              "article_id",
              "title",
              "author",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            ]);
            expect(article.comment_count).toBe("0");
          });
      });
    });
    describe("POST", () => {
      test("POST an article responds with the created article", () => {
        return request(app)
          .post("/api/articles")
          .send({
            title: "New Article",
            author: "butter_bridge",
            body: "article text here",
            topic: "mitch",
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual(expect.any(Object));
            expect(article).toHaveProperty("title", "New Article");
            expect(article).toHaveProperty("article_id");
          });
      });
    });
    describe("PATCH", () => {
      test("PATCH article returns an article object", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual(expect.any(Object));
          });
      });
      test("PATCH article returns an article object with expected keys", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 10 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(Object.keys(article)).toEqual([
              "article_id",
              "title",
              "author",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            ]);
          });
      });
      test("PATCH article returns an article object with the vote count incremented by input amount", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 10 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article.votes).toBe(10);
          });
      });
    });
    describe("PAGINATION", () => {
      test("GET /articles takes an articles per page limit which is set to 10 as default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(10);
          });
      });
      test("GET /articles returns specified number of articles", () => {
        return request(app)
          .get("/api/articles?limit=3")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(3);
          });
      });
      test("GET articles returns next page of results when passed a page query", () => {
        return request(app)
          .get("/api/articles?page=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(2);
            expect(Object.values(articles[0])).toEqual([
              "icellusedkars",
              "Am I a cat?",
              11,
              "mitch",
              "1978-11-25T12:21:54.000Z",
              0,
              "0",
            ]);
          });
      });
      test("404 - page limit exceeded", () => {
        return request(app)
          .get("/api/articles?page=3")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Page limit exceeded");
          });
      });
      test("400 - invalid page number", () => {
        return request(app)
          .get("/api/articles?page=-3")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });

    describe("Error handling", () => {
      test("404 - article not found", () => {
        return request(app)
          .get("/api/articles/300")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
          });
      });
      test("400 - bad request, not a valid id", () => {
        return request(app)
          .get("/api/articles/notAnId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("400 - bad request, invalid patch request", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ notAProperty: 7 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid patch request");
          });
      });
      test("400 - bad request, incorrect data type for patch request", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: "NaN" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });

      test("200 no articles found but user exists", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual([]);
          });
      });
      test("404 no articles found when trying to filter by non-existent author", () => {
        return request(app)
          .get("/api/articles?author=notAUser")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Author does not exist");
          });
      });
      test("200 no articles found but topic exists", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual([]);
          });
      });
      test("404 no articles found when trying to filter by non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=notATopic")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Topic does not exist");
          });
      });
      test("405 - invalid method type /articles", () => {
        const methods = ["patch", "delete", "put"];
        const promiseArr = methods.map((method) => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid method");
            });
        });
        return Promise.all(promiseArr);
      });
      test("405 - invalid method type /articles/:article_id", () => {
        const methods = ["post", "delete", "put"];
        const promiseArr = methods.map((method) => {
          return request(app)
            [method]("/api/articles/3")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid method");
            });
        });
        return Promise.all(promiseArr);
      });
      test("405 - invalid method type /articles/:article_id/comments", () => {
        const methods = ["patch", "delete", "put"];
        const promiseArr = methods.map((method) => {
          return request(app)
            [method]("/api/articles/3/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid method");
            });
        });
        return Promise.all(promiseArr);
      });
      test("400 - bad article post request", () => {
        const emptyBody = request(app)
          .post("/api/articles")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Incomplete request");
          });
        const notAUser = request(app)
          .post("/api/articles")
          .send({
            title: "New Article",
            author: "not-a-user",
            body: "article text here",
            topic: "mitch",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
        const missingBody = request(app)
          .post("/api/articles")
          .send({
            title: "Article Title",
            author: "butter_bridge",
            topic: "mitch",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Incomplete request");
          });
        return Promise.all([emptyBody, notAUser, missingBody]);
      });
    });
  });

  /********************* COMMENTS ********************/
  describe("/comments", () => {
    describe("PATCH", () => {
      test("PATCH comments by id responds with the updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(expect.any(Object));
          });
      });
      test("PATCH comments by id's updated comment should have votes property modified by specified amount", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment.votes).toBe(15);
          });
      });
    });
    describe("DELETE", () => {
      test("DELETE comment by ID should remove comment from db and respond with 204", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(() => {
            return connection
              .select("*")
              .from("comments")
              .where("comment_id", "=", 1);
          })
          .then((response) => {
            expect(response.length).toBe(0);
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      describe("GET", () => {
        test("GET all comments responds with an a comments object with a key containing an array of comments", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(Array.isArray(comments)).toBe(true);
            });
        });
        test("GET all comments responds with an array of objects containing the expected keys", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(Object.keys(comments[0])).toEqual([
                "comment_id",
                "author",
                "votes",
                "created_at",
                "body",
              ]);
            });
        });
        test("GET all comments accepts sort_by query which is set to created_by as default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("created_at");
            });
        });
        test("GET all comments accepts a sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("author");
            });
        });
        test("GET all comments accepts an order query which can be set to asc or desc", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author&order=desc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("author", { descending: true });
            });
        });
        describe.only("PAGINATION", () => {
          test("GET all comments has a default limit of 10 comments", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBe(10);
              });
          });
          test("GET all comments limit can be set with a query", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=3")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBe(3);
              });
          });
          test("GET all comments returns next page of results when passed a page query", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=3&page=2")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBe(3);
                expect(comments[0].body).toBe("Ambidextrous marsupial");
              });
          });
          test("400 bad request if invalid page number", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=3&page=0")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request");
              });
          });
          test("404 page limited exceeded", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=10&page=4")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Page limit exceeded");
              });
          });
        });
      });
      describe("POST", () => {
        test("POST comment responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({ username: "lurker", body: "Terrible article" })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment).toMatchObject({
                comment_id: 19,
                author: "lurker",
                article_id: 3,
                votes: 0,
                created_at: expect.any(String),
                body: "Terrible article",
              });
            });
        });
      });
    });
    describe("Error handling", () => {
      test("404 - comment_id does not exist", () => {
        return request(app)
          .patch("/api/comments/10000")
          .send({ inc_votes: -1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comment not found");
          });
      });
      test("400 - bad request, missing data from comment post request", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Incomplete request");
          });
      });
      test("405 - invalid method type /comments/:comment_id", () => {
        const methods = ["post", "get", "put"];
        const promiseArr = methods.map((method) => {
          return request(app)
            [method]("/api/comments/3")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid method");
            });
        });
        return Promise.all(promiseArr);
      });
      test("405 - invalid method type /articles/:article_id/:comments", () => {
        const methods = ["post", "get", "put"];
        const promiseArr = methods.map((method) => {
          return request(app)
            [method]("/api/comments/3")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid method");
            });
        });
        return Promise.all(promiseArr);
      });
    });
  });
});
