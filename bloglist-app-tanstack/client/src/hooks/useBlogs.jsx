import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

const useBlogs = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  const createBlog = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const updateBlog = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });

  const removeBlog = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });

  return {
    blogs: data,
    isPending,
    isError,
    createBlog: (newObject) => createBlog.mutate(newObject),
    updateBlog: (newObject) =>
      updateBlog.mutate({
        ...newObject,
        likes: newObject.likes + 1,
      }),
    removeBlog: (id) => removeBlog.mutate(id),
  };
};

export default useBlogs;
