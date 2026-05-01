import { Link } from "react-router-dom";
import { useUsers } from "../../stores/userStore";

const UserList = () => {
  const users = useUsers();

  return (
    <div className="py-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
          Bloglist community
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 not-italic">
          Users
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          See who has joined and how many blogs each user has created.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <caption className="sr-only">Users in the system</caption>
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Blogs created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="group transition-colors hover:bg-sky-50/60"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap text-left text-sm font-semibold text-slate-900"
                  >
                    <Link
                      to={`/users/${u.id}`}
                      className="block px-6 py-4 focus:outline-none"
                    >
                      {u.name}
                    </Link>
                  </th>
                  <td className="whitespace-nowrap text-sm text-slate-600">
                    <Link
                      to={`/users/${u.id}`}
                      className="block px-6 py-4 focus:outline-none"
                    >
                      @{u.username}
                    </Link>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/users/${u.id}`}
                      className="block px-6 py-4 focus:outline-none"
                    >
                      <span className="inline-flex min-w-10 justify-center rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
                        {u.blogs.length}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No users found yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
