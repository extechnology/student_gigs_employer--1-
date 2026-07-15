import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:p-5 bg-gray-900 text-white">


        {/* Left Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Students Gigs</h3>
          <p>
            Join us in creating a smarter, more independent generation by
            connecting students with real-world opportunities!
          </p>
        </div>


        {/* Middle Section */}
        <div className="sm:text-center">
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to={'/findtalent'} className="hover:text-gray-400">
                Hire Students
              </Link>
            </li>
            <li>
              <a href="https://studentsgigs.com/jobfilter" target="_blank" className="hover:text-gray-400">
                Explore Jobs
              </a>
            </li>
            <li>
              <Link to={'/contact'} className="hover:text-gray-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Our Address</h3>
          <p>StudentsGigs is an initiative of Medresearch India Pvt. Ltd.</p>
          <p className="mt-2">Medresearch India Pvt. Ltd.</p>
          <p>RKP/569H, Usha Building, Parammal Road</p>
          <p>Ramanattukara, Kozhikode, Kerala, India. PIN 673633</p>
          <a href="https://wa.me/919072399100" target="_blank" rel="noopener noreferrer" className="mt-2 block hover:text-indigo-400">
            📞 +91 90723 99100
          </a>
          <a href="mailto:studentsgigs@gmail.com" className="block hover:text-indigo-400">
            📧 studentsgigs@gmail.com
          </a>

        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Connect With Us</h3>

          <div className="flex space-x-4 mb-4">
            <a href="https://www.facebook.com/studentsgigs.in" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-lg"></i>
            </a>
            <a href="https://www.instagram.com/studentgigs.in" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-lg"></i>
            </a>
            <a href="https://www.threads.net/@studentgigs.in" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-threads fa-lg"></i>
            </a>
            <a href="https://x.com/studentgigsone" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-x-twitter fa-lg"></i>
            </a>
            <a href="https://www.linkedin.com/company/studentsgigs/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-lg"></i>
            </a>
            <a href="https://in.pinterest.com/studentgigsone/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-pinterest fa-lg"></i>
            </a>
          </div>


          {/* Play Store Button */}
          {/* <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-52 justify-center items-center gap-2 text-white px-4 pb-3 rounded-full shadow-lg transition-all"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className="h-10 w-full object-contain"
            />
            <span className="sr-only">Get it on Google Play</span>
          </a> */}


          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919072399100?text=Hi%21%20May%20I%20Know%20More%20About%20StudentsGigs%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-52 justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-all mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M12.04 2C6.58 2 2.16 6.42 2.16 11.89c0 2.1.55 4.15 1.59 5.95L2 22l4.28-1.12a10.03 10.03 0 005.76 1.68c5.46 0 9.88-4.42 9.88-9.89S17.5 2 12.04 2zm.01 17.73c-1.83 0-3.62-.5-5.17-1.44l-.37-.22-2.55.66.68-2.49-.24-.39a8.03 8.03 0 01-1.27-4.34c0-4.44 3.62-8.06 8.06-8.06 4.44 0 8.06 3.62 8.06 8.06s-3.62 8.06-8.06 8.06zm4.4-6.1c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.2-.71-.63-1.18-1.41-1.32-1.65-.14-.24-.02-.37.1-.49.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3 0-.42-.06-.12-.54-1.29-.74-1.76-.2-.48-.4-.4-.54-.41l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.06s.88 2.4 1.02 2.57c.14.16 1.73 2.64 4.2 3.7.59.26 1.05.42 1.4.54.59.18 1.12.16 1.54.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
            </svg>
            <span className="text-center">Let’s Chat</span>
          </a>


        </div>


      </div>



      {/* Call-to-Action */}
      <div className="text-center mt-10">
        <Link to={'/findtalent'}>
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
            Get Started
          </button>
        </Link>
      </div>



      {/* Horizontal Line */}
      <div className="mt-10 border-t border-gray-700"></div>



      {/* Copyright Section */}
      <div className="mt-4 text-center text-sm px-4">
        <p>&copy; {new Date().getFullYear()} Students Gigs. All Rights Reserved.</p>

        <div className="flex flex-wrap justify-center gap-2 py-1 text-xs sm:text-sm">
          <Link to={'/privacypolicy'} className="hover:text-gray-400">
            Privacy Policy
          </Link>

          <span className="hidden sm:inline">|</span>

          <Link to={'/termscondition'} className="hover:text-gray-400">
            Terms & Conditions
          </Link>

          <span className="hidden sm:inline">|</span>

          <Link to={'/refundpolicy'} className="hover:text-gray-400">
            Refund Policy
          </Link>

          <span className="hidden sm:inline">|</span>

          <Link to={'/disclaimer'} className="hover:text-gray-400">
            Disclaimer
          </Link>

        </div>

       <a href="https://extechnology.in/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm">Powered by <span className="hover:text-blue-400 text-md">ex-technology</span></a>


      </div>


    </footer>
  );
};

export default Footer;
