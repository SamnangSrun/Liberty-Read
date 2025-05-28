import React, { useState } from 'react';

const OrderStatusTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of rows per page

    // Sample data for orders
    const orders = [
        { id: 1, customerName: 'John Doe', price: '$55.00', quantity: 14, status: 'Complete' },
        { id: 2, customerName: 'Jane Smith', price: '$55.00', quantity: 14, status: 'Complete' },
        { id: 3, customerName: 'Mike Johnson', price: '$55.00', quantity: 14, status: 'Complete' },
        // Add more sample data as needed
    ];

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Order Status</h2>
            <table className="min-w-full bg-white border border-gray-300 text-center">
                <thead>
                    <tr>
                        <th className="border-b border-gray-300 px-4 py-2">Books ID</th>
                        <th className="border-b border-gray-300 px-4 py-2">Customer Name</th>
                        <th className="border-b border-gray-300 px-4 py-2">Price</th>
                        <th className="border-b border-gray-300 px-4 py-2">Quantity</th>
                        <th className="border-b border-gray-300 px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-100">
                            <td className="border-b border-gray-300 px-4 py-2">{order.id}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{order.customerName}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{order.price}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{order.quantity}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 w-full max-w-md">
                <button 
                    className="bg-gray-300 px-4 py-2 rounded-md" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                    Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    className="bg-gray-300 px-4 py-2 rounded-md" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderStatusTable;