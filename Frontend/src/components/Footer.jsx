import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <>


            <footer className="bg-[#1d2e38] mt-10">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex justify-center text-teal-600 sm:justify-start">
                            <Link to={'/'} className="block text-teal-600">
                                <img src="/logo.png" className='h-[60px]' alt="" />
                            </Link>
                        </div>

                        <p className="mt-4 text-center text-sm text-white lg:mt-0 lg:text-right">
                            Copyright &copy; Ballot 2024. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer></>
    )
}
