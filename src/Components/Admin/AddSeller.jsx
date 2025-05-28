import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddSellerForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [peopleCount, setPeopleCount] = useState('Just me');
  const [websiteLink, setWebsiteLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., API call
    console.log({ fullName, email, password, companyName, peopleCount, websiteLink });
  };

  return (
    <div className="items-center ">
        <div className='flex'>
        <h2 className="text-2xl  mr-20 font-bold mb-6">Add Seller</h2>
        <form onSubmit={handleSubmit} className="ml-40 bg-white p-6 border border-black w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded-md w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">What is your company name?</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border rounded-md w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">How many people are you working with?</label>
          <select
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            className="border rounded-md w-full p-2"
          >
            <option value="Just me">Just me</option>
            <option value="2-10">2-10</option>
            <option value="11-50">11-50</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Website link</label>
          <input
            type="url"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="border rounded-md w-full p-2"
          />
        </div>
        <div className="flex justify-between">
          <Link to="/admin/seller-status" type="button" className="bg-gray-300 text-black px-4 py-2 rounded-md">Back</Link>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md">Get Started</button>
        </div>
      </form>
        </div>
      
     
    </div>
  );
};

export default AddSellerForm;