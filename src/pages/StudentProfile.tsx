import { motion, AnimatePresence } from "framer-motion"
import { BriefcaseBusiness, Building2, Clock, FileText, GraduationCap, GraduationCapIcon, Languages, Laptop, Lightbulb, Mail, MapPin, Medal, Phone } from "lucide-react";
import { useParams } from "react-router-dom";
import { SingleTalent } from "../Hooks/Utlis";
import NoAboutMe from "../components/Loader/NoAbout";
import NoEducation from "../components/Loader/NoEducation";
import NoExperience from "../components/Loader/NoExp";
import NoSoftSkills from "../components/Loader/NoSoft";
import NoTechnicalSkills from "../components/Loader/NoTech";
import StudentLoader from "../components/Loader/StudentLoader";
import ResumeViewer from "../components/Common/ResumeViewer";
import { useState } from "react";


export default function StudentProfile() {


    // To open and close the modal
    const [isOpen, setIsOpen] = useState(false);


    // get id from url
    const { id } = useParams();


    // Get Single Talent
    const { data, isLoading, isFetching, isError } = SingleTalent(id || "");



    // Scroll to top when page is loaded
    window.scrollTo({ top: 0, behavior: 'smooth', });


    return (

        <>

            <main className="pt-20 sm:pt-12">


                <div className="c">


                    <div className=" w-full m-auto px-1 sm:px-10">


                        {

                            isLoading || isFetching || isError ?

                                <StudentLoader />

                                :

                                <div>

                                    <section className="sm:pt-10">


                                        {/* Banner Image */}
                                        <div className="relative group h-[25vh] md:h-[25vh] lg:h-[45vh] rounded-lg  md:rounded-2xl lg:rounded-3xl ">
                                            <img
                                                src={data?.profile?.cover_photo ? data?.profile?.cover_photo : "/Cover-def.jpg"}
                                                alt="banner"
                                                loading="lazy"
                                                className="w-full h-full object-cover rounded-lg md:rounded-2xl lg:rounded-3xl"
                                            />
                                        </div>



                                        {/* Profile Image */}
                                        <div className="flex justify-between -mt-6 sm:-mt-10 sm:ms-8 sm:me-10 ms-2">

                                            <div className="flex justify-between space-x-2">

                                                <div className="flex items-center gap-4">

                                                    <div className="relative group">

                                                        {/* Shimmer border effect for premium users */}
                                                        { data?.premium_badge && (
                                                            <div className="absolute inset-0 rounded-full border-shimmer"></div>
                                                        )}

                                                        <div className="relative w-24 h-24 md:w-32 md:h-32">

                                                            <img
                                                                src={data?.profile?.profile_pic ? data?.profile?.profile_pic : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="}
                                                                alt="profile"
                                                                loading="lazy"
                                                                className="w-full h-full  rounded-full object-cover border-4 border-white shadow-lg"
                                                            />

                                                            {/* Premium Badge */}
                                                            { data?.premium_badge && (

                                                                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 overflow-hidden rounded-full shadow-lg border-2 border-white">
                                                                    <div className="premium-badge bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold py-1 px-3 flex items-center gap-1 relative overflow-hidden">
                                                                        {/* Shimmer effect overlay */}
                                                                        <div className="shimmer-effect"></div>

                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                                                        </svg>
                                                                        PREMIUM
                                                                    </div>
                                                                </div>

                                                            )}

                                                        </div>


                                                    </div>

                                                </div>

                                                <div className="md:pt-12 pt-8">
                                                    <h1 className="font-semibold text-md md:text-lg">{data?.name.toUpperCase()}</h1>
                                                    <p className="font-[1rem] text-md md:text-lg text-gray-400">
                                                        {data?.job_title}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>

                                    </section>



                                    <section className="grid grid-cols-1 md:grid-cols-2 gap-9 px-2 sm:px-10">


                                        {/* About */}
                                        <div className="pt-10">

                                            <div className="">

                                                <h3 className="text-2xl  font-semibold capitalize text-gray-900 pb-5">
                                                    About Me
                                                </h3>

                                                {/* About User */}
                                                <p className="text-md sm:text-[1.1rem] font-[1rem] text-gray-500 leading-relaxed text-justify">
                                                    {data?.about ? data?.about : <NoAboutMe />}
                                                </p>

                                            </div>

                                        </div>



                                        <div className="md:p-4">
                                            <div className="max-w-full md:max-w-2xl mx-auto">
                                                <div className="shadow-sm bg-gray-50 rounded-lg p-4 md:p-6">
                                                    <h1 className="text-lg font-bold text-gray-500 mb-4">
                                                        Personal Details:
                                                    </h1>

                                                    <table className="w-full text-sm text-left text-gray-600 font-bold">


                                                        <tbody>


                                                            <tr className="border-b border-gray-200">
                                                                <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap text-start block md:table-cell">
                                                                    <Mail className="inline-block w-4 h-4 mr-2" />
                                                                    Contact Email:
                                                                </th>
                                                                <td className="px-4 py-2 text-gray-800 block md:table-cell">
                                                                    {data?.email ? data?.email : "Not Available"}
                                                                </td>
                                                            </tr>



                                                            <tr className="border-b border-gray-200">
                                                                <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap text-start block md:table-cell">
                                                                    <Phone className="inline-block w-4 h-4 mr-2" />
                                                                    Phone Number:
                                                                </th>
                                                                <td className="px-4 py-2 text-gray-800 block md:table-cell">
                                                                    {data?.phone ? data?.phone : "Not Available"}
                                                                </td>
                                                            </tr>



                                                            <tr className="border-b border-gray-200">
                                                                <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap text-start block md:table-cell">
                                                                    <MapPin className="inline-block w-4 h-4 mr-2" />
                                                                    Preferred Work Location (City/Area):
                                                                </th>
                                                                <td className="px-4 py-2 text-gray-800 block md:table-cell">
                                                                    {data?.preferred_work_location ? data?.preferred_work_location : "Not Available"}
                                                                </td>
                                                            </tr>



                                                            <tr className="border-b border-gray-200">
                                                                <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap text-start block md:table-cell">
                                                                    <Clock className="inline-block w-4 h-4 mr-2" />
                                                                    Available Work Hours:
                                                                </th>
                                                                <td className="px-4 py-2 text-gray-800 block md:table-cell">
                                                                    {data?.available_work_hours ? data?.available_work_hours : "Not Available"}
                                                                </td>
                                                            </tr>



                                                            <tr className="border-b border-gray-200">
                                                                <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap text-start block md:table-cell">
                                                                    <Languages className="inline-block w-4 h-4 mr-2" />
                                                                    Languages Known:
                                                                </th>
                                                                <td className="py-2 px-4 text-gray-800 block md:table-cell">

                                                                    {
                                                                        data?.languages && data?.languages.length > 0 ?

                                                                            data?.languages?.map((item: any) => item.language).join(", ")

                                                                            : "None"
                                                                    }

                                                                </td>
                                                            </tr>

                                                        </tbody>

                                                    </table>


                                                    {data?.additional_information?.employee_resume &&

                                                        <div className="w-full flex items-center justify-center py-4">

                                                            <button onClick={() => { setIsOpen(true) }} className="font-bold text-md flex items-center justify-center w-52 hover:cursor-pointer bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-300">
                                                                <FileText size={24} className="mr-2" />  Download Cv
                                                            </button>

                                                        </div>

                                                    }

                                                </div>


                                            </div>
                                        </div>


                                    </section>



                                    {/* Skills */}
                                    <section className="w-full py-4 px-2 sm:px-10">

                                        <h1 className="text-2xl pt-3 pb-5 pl-2 text-start font-semibold text-gray-900 flex items-center">
                                            Technical Skills <Laptop className="inline-block ml-2" size={28} />
                                        </h1>

                                        <div className="flex flex-wrap justify-start">


                                            {

                                                data?.technical_skills && data?.technical_skills.length > 0 ?


                                                    data?.technical_skills?.map((skill: any, index: number) => {
                                                        // Convert skill level to percentage
                                                        const skillLevels: { [key: string]: number } = {
                                                            Beginner: 25,
                                                            Intermediate: 50,
                                                            Advanced: 75,
                                                            Expert: 100,
                                                        };
                                                        const skillPercentage = skillLevels[skill.technical_level] || 50; // Default to 50%

                                                        return (
                                                            <div key={index} className="w-full md:w-1/2 xl:w-1/3 mb-5 px-2">

                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-base font-medium text-gray-400">
                                                                        {skill.technical_skill}
                                                                    </span>
                                                                    <span className="text-sm font-medium text-gray-400">{skillPercentage}%</span>
                                                                </div>

                                                                <div className="w-full bg-gray-200 rounded-full">
                                                                    <div
                                                                        className="bg-[#059669] h-2 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                                                        style={{ width: `${skillPercentage}%` }}
                                                                    ></div>
                                                                </div>

                                                            </div>
                                                        );
                                                    })

                                                    :

                                                    <NoTechnicalSkills />

                                            }

                                        </div>


                                    </section>




                                    {/* Soft Skills */}
                                    <section className="w-full py-10 px-2 sm:px-10">

                                        <h1 className="text-2xl pt-3 pb-5 pl-2 text-start font-semibold text-gray-900 flex items-center">
                                            Soft Skills <Lightbulb className="inline-block ml-2" size={28} />
                                        </h1>

                                        <div className="flex flex-wrap gap-2">
                                            {data?.soft_skills && data?.soft_skills.length > 0 ? (
                                                data.soft_skills.map((skill: any, index: number) => (
                                                    <span key={index} className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                                                        {skill.soft_skill}
                                                    </span>
                                                ))
                                            ) : (

                                                <NoSoftSkills />

                                            )}
                                        </div>

                                    </section>



                                    {/* Experience */}
                                    <section className="w-full pb-8 sm:px-10 px-2 py-10">

                                        <h1 className="text-2xl py-3 pl-2 text-start font-semibold text-gray-900 flex items-center">
                                            Experience <BriefcaseBusiness size={28} className="ml-2" />
                                        </h1>



                                        {
                                            data?.experiences && data.experiences.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-3 py-5 gap-10">
                                                    {data?.experiences.map((item: any, index: number) => (
                                                        <div className="flex gap-5" key={index}>
                                                            <div>
                                                                <img
                                                                    className="w-14 h-14 object-cover rounded-full"
                                                                    src="/Exp-Deaf.png"
                                                                    alt="company-logo"
                                                                    loading="lazy"
                                                                />
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center">
                                                                    <h1 className="text-xl text-gray-900 font-semibold sm:me-5 me-2">
                                                                        {item?.exp_job_title}
                                                                    </h1>
                                                                    <p className="text-center font-semibold text-gray-500">
                                                                        {new Date(item?.exp_start_date).getFullYear()} -{" "}
                                                                        {item?.exp_working ? "Present" : new Date(item?.exp_end_date).getFullYear()}
                                                                    </p>
                                                                </div>

                                                                <p className="pb-2 font-semibold text-indigo-500">
                                                                    {item?.exp_company_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (

                                                <NoExperience />
                                            )
                                        }

                                    </section>




                                    {/* Education */}
                                    <div className="w-full max-w-7xl mx-auto py-0 sm:py-6 px-0 sm:px-0 mb-10">

                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 px-2 flex items-center">
                                            Educational Qualifications <GraduationCapIcon size={28} className="ml-2" />
                                        </h2>

                                        <AnimatePresence>

                                            {data?.educations && data.educations.length > 0 ?

                                                <div className="space-y-4 sm:space-y-8">

                                                    {data?.educations.map((item: any) => (
                                                        <motion.div
                                                            key={item.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="group relative border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50 transition-all duration-300"
                                                        >
                                                            <div className="px-3 py-4 sm:px-6 sm:py-8">
                                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8">
                                                                    {/* Left Column - Year */}
                                                                    <div className="sm:w-24 pt-1">
                                                                        <span className="text-sm sm:text-md font-medium text-gray-500">
                                                                            {item.expected_graduation_year}
                                                                        </span>
                                                                    </div>

                                                                    {/* Middle Column - Main Content */}
                                                                    <div className="flex-1 space-y-3">
                                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                                            <div className="flex items-center gap-2">
                                                                                <GraduationCap className="h-5 w-8 sm:h-5 sm:w-5 text-blue-500" />
                                                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                                                    {item.name_of_institution}
                                                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs sm:text-sm font-semibold text-blue-700 ms-2">
                                                                                        {item.academic_level}
                                                                                    </span>
                                                                                </h3>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                                <Building2 className="h-4 w-4" />
                                                                                <span className="text-xs sm:text-sm">{item.field_of_study}</span>
                                                                            </div>

                                                                            {item.achievement_name && (
                                                                                <div className="flex items-start gap-2 text-gray-600">
                                                                                    <Medal className="h-4 w-4 mt-0.5 text-yellow-500" />
                                                                                    <span className="text-xs sm:text-sm">
                                                                                        {item.achievement_name.replace(/,/g, ', ')}
                                                                                    </span>
                                                                                </div>

                                                                            )}
                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            </div>

                                                            {/* Hover line indicator */}
                                                            <div className="absolute left-0 top-0 h-full w-0.5 bg-blue-500 opacity-100 transition-all duration-200" />

                                                        </motion.div>
                                                    ))}
                                                </div>

                                                :

                                                <NoEducation />

                                            }

                                        </AnimatePresence>

                                    </div>


                                </div>

                        }

                    </div>


                </div>

                <ResumeViewer isOpen={isOpen} onRequestClose={() => setIsOpen(false)} resumeUrl={data?.additional_information?.employee_resume} />

            </main>


        </>


    )


}
