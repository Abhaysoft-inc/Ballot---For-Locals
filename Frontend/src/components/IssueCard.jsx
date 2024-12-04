import React from 'react';
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://via.placeholder.com/192x192.png?text=No+Image';

export default function IssueCard({ issue }) {
    // Ensure we are safely accessing the media URL
    const mediaUrl = issue.media && issue.media[0] && issue.media[0].url ? issue.media[0].url : DEFAULT_IMAGE;

    return (
        <Link to={`/active-issue/${issue._id}`}>
            <div className="issues mt-6 w-full max-w-md mx-auto">
                <div className="flex border border-gray-400 rounded-lg overflow-hidden bg-white shadow-md h-48">
                    {/* Image Section */}
                    <div className="w-48 h-48 flex-shrink-0 overflow-hidden">
                        <img
                            src={mediaUrl}
                            alt={issue.description || 'Issue Image'}
                            className="w-full h-full object-cover" // Crop the image while maintaining its container size
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                            <div className="text-gray-900 font-bold text-xl mb-2">{issue.name}</div>
                            <div className="text-gray-700 text-base">
                                <p className="flex items-center mb-2">
                                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                                    {issue.address}
                                </p>
                                <p className="flex items-center mb-2">
                                    <FaTag className="text-blue-500 mr-2" />
                                    {issue.issueCategory}
                                </p>
                                <p className="flex items-center truncate">{issue.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
                            <img
                                className="w-10 h-10 rounded-full mr-4"
                                src="/img/jonathan.jpg"
                                alt="Avatar"
                            />
                            <div className="text-sm">
                                <p className="text-gray-900 leading-none">
                                    Posted by: {issue.isPostedByAnonymous ? 'Anonymous' : 'User'}
                                </p>
                                <p className="text-gray-600">
                                    {new Date(issue.datePosted).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
