import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const CreateIssueForm = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [formData, setFormData] = useState({
        name: '',
        media: null, // Now we're storing the file object here
        isPostedByAnonymous: false,
        address: '',
        concerningAuthority: '',
        issueCategory: '',
        description: '',
    });

    // Handle form changes
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        formDataToSend.append('name', formData.name);
        formDataToSend.append('media', formData.media); // Append the file
        formDataToSend.append('isPostedByAnonymous', formData.isPostedByAnonymous);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('concerningAuthority', formData.concerningAuthority);
        formDataToSend.append('issueCategory', formData.issueCategory);
        formDataToSend.append('description', formData.description);

        // Make the API call to the backend to submit the form
        fetch('http://localhost:3000/api/issues/create', {
            method: 'POST',
            body: formDataToSend,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Form Data Submitted:', data);
                // Show an alert upon successful issue creation
                alert('Issue created successfully!');
                // Navigate back to the homepage after submission
                navigate('/');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="max-w-full lg:max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-12">
            <h1 className="text-3xl font-semibold text-center mb-8 text-blue-600">Create an Issue</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block text-gray-800 font-medium mb-2">Issue Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        placeholder="Enter issue name"
                        required
                    />
                </div>

                {/* Media (File Input for Images/Videos) */}
                <div>
                    <label className="block text-gray-800 font-medium mb-2">Upload Media (Image or Video)</label>
                    <input
                        type="file"
                        name="media"
                        onChange={handleChange}
                        accept="image/*,video/*"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>

                {/* Address and Concerning Authority in Landscape Mode */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-800 font-medium mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Enter the address"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 font-medium mb-2">Concerning Authority</label>
                        <input
                            type="text"
                            name="concerningAuthority"
                            value={formData.concerningAuthority}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Enter concerning authority"
                            required
                        />
                    </div>
                </div>

                {/* Issue Category and Description in Landscape Mode */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-800 font-medium mb-2">Issue Category</label>
                        <input
                            type="text"
                            name="issueCategory"
                            value={formData.issueCategory}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Enter the issue category"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Describe the issue in detail"
                        />
                    </div>
                </div>

                {/* Anonymous Posting */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isPostedByAnonymous"
                        checked={formData.isPostedByAnonymous}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-500"
                    />
                    <label className="text-gray-800 font-medium">Post Anonymously</label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                        Submit Issue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateIssueForm;
