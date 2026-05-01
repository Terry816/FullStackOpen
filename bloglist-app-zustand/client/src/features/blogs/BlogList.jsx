import { Link } from "react-router-dom";
import { useBlogs } from "../../stores/blogStore"
import { useUser } from "../../stores/userStore"

const BlogList = () => {
  const user = useUser()
  const blogs = useBlogs()

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
            Bloglist collection
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 not-italic">
            Blogs
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Browse the latest saved posts and open any blog for details.
          </p>
        </div>

        {user && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="block font-medium text-slate-900">
              {user.name}
            </span>
            <span className="text-slate-500">logged in</span>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-sm font-semibold text-slate-700">
            {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
          </p>
        </div>

        {blogs.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Link
                  to={`/${blog.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-sky-50/60 focus:bg-sky-50 focus:outline-none"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-slate-950">
                        {blog.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        by {blog.author}
                      </p>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      View blog
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No blogs have been added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
