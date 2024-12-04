"use client";


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IssueCard from '../components/IssueCard';

export default function Homepage() {
    const [issues, setIssues] = useState([]);

    // Fetch issues from the API
    useEffect(() => {
        axios.get('https://ballot-for-locals.onrender.com/api/issues/fetch')
            .then(response => {
                setIssues(response.data.issues);
            })
            .catch(error => {
                console.error('There was an error fetching issues!', error);
            });
    }, []); // Empty dependency array to run only once after initial render

    // Filter issues into current and solved
    const currentIssues = issues.filter(issue => !issue.isSolved);
    const solvedIssues = issues.filter(issue => issue.isSolved);

    return (
        <>


            <section className="hero">
                <p className="mt-20 text-6xl text-center">You are in <b className='underline'>Sultanpur</b></p>
            </section>

            <section className="problems lg:flex mx-16 mt-24 space-x-5 mb-10">
                <div className="current-problems border lg:w-1/2 p-2 overflow-auto h-[500px]">
                    <p className="text-center text-2xl mt-6 font-bold">Current Issues</p>

                    {currentIssues.length > 0 ? (
                        currentIssues.map((issue) => (
                            <IssueCard key={issue._id} issue={issue} />
                        ))
                    ) : (
                        <p>No current issues found.</p>
                    )}
                </div>

                <div className="current-problems border lg:w-1/2 p-2 overflow-auto h-[500px]">
                    <p className="text-center text-2xl mt-6 font-bold">Solved Issues</p>

                    {solvedIssues.length > 0 ? (
                        solvedIssues.map((issue) => (
                            <IssueCard key={issue._id} issue={issue} />
                        ))
                    ) : (
                        <p>No solved issues found.</p>
                    )}
                </div>
            </section>
        </>
    );
}
