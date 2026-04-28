const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

describe("total likes", () => {
  test("empty input", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("sum of many blogs", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

describe("Favorite Likes", () => {
  test("empty input", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test("list of a single blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, listWithOneBlog[0]);
  });

  test("list with lots of blogs", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[2]);
  });
});

describe("most blogs", () => {
  test('empty input returns author "" and blogs 0', () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result.author, "");
    assert.strictEqual(result.blogs, 0);
  });

  test("single blog returns that author with 1 blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.strictEqual(result.author, "Edsger W. Dijkstra");
    assert.strictEqual(result.blogs, 1);
  });

  test("full blog list: Robert C. Martin has most (3)", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.strictEqual(result.author, "Robert C. Martin");
    assert.strictEqual(result.blogs, 3);
  });
});

describe("most likes", () => {
  test('empty input returns author "" and likes 0', () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result.author, "");
    assert.strictEqual(result.likes, 0);
  });

  test("single blog returns that author and like count", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.strictEqual(result.author, "Edsger W. Dijkstra");
    assert.strictEqual(result.likes, 5);
  });

  test("full blog list: Edsger W. Dijkstra has most likes (17)", () => {
    const result = listHelper.mostLikes(blogs);
    assert.strictEqual(result.author, "Edsger W. Dijkstra");
    assert.strictEqual(result.likes, 17);
  });
});
