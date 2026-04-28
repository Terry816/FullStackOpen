const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;
  let mostLikes = blogs[0]?.likes ?? 0;
  let bestBlog = blogs[0];
  for (let i = 1; i < blogs.length; i++) {
    const likes = blogs[i]?.likes ?? 0;
    if (likes > mostLikes) {
      mostLikes = likes;
      bestBlog = blogs[i];
    }
  }
  return bestBlog;
};

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { author: "", blogs: 0 };
  }
  const counts = {};
  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
  }

  const [author, blogsWritten] = Object.entries(counts).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max,
  );

  return {
    author: author ?? "",
    blogs: blogsWritten ?? 0,
  };
};

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { author: "", likes: 0 };
  }
  const counts = {};
  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
  }

  const [author, blogLikes] = Object.entries(counts).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max,
  );

  return {
    author: author ?? "",
    likes: blogLikes ?? 0,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
