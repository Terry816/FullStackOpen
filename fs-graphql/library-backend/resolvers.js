const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const validationError = (message, invalidArgs) =>
  new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT",
      invalidArgs,
    },
  });

const handleDatabaseError = (error, resource, invalidArgs) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    throw validationError(
      `${resource} validation failed: ${messages.join(", ")}`,
      invalidArgs,
    );
  }

  if (error.code === 11000) {
    const duplicateFields = Object.keys(error.keyValue).join(", ");
    throw validationError(
      `${resource} must be unique: ${duplicateFields}`,
      invalidArgs,
    );
  }

  throw new GraphQLError(`Saving ${resource.toLowerCase()} failed`, {
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};

const requireAuthentication = (context) => {
  if (!context || !context.currentUser) {
    throw new GraphQLError("not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }
};

const resolvers = {
  Query: {
    bookCount: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return 0;
        }
        return Book.countDocuments({ author: author._id });
      }
      return Book.countDocuments();
    },
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};
      if (args.genre) {
        filter.genres = args.genre;
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        filter.author = author._id;
      }
      return Book.find(filter).populate("author");
    },
    allAuthors: async () => {
      const authors = await Author.find();
      const bookCounts = await Book.aggregate([
        {
          $group: {
            _id: "$author",
            bookCount: { $sum: 1 },
          },
        },
      ]);

      const countsByAuthorId = new Map(
        bookCounts.map(({ _id, bookCount }) => [_id.toString(), bookCount]),
      );

      return authors.map((author) => ({
        ...author.toObject(),
        id: author._id,
        bookCount: countsByAuthorId.get(author._id.toString()) ?? 0,
      }));
    },
    me: (root, args, context) => context.currentUser,
  },
  Book: {
    author: async (root) => {
      if (root.author.name) {
        return root.author;
      }
      return Author.findById(root.author);
    },
  },
  Author: {
    bookCount: async (root) => {
      if (root.bookCount !== undefined) {
        return root.bookCount;
      }
      return Book.countDocuments({ author: root._id });
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      requireAuthentication(context);

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          handleDatabaseError(error, "Author", args.author);
        }
      }

      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (error) {
        handleDatabaseError(error, "Book", args.title);
      }

      const addedBook = await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: addedBook });

      return addedBook;
    },
    editAuthor: async (root, args, context) => {
      requireAuthentication(context);

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      try {
        return await author.save();
      } catch (error) {
        handleDatabaseError(error, "Author", args.name);
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        handleDatabaseError(error, "User", args.username);
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
