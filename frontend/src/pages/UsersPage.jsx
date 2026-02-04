import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/userHooks/userHooks';
import { useAllUsersData, useLogoutAUser, useDeleteAUser } from '../hooks/usersHooks/usersHooks';

export default function UsersPage() {
  const navigate = useNavigate();
  const { data: userData } = useUserData();
  const { data: users } = useAllUsersData();
  const logoutAUserMutation = useLogoutAUser(() => {
    location.reload();
  });
  const deleteAUserMutation = useDeleteAUser(() => {
    location.reload();
  });

  if (!userData) return <div>Not logged in!</div>

  return (
    <div className="w-full text-[#FFFFFF] font-['Inter',sans-serif] p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-6">All Users</h1>
        <h3>You: {userData.name}</h3>
        <p className='capitalize'>Role: {userData.role}</p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-[#1A1918] rounded-lg overflow-hidden">
          <thead className="bg-[#242321] text-[#BBB5AE]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3"></th>
              {userData.role === "admin" && <th className="px-4 py-3"></th>}
            </tr>
          </thead>

          <tbody>
            {users?.map((user) => user.id === userData.userId ? null : (
              <tr
                key={user.id}
                className="border-t border-[#44403D] hover:bg-[#2D2B29] transition"
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-[#BBB5AE]">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-medium ${user.isLoggedIn ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {user.isLoggedIn ? "Logged In" : "Logged Out"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      const confirmLogout = confirm(`Do you really want to logout ${user.email}?`);
                      if (!confirmLogout) return;
                      logoutAUserMutation.mutate({ userId: user.id });
                    }}
                    disabled={!user.isLoggedIn}
                    className="px-4 py-1.5 rounded-md bg-[#497FFF] text-white text-sm font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:opacity-90 transition"
                  >
                    Logout
                  </button>
                </td>

                {userData.role === "admin" && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        const confirmLogout = confirm(`Do you really want to delete ${user.email}?`);
                        if (!confirmLogout) return;
                        deleteAUserMutation.mutate({userId: user.id});
                      }}
                      className="px-4 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium
                             hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
