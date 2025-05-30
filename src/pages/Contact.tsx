

export default function Contact() {



    // Scroll to top when page is loaded
    window.scrollTo({ top: 0, behavior: 'smooth', });


    return (


        <>

            <main className="pt-20 px-2 md:px-32 lg:px-16 py-16 bg-slate-50/15">


                <section className="min-h-screen">

                    <div className="container px-6 py-10 mx-auto">

                        <div className="lg:flex lg:items-center lg:-mx-10">

                            <div className="mt-12 lg:flex lg:mt-0 lg:flex-col lg:items-center lg:w-1/2 lg:mx-10">

                                <img className="hidden object-cover mx-auto rounded-full lg:block shrink-0 w-96 h-96" src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="" />


                                <div className="mt-6 space-y-8 md:mt-8">


                                    {/* Address */}
                                    <p className="flex items-start -mx-2">

                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-gray-950 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>

                                        <span className="mx-2 text-gray-700 w-72 ">
                                            Medresearch India Pvt. Ltd.

                                            RKP/569H, Usha Building, Parammal Road

                                            Ramanattukara, Kozhikode, Kerala, India, PIN 673633
                                        </span>
                                    </p>



                                    {/* Phone Number */}
                                    <p className="flex items-start -mx-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-gray-950 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>

                                        <span className="mx-2 text-gray-700 truncate w-72 ">

                                            <a href="https://wa.me/919072399100" target="_blank" rel="noopener noreferrer" className=" block hover:text-indigo-400">
                                                +91 90723 99100
                                            </a>

                                        </span>
                                    </p>


                                    {/* Email */}
                                    <p className="flex items-start -mx-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-gray-950 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>

                                        <span className="mx-2 text-gray-700 truncate w-72 ">

                                            <a href="mailto:studentsgigs@gmail.com" className="block hover:text-indigo-400">
                                                studentsgigs@gmail.com
                                            </a>

                                        </span>
                                    </p>


                                </div>



                                {/* Follow Us */}
                                <div className="mt-6 w-80 md:mt-8">


                                    <h3 className="text-gray-600 font-semibold text-md">Follow us</h3>

                                    <div className="flex mt-4 -mx-1.5 ">

                                        <a className="mx-1.5  text-gray-900 transition-colors duration-300 transform hover:text-blue-500" href="https://www.facebook.com/studentsgigs.in" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-facebook fa-lg"></i>
                                        </a>

                                        <a className="mx-1.5  text-gray-900 transition-colors duration-300 transform hover:text-blue-500" href="https://www.instagram.com/studentgigs.in" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-instagram fa-lg"></i>
                                        </a>

                                        <a className="mx-1.5  text-gray-900 transition-colors duration-300 transform hover:text-blue-500" href="https://www.threads.net/@studentgigs.in" target="_blank" rel="noopener noreferrer">
                                            <i className="fa-brands fa-threads fa-lg"></i>
                                        </a>

                                        <a href="https://x.com/studentgigsone" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-x-twitter fa-lg"></i>
                                        </a>

                                        <a className="mx-1.5  text-gray-900 transition-colors duration-300 transform hover:text-blue-500" href="https://www.linkedin.com/company/studentsgigs/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-linkedin fa-lg"></i>
                                        </a>

                                        <a className="mx-1.5  text-gray-900 transition-colors duration-300 transform hover:text-blue-500" href="https://in.pinterest.com/studentgigsone/" target="_blank" rel="noopener noreferrer">
                                            <i className="fa-brands fa-pinterest fa-lg"></i>
                                        </a>

                                    </div>

                                </div>



                            </div>


                            <div className="lg:w-1/2 lg:mx-10">


                                <h1 className="text-2xl font-semibold text-gray-800 capitalize  lg:text-3xl">Let’s talk</h1>

                                <p className="mt-4 text-gray-500 ">
                                    Ask us everything and we would love
                                    to hear from you
                                </p>

                                <form className="mt-12">

                                    <div className="-mx-2 md:items-center md:flex">

                                        <div className="flex-1 px-2">
                                            <label className="block mb-2 text-sm text-gray-600 ">Full Name</label>
                                            <input type="text" placeholder="Enter your name" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        </div>

                                        <div className="flex-1 px-2 mt-4 md:mt-0">
                                            <label className="block mb-2 text-sm text-gray-600 ">Email address</label>
                                            <input type="email" placeholder="Enter your email" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        </div>

                                    </div>

                                    <div className="w-full mt-4">
                                        <label className="block mb-2 text-sm text-gray-600 ">Message</label>
                                        <textarea className="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-56  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Message"></textarea>
                                    </div>

                                    <button className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        get in touch <i className="fa-regular fa-paper-plane"></i>
                                    </button>


                                </form>


                            </div>

                        </div>
                    </div>

                </section>

            </main>


        </>


    )

}
