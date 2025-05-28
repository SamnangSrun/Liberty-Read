import React, { useState } from 'react';
import uploadf from '../../Img/Admin/upload.png'; // Ensure this path is correct

const EditBookForm = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <h2 className="text-xl mt-10 font-bold">View Book</h2>
            <div className="flex flex-col items-center p-6  ">
                <div className='flex'>
                    <div className='mr-14 mt-32'>
                        <h1 className='text-center mb-6 font-medium'>Book Photo</h1>
                        <img 
                            src={image ? image : uploadf} // Use the uploaded image or the placeholder
                            alt="Book Cover" 
                            className="mb-4 w-96 h-auto object-cover" 
                        />
                        <div className='text-center'>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mb-4 cursor-pointer hidden"
                                id="upload"
                            />
                            <label 
                                htmlFor="upload" 
                                className="mb-4 cursor-pointer px-4 py-2 border border-black text-gray-800 text-center inline-block"
                            >
                                Upload photo
                            </label>
                        </div>
                    </div>
                    <form className="w-full border p-6 border-black max-w-md">
                        <div className="mb-4 ">
                            <label className="block " htmlFor="name">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                className="mt-1 block w-full border border-black p-2" 
                                placeholder="Name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block " htmlFor="author">Author</label>
                            <input 
                                type="text" 
                                id="author" 
                                className="mt-1 block w-full border border-black p-2" 
                                placeholder="Author"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block " htmlFor="details">Book Details</label>
                            <input 
                                type="text" 
                                id="details" 
                                className="mt-1 block w-full border border-black p-2" 
                                placeholder="Type..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block " htmlFor="categories">Categories</label>
                            <select 
                                id="categories" 
                                className="mt-1 block w-full border border-black p-2"
                            >
                                <option>Select one...</option>
                                {/* Other category options */}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block " htmlFor="price">Price</label>
                            <input 
                                type="text" 
                                id="price" 
                                className="mt-1 block w-full border border-black p-2" 
                                placeholder="Price"
                            />
                        </div>

                        <div className="flex justify-end mt-4">
                            <button className="px-4 mr-4 py-2 bg-white border border-black hover:bg-black hover:text-white">Cancel</button>
                            <button className="px-4 py-2 bg-black w-20 text-white hover:bg-white border hover:text-black">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditBookForm;