import { create } from "zustand"
import blogService from "../services/blogs"

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const response = await blogService.getAll()
      set(state => ({ blogs: response }))
    },
    createNew: async (blog) => {
      const response = await blogService.create(blog)
      set(state => ({blogs: state.blogs.concat(response) }))
    },
    upvote : async (id) => {
      const likedBlog = get().blogs.find((b) => b.id === id)
      const response = await blogService.update(id, {...likedBlog, likes: likedBlog.likes+1})
      set(state => ({ blogs: state.blogs.map((b) => b.id !== id ? b : response)}))
    },
    remove: async (id) => {
      await blogService.remove(id)
      set(state => ({ blogs: state.blogs.filter((b) => b.id !== id)}))
    }
  }
  
}))

export const useBlogs = () => {
  const blogs = useBlogStore(state => state.blogs)
  return [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
}

export const useBlogActions = () => useBlogStore(state => state.actions)
