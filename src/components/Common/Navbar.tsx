import { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Crown, Gauge, GraduationCap, House, KeyRound, LayoutDashboard, LogOut, Search, User } from 'lucide-react';
import {
  Dialog,
  Transition
} from '@headlessui/react'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import ProtectedPostJobButton from "./ProtectedPostJobButton";
import { GetProfile } from "../../Hooks/UserProfile";
import { useQueryClient } from "@tanstack/react-query";
import ProfileMenu from "./ProfileMenu";





export default function Header() {


  const Navigate = useNavigate()


  // To check if the user is scrolled
  const [scrolled, setScrolled] = useState(false);



  // To open and close the mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)



  // To Set the text color
  const [color, setcolor] = useState(false);



  // To get the current path
  const location = useLocation();


  // To use auth context logout
  const { logout, isAuthenticated, setLoginModalOpen } = useAuth()



  // Get User Profile data
  const { data } = GetProfile()



  // Listen for dock "More" button to open mobile menu
  useEffect(() => {
    const handleOpenMenu = () => setMobileMenuOpen(true);
    document.addEventListener("open-mobile-menu", handleOpenMenu);
    return () => document.removeEventListener("open-mobile-menu", handleOpenMenu);
  }, []);

  // Add a scroll event listener
  useEffect(() => {

    setcolor(location.pathname === "/" || location.pathname === "/findtalent" || location.pathname === "/employerprofile" || location.pathname === "/userprofile" ? true : false)

    const handleScroll = () => {

      if (window.scrollY > 50) {
        setScrolled(true);
        setcolor(false)

      } else {
        setScrolled(false);
        setcolor(location.pathname === "/" || location.pathname === "/findtalent" || location.pathname === "/employerprofile" || location.pathname === "/userprofile" ? true : false)
      }

    }


    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };


  }, [location]);




  // To use query client
  const queryClient = useQueryClient()



  // Logout
  const HandleLogOut = () => {

    logout()

    queryClient.invalidateQueries({ queryKey: ["UserProfile"] });

    toast.success("Logout Successful...!")

    Navigate("/")


  }


  return (



    <>

      <main className={` z-50 fixed top-0 left-0 w-full transition-colors duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}>

        <header className="">

          <nav
            aria-label="Global"
            className="mx-auto max-w-7xl px-3 py-1 sm:px-0 sm:py-0 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-0"  >

            {/* Left — Logo */}
            <div className="flex items-center justify-between lg:justify-self-start">
           
              <Link
                to="https://studentsgigs.com/"
                className="-m-1.5 p-1.5"
              >
                <span className="sr-only">Students Gigs</span>

                <img
                  alt="Students Gigs"
                  src="/Nav-Icon.png"
                  loading="lazy"
                  className="h-12 w-28 sm:h-20 sm:w-52"
                />
              </Link>
           
            </div>


            {/* Center — Desktop Buttons */}
            <div className="hidden items-center gap-x-5 lg:flex lg:justify-self-center">
        
              {/* Post Job */}
              <ProtectedPostJobButton />

              {/* Hire Students */}
              <Link to="/findtalent">
                <button
                  className="  flex items-center gap-x-2 bg-[#eb8125] px-16 py-2 text-md font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:cursor-pointer  hover:shadow-lg "
                >
                  Hire Students
                  <GraduationCap size={24} />
                </button>
              </Link>

            </div>


            {/* Right — Navigation Icons */}
            <div className="hidden items-center gap-x-5 lg:flex lg:justify-self-end">

              {/* Home */}
              <Link to="/" className={`text-md font-semibold text-gray-400 hover:text-green-600 ${color ? "text-white" : ""}`}  >
                <House size={30} />
              </Link>


              {/* Profile */}
              <ProfileMenu
                LoginStatus={isAuthenticated}
                HandleLogOut={HandleLogOut}
                data={data}
                color={color}
                setLoginModalOpen={setLoginModalOpen}
              />

              {/* Search */}
              <Link to="/findtalent" className={`flex items-center justify-center p-2 text-md font-semibold ${color ? "bg-transparent" : ""} `} >
                <Search className={color ? "text-white" : "text-gray-400"} />
              </Link>

            </div>


          </nav>




          {/* Mobile Nav sidebar */}
          <Transition show={mobileMenuOpen} as={Fragment}>



            <Dialog onClose={setMobileMenuOpen} className="lg:hidden relative z-50">



              {/* Backdrop */}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              </Transition.Child>


              {/* Sliding panel */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >


                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">


                  {/* Logo Section */}
                  <div className="flex items-center justify-between">


                    <a href="/" className="-m-1.5 p-1.5">
                      <span className="sr-only">Your Company</span>
                      <img
                        alt="nav-icon"
                        src="/Nav-Icon.png"
                        loading="lazy"
                        className="h-14 w-auto"
                      />
                    </a>

                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="size-8" />
                    </button>


                  </div>



                  {/* Menu Content */}
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-out duration-200 delay-75"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >

                    <div className="mt-6 flow-root">


                      <div className="-my-6 divide-y divide-gray-500/10">


                        <div className="space-y-2 py-6">


                          {/* Profile */}
                          <Link
                            to="/employerprofile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="group -mx-3 flex items-center gap-x-3 px-3 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-400/45"
                          >
                            <div className="flex items-center space-x-2">
                              <User className="h-5 w-5" />
                              <span>Profile</span>
                            </div>
                          </Link>



                          {/* Premium */}
                          <Link
                            to="/plans"
                            onClick={() => setMobileMenuOpen(false)}
                            className="group -mx-3 flex items-center gap-x-3 px-3 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-400/45"
                          >
                            <div className="flex items-center space-x-2">
                              <Crown className="h-5 w-5" />
                              <span>Premium</span>
                            </div>
                          </Link>




                          {/* dashboard */}
                          <Link
                            to="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="group -mx-3 flex items-center gap-x-3 px-3 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-400/45"
                          >
                            <div className="flex items-center space-x-2">
                              <LayoutDashboard size={20} className="me-2" />
                              <span>Dashboard</span>
                            </div>
                          </Link>




                          {/* Plan Usage */}
                          <Link
                            to="/planusage"
                            onClick={() => setMobileMenuOpen(false)}
                            className="group -mx-3 flex items-center gap-x-3 px-3 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-400/45"
                          >
                            <div className="flex items-center space-x-2">
                              <Gauge size={20} className="me-2" />
                              <span>Plan Usage</span>
                            </div>
                          </Link>




                          {/* Login/Logout */}
                          {!isAuthenticated ? (
                            <div
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setLoginModalOpen(true);
                              }}
                              className="group -mx-3 flex items-center gap-x-3 px-3 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-400/45 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <KeyRound className="h-5 w-5" />
                                <span>Login</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={HandleLogOut}
                              className="group w-full -mx-3 flex items-center gap-x-3 px-3 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-400/45"
                            >
                              <div className="flex items-center space-x-2">
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                              </div>
                            </button>
                          )}



                        </div>

                      </div>


                    </div>


                  </Transition.Child>


                </Dialog.Panel>


              </Transition.Child>


            </Dialog>


          </Transition>


        </header>


      </main>

    </>



  )
}
