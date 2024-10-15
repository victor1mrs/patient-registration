import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  phone: { country: string; number: string };
  documentPhoto: string;
}

const AddUserForm: React.FC<{
  onAddUser: (user: User) => void;
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
}> = ({ onAddUser, setModalOpen, modalOpen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documentPhoto, setDocumentPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const toast = useToast();

  const schema = z.object({
    name: z.string().regex(/^[A-Za-z\s]+$/, "Only letters are allowed"),
    email: z
      .string()
      .email("Invalid email")
      .refine((val) => val.endsWith("@gmail.com"), {
        message: "Only @gmail.com emails are allowed",
      }),
    phoneCountry: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().min(7, "Phone number must be at least 7 digits"),
    documentPhoto: z
      .instanceof(File)
      .refine((file) => file.type === "image/jpeg", {
        message: "Only .jpg files are allowed",
      }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = schema.safeParse({
      name,
      email,
      phoneCountry,
      phoneNumber,
      documentPhoto,
    });

    if (!result.success) {
      setErrors(result.error.errors.map((err) => err.message));
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: `${phoneCountry}${phoneNumber}`,
          documentPhoto: `http://example.com/${documentPhoto!.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding user");
      }

      onAddUser({
        name,
        email,
        phone: { country: phoneCountry, number: phoneNumber },
        documentPhoto: documentPhoto!.name,
      });

      setName("");
      setEmail("");
      setPhoneCountry("");
      setPhoneNumber("");
      setDocumentPhoto(null);
      setModalOpen(false);

      toast.toast({ title: "User added successfully!" });
    } catch (error) {
      console.error(error);
      toast.toast({ title: "Error adding user. Please try again." });
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50" />
      <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-md p-6 bg-white rounded shadow-md transform -translate-x-1/2 -translate-y-1/2">
        <DialogTitle className="text-lg font-semibold">Add User</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label
                htmlFor="phone-country"
                className="block text-sm font-medium text-gray-700"
              >
                Country Code
              </label>
              <input
                id="phone-country"
                type="text"
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone-number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="document-photo"
              className="block text-sm font-medium text-gray-700"
            >
              Document Photo (.jpg only)
            </label>
            <input
              id="document-photo"
              type="file"
              accept="image/jpeg"
              onChange={(e) => setDocumentPhoto(e.target.files?.[0] || null)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add User
          </button>
          {errors.length > 0 && (
            <div className="text-red-500 mt-2">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;
