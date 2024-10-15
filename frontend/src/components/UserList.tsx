import React, { useState } from "react";

interface User {
  name: string;
  email: string;
  phone: { country: string; number: string };
  documentPhoto: string;
}

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        users.map((user, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{user.name}</p>
                <img
                  src={user.documentPhoto}
                  alt="Document"
                  className="w-16 h-16"
                />
              </div>
              <button
                onClick={() =>
                  setExpandedUserId(expandedUserId === index ? null : index)
                }
                className="bg-gray-200 p-2 rounded"
              >
                {expandedUserId === index ? "Hide Details" : "Show Details"}
              </button>
            </div>
            {expandedUserId === index && (
              <div className="mt-4">
                <p>Email: {user.email}</p>
                <p>
                  Phone: {user.phone.country} {user.phone.number}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
