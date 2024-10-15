import React, { useState } from "react";
import AddUserForm from "./components/AddUserForm";
import UserList from "./components/UserList";
import { Toaster } from "@/components/ui/toaster";

interface User {
  name: string;
  email: string;
  phone: { country: string; number: string };
  documentPhoto: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal

  const addUser = (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="w-full text-center flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Toaster />
      <h1 className="text-2xl mb-4">User Registration</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add User
      </button>
      <AddUserForm
        onAddUser={addUser}
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
      />
      <h2 className="text-xl mt-8">User List</h2>
      <UserList users={users} />
    </div>
  );
};

export default App;
