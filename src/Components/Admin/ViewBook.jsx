import React, { useState } from 'react';
import EditBook from './EditBook';

const BookRequestTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for the table including profile picture URLs
  const bookRequests = [
    {
      id: 1,
      name: 'Full Name 1',
      category: 'Fiction',
      author: 'Author 1',
      seller: 'Seller 1',
      price: '12.99',
      profilePic: 'https://via.placeholder.com/50', // Example profile picture
    },
    {
      id: 2,
      name: 'Full Name 2',
      category: 'Non-Fiction',
      author: 'Author 2',
      seller: 'Seller 2',
      price: '15.99',
      profilePic: 'https://via.placeholder.com/50', // Example profile picture
    },
    // Add more sample data as needed
  ];

  const filteredRequests = bookRequests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">View Book</h2>
        <input
          type="text"
          placeholder="Search by book name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>

      <table className="min-w-full bg-white border border-b border-gray-300">
        <thead>
          <tr>
            <th className="border-b border-gray-300 px-4 py-2">Profile</th>
            <th className="border-b border-gray-300 px-4 py-2">Books</th>
            <th className="border-b border-gray-300 px-4 py-2">Categories</th>
            <th className="border-b border-gray-300 px-4 py-2">Author</th>
            <th className="border-b border-gray-300 px-4 py-2">Seller</th>
            <th className="border-b border-gray-300 px-4 py-2">Price</th>
            <th className="border-b border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-100">
              <td className="border-b border-gray-300 px-4 py-2">
                <img src={request.profilePic} alt="Profile" className="rounded-full h-10 w-10 object-cover" />
              </td>
              <td className="border-b border-gray-300 px-4 py-2">{request.name}</td>
              <td className="border-b border-gray-300 px-4 py-2">{request.category}</td>
              <td className="border-b border-gray-300 px-4 py-2">{request.author}</td>
              <td className="border-b border-gray-300 px-4 py-2">{request.seller}</td>
              <td className="border-b border-gray-300 px-4 py-2">{request.price}</td>
              <td className="border-b border-gray-300 px-4 py-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">Approve</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded-md">Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination (basic example) */}
      <div className="flex justify-between items-center mt-4">
        <button className="bg-gray-300 px-4 py-2 rounded-md">Prev</button>
        <span>1</span>
        <button className="bg-gray-300 px-4 py-2 rounded-md">Next</button>
      </div>
      <EditBook/>
    </div>
  );
};

export default BookRequestTable;