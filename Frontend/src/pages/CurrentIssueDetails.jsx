import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';

const IssueDetailsPage = () => {
    const { id } = useParams(); // Extract the issue ID from the URL
    const [issue, setIssue] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Fetch issue details based on the ID
    useEffect(() => {
        const fetchIssueDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/issues/${id}`); // Fetch specific issue by ID
                const fetchedIssue = response.data;

                setIssue(fetchedIssue);
                setUpvotes(fetchedIssue.upvotes || 0);
                setDownvotes(fetchedIssue.downvotes || 0);
                setComments(fetchedIssue.comments || []);
            } catch (error) {
                console.error('Error fetching issue details:', error);
            }
        };

        fetchIssueDetails();
    }, [id]); // Dependency array includes 'id' to refetch if it changes

    // Handle adding a new comment
    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await axios.post(`http://localhost:3000/api/issues/${id}/comments`, { text: newComment });
                setComments([...comments, { author: "You", text: newComment }]);
                setNewComment("");
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    // Voting functions
    const handleUpvote = async () => {
        try {
            await axios.post(`http://localhost:3000/api/issues/${id}/upvote`);
            setUpvotes(upvotes + 1);
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    const handleDownvote = async () => {
        try {
            await axios.post(`http://localhost:3000/api/issues/${id}/downvote`);
            setDownvotes(downvotes + 1);
        } catch (error) {
            console.error('Error downvoting:', error);
        }
    };

    // Display loading indicator until issue data is fetched
    if (!issue) return <p>Loading issue details...</p>;

    // Media URL Extraction logic
    const getMediaUrl = (media) => {
        if (media && Array.isArray(media)) {
            // Check if there is a valid image or video URL in the media array
            const mediaItem = media[0]; // assuming you want the first media item
            return mediaItem.url || ''; // safely access the URL
        }
        return ''; // default to empty string if no media is available
    };

    const mediaUrl = getMediaUrl(issue.media);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-2">{issue.name}</h1>
            <p className="text-gray-700 mb-4 flex"> <FaMapMarkerAlt className="text-red-500 mr-2 mt-1" />{issue.address}</p>

            <div className="mb-4">
                <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {issue.issueCategory}
                </span>
            </div>
            <p className="text-gray-800 mb-6">{issue.description}</p>

            {/* Media Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaUrl ? (
                        <div className="rounded-lg overflow-hidden shadow">
                            {mediaUrl.includes('image') ? (
                                <img src={mediaUrl} alt="Media" className="w-full h-48 object-cover" />
                            ) : (
                                <video controls className="w-full h-48">
                                    <source src={mediaUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            </div>

            {/* Voting Section */}
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={handleUpvote} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Upvote ({upvotes})
                </button>
                <button onClick={handleDownvote} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Downvote ({downvotes})
                </button>
            </div>

            {/* Comments Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                            <p className="font-semibold">{comment.author}</p>
                            <p className="text-gray-700">{comment.text}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddComment}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailsPage;
