const {
  formatDateAndTime,
  changeKeyToAuthorToAuthor,
  createArticleRef,
  formatComments,
} = require("../db/utils/data-manipulation");

describe("formatDateAndTime", () => {
  it("Returns a new empty array when passed an empty array", () => {
    const input = [];
    expect(formatDateAndTime(input)).toEqual([]);
    expect(formatDateAndTime(input)).not.toBe(input);
  });
  it("Returns an array of objects containing the expected keys", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    expect(formatDateAndTime(input)).toEqual([
      {
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.anything(),
        votes: expect.any(Number),
      },
    ]);
  });
  it("changes the format of created_at timestamp to match SQL format", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    expect(formatDateAndTime(input)).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2018-11-15 12:21:54",
        votes: 100,
      },
    ]);
  });
});

describe("changeKeyToAuthor", () => {
  it("Returns a new empty array when passed an empty array", () => {
    const input = [];
    expect(changeKeyToAuthor(input)).toEqual([]);
    expect(changeKeyToAuthor(input)).not.toBe(input);
  });
  it("Returns an array of objects containing the expected keys", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932,
      },
    ];
    expect(changeKeyToAuthor(input)).toEqual([
      {
        body: expect.any(String),
        belongs_to: expect.any(String),
        author: expect.anything(),
        votes: expect.any(Number),
        created_at: expect.any(Number),
      },
    ]);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932,
      },
    ];
    changeKeyToAuthor(input);
    expect(input).toEqual([
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932,
      },
    ]);
  });
});

describe("createArticleRef", () => {
  it("returns an object", () => {
    const input = [
      {
        article_id: 1,
        title: "Running a Node App",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        topic: "coding",
        created_at: "2016-08-18T12:07:52.000Z",
        votes: 0,
      },
    ];
    let output = createArticleRef(input);
    expect(typeof output).toBe("object");
  });
  it("returns an object with the expected key value pairs of jessjelly: 1", () => {
    const input = [
      {
        article_id: 1,
        title: "Running a Node App",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        topic: "coding",
        created_at: "2016-08-18T12:07:52.000Z",
        votes: 0,
      },
    ];
    let output = createArticleRef(input);
    expect(output).toEqual({
      "Running a Node App": 1,
    });
  });
  it("should not mutate the original array", () => {
    const input = [
      {
        article_id: 1,
        title: "Running a Node App",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        topic: "coding",
        created_at: "2016-08-18T12:07:52.000Z",
        votes: 0,
      },
    ];
    createArticleRef(input);
    expect(input).toEqual([
      {
        article_id: 1,
        title: "Running a Node App",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        topic: "coding",
        created_at: "2016-08-18T12:07:52.000Z",
        votes: 0,
      },
    ]);
  });
});

describe("formatComments", () => {
  it("returns an array", () => {
    const input1 = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 12,
    };
    const input2 = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        votes: -1,
        author: "tickle122",
        created_at: "2016-07-09 19:07:18",
      },
    ];
    expect(Array.isArray(formatComments(input1, input2))).toBe(true);
  });
  it("return an array in the format we expect", () => {
    const input1 = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 12,
    };
    const input2 = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        votes: -1,
        author: "tickle122",
        created_at: "2016-07-09 19:07:18",
      },
    ];
    expect(formatComments(input1, input2)).toEqual([
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 12,
        votes: -1,
        author: "tickle122",
        created_at: "2016-07-09 19:07:18",
      },
    ]);
  });
  it("does not mutate the original array", () => {
    const input1 = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 12,
    };
    const input2 = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        votes: -1,
        author: "tickle122",
        created_at: "2016-07-09 19:07:18",
      },
    ];
    formatComments(input1, input2);
    expect(input2).toEqual([
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        votes: -1,
        author: "tickle122",
        created_at: "2016-07-09 19:07:18",
      },
    ]);
  });
});
