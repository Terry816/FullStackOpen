import { useUsers } from "../../stores/userStore";
import { useParams } from "react-router-dom";

const User = () => {
  const users = useUsers();
  const id = useParams().id;
  const userinfo = id ? users.find((u) => u.id === id) : null;

  if (!userinfo) {
    return (
      <div className="py-8">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          User not found.
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
            User profile
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 not-italic">
            {userinfo.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            @{userinfo.username}
          </p>
        </div>

        <div className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <span className="block font-medium text-slate-900">
            {userinfo.blogs.length}
          </span>
          <span className="text-slate-500">
            {userinfo.blogs.length === 1 ? "blog created" : "blogs created"}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-sm font-semibold text-slate-700">
            Added blogs
          </p>
        </div>

        {userinfo.blogs.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {userinfo.blogs.map((blog) => (
              <li key={blog.id} className="px-5 py-4">
                <h2 className="text-base font-semibold text-slate-950">
                  {blog.title}
                </h2>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            This user has not added any blogs yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
