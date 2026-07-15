import Select from 'react-select';
import RichTextEditor from '../Common/JobDis'
import { FileText, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AllLocations, GetJobCategory ,PreferedAcademicCourses} from '../../Hooks/Utlis';
import { OfflineJobPost } from '../../Hooks/Jobform';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { JObTittles } from '../../Hooks/Utlis';
import { useAuth } from '@/Context/AuthContext';
import { useNavigate } from 'react-router-dom';


// types
interface Option {
    value: string;
    label: string;
}


// form types
interface Inputs {

    job_title: string;
    job_description: string;
    category: string;
    age_requirement_min: string;
    age_requirement_max: string;
    preferred_academic_courses: string;
    pay_structure: string;
    salary_type: string;
    job_location_map: string;
    job_location: string

}



// Salary types
const compensationTypes: Option[] = [

    { label: "Hourly Gigs", value: "Hourly Gigs" },
    { label: "Daily Gigs", value: "Daily Gigs" },
    { label: "Weekend Gigs", value: "Weekend Gigs" },
    { label: "Vacation Gigs", value: "Vacation Gigs" },
    { label: "Project Based", value: "project" },

];


export default function OffilneTalentPost() {


    const [isVisible, setIsVisible] = useState(true);




    // React Hook Form state
    const { register, handleSubmit, watch, reset, formState: { errors }, control } = useForm<Inputs>({ defaultValues: { job_description: "" } })




    // Get selected Category 
    const selectedCategory = watch("category");





    const Navigate = useNavigate()



    // Auth context
    const { usage, isPlanExpired, isFetchingPlan } = useAuth()




    // Search keyword
    const [Search, setSearch] = useState<string>("")




    // Get Job Title
    const { data: JobTitle, isLoading: JobTitleLoading, isFetching: JobTitleFetching } = JObTittles(selectedCategory)



    // Get Preferred Academic Courses
    const { data: AcademicCourses, isLoading: AcademicCoursesLoading, isFetching: AcademicCoursesFetching } = PreferedAcademicCourses()



    // Get All Locations
    const { data: Location, isLoading: LocationLoading } = AllLocations(Search)




    // Get Category
    const { data: Category, isLoading: CategoryLoading, isFetching: CategoryFetching } = GetJobCategory("offline")





    // Post Online Job
    const { mutate: PostJob, isPending: isPosting } = OfflineJobPost()





    // Select Styles
    const customSelectStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: '42px',
            backgroundColor: '',
            borderColor: '#ccc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Added subtle shadow
            '&:hover': {
                borderColor: '#6366F1',
                boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)' // Stronger shadow on hover
            }
        }),
        option: (base: any, state: { isSelected: boolean }) => ({
            ...base,
            backgroundColor: state.isSelected ? '#4F46E5' : base.backgroundColor,
            '&:hover': {
                backgroundColor: state.isSelected ? '#4F46E5' : '#F3F4F6'
            }
        })
    };



    // From submission
    const handleFormSubmit = (data: Inputs) => {


        if (!isPlanExpired && usage?.can_post_job && !isFetchingPlan) {

            const formdata = new FormData()

            formdata.append("job_title", data.job_title)
            formdata.append("job_description", data.job_description)
            formdata.append("category", data.category)
            formdata.append("age_requirement_min", data.age_requirement_min)
            formdata.append("age_requirement_max", data.age_requirement_max)
            formdata.append("preferred_academic_courses", data.preferred_academic_courses)
            formdata.append("pay_structure", data.pay_structure)
            formdata.append("salary_type", data.salary_type)
            // formdata.append("job_location_map", data.job_location_map)
            formdata.append("job_location", data.job_location)

            PostJob({ formData: formdata }, {

                onSuccess: (res) => {

                    if (res.status >= 200 && res.status <= 300) {

                        toast.success("Job Posted successfully")
                        reset()
                        window.scrollTo({ top: 0, behavior: 'smooth', })

                    } else {

                        toast.error("Something went wrong. Please try again.")

                        console.log(res);

                    }
                }
            })

        } else {


            if (isPlanExpired || !usage?.can_post_job) {

                toast.error(`${isPlanExpired ? "Your Plan Has Been Expired Renew or Upgrade to Post Jobs.." : "Your Job Posting Limit Has Been Exceeded Please Upgrade Your Plan"} `)
                Navigate('/plans')

            } else {

                toast.error("Something went wrong. Please try again.")

            }

        }

    }





    return (



        <>

            <div className="container">


                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 shadow-sm p-2 sm:p-8  rounded-lg bg-orange-600/5">

                    <h1 className="text-2xl font-semibold py-3 text-gray-800 ">OFFLINE/TALENT*</h1>

                    {/* Note */}
                    <AnimatePresence>
                        {isVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-xl shadow-md flex items-start gap-3 relative"
                            >
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z"
                                    />
                                </svg>
                                <p className="text-sm font-medium flex-1">
                                    <span className="font-semibold">Note:</span> Once you post a job, you won’t be able to edit it. Please review all details before submitting.
                                </p>
                                <button
                                    type='button'
                                    onClick={() => setIsVisible(false)}
                                    className="text-yellow-900 hover:bg-yellow-200 p-1 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>




                    {/* 1st Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* Job Type */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                                {errors.category && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>

                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: "Job Category is required" }}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Select
                                        ref={ref}
                                        options={Category}
                                        value={value ? Category?.find((option: any) => option.value === value) : null}
                                        onChange={(selectedOption) => onChange(selectedOption?.value)}
                                        styles={customSelectStyles}
                                        placeholder="Select Job Category"
                                        className="mt-1"
                                        isClearable={true}
                                        classNamePrefix="select"
                                        isLoading={CategoryFetching || CategoryLoading}
                                        isSearchable={true}
                                        noOptionsMessage={() => 'No options found'}

                                    />

                                )}
                            />

                        </div>


                        {/* Location*/}
                        <div className='hidden sm:block'>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Location *
                                {errors.job_title && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>

                            <div className="mt-2">
                                <Controller
                                    name="job_location"
                                    rules={{ required: "Job Location is required" }}
                                    control={control}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Select
                                            ref={ref}
                                            options={Location}
                                            onInputChange={(value) => setSearch(value)}
                                            styles={customSelectStyles}
                                            value={value ? Location?.find((option: Option) => option?.label === value) : null}
                                            isSearchable={true}
                                            className="basic-single"
                                            onChange={(option: any) => { onChange(option?.label) }}
                                            placeholder="Search a City...."
                                            classNamePrefix="select"
                                            noOptionsMessage={() => "No Locations Found..."}
                                            isLoading={LocationLoading}

                                        />
                                    )}
                                />
                            </div>

                        </div>

                    </div>



                    {/* 2nd Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                                {errors.job_title && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>

                            <Controller
                                name="job_title"
                                control={control}
                                rules={{ required: "Job Title is required" }}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Select
                                        ref={ref}
                                        options={JobTitle}
                                        value={value ? JobTitle?.find((option: any) => option.label === value) : null}
                                        onChange={(selectedOption) => onChange(selectedOption?.label)}
                                        styles={customSelectStyles}
                                        placeholder={!selectedCategory ? "Select a Job Category First" : "Select Job Title"}
                                        className="mt-1"
                                        isClearable={true}
                                        isDisabled={!selectedCategory}
                                        isLoading={JobTitleLoading || JobTitleFetching}
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        noOptionsMessage={() => 'No Job Title found'}

                                    />

                                )}
                            />

                        </div>




                        {/* Location Mobile */}
                        <div className='block sm:hidden'>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Location *
                                {errors.job_title && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>

                            <div className="mt-2">
                                <Controller
                                    name="job_location"
                                    rules={{ required: "Job Location is required" }}
                                    control={control}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Select
                                            ref={ref}
                                            options={Location}
                                            onInputChange={(value) => setSearch(value)}
                                            styles={customSelectStyles}
                                            value={value ? Location?.find((option: Option) => option?.label === value) : null}
                                            isSearchable={true}
                                            className="basic-single"
                                            onChange={(option: any) => { onChange(option?.label) }}
                                            placeholder="Search a City...."
                                            classNamePrefix="select"
                                            noOptionsMessage={() => "No Locations Found..."}
                                            isLoading={LocationLoading}

                                        />
                                    )}
                                />
                            </div>

                        </div>




                        {/* Preferred Academic Course */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Academic Course *
                                {errors.preferred_academic_courses && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>
                            <Controller
                                name="preferred_academic_courses"
                                control={control}
                                rules={{ required: "Academic Course is required" }}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Select
                                        ref={ref}
                                        options={AcademicCourses}
                                        value={value ? AcademicCourses?.find((option: any) => option.label === value) : null}
                                        onChange={(selectedOption) => onChange(selectedOption?.label)}
                                        styles={customSelectStyles}
                                        placeholder={!selectedCategory ? "Select a Job Category First" : "Select Academic Course"}
                                        className="mt-1"
                                        isClearable={true}
                                        isDisabled={!selectedCategory}
                                        isLoading={AcademicCoursesLoading || AcademicCoursesFetching}
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        noOptionsMessage={() => 'No Academic Course found'}

                                    />

                                )}
                            />
                        </div>

                    </div>




                    {/* 3rd Row */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">


                        {/*Age */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age Preference*
                            </label>
                            <div className="flex gap-4">

                                {/* Minimum Age Input */}
                                <div className="w-full">
                                    <input
                                        type="number"
                                        min={14}
                                        placeholder="Minimum Age"
                                        {...register('age_requirement_min', {
                                            required: "Minimum Age is required",
                                            min: { value: 14, message: "Minimum age must be 14 or older" }
                                        })}
                                        className={`mt-1 block w-full p-4 rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-[42px] 
                                         ${errors.age_requirement_min ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.age_requirement_min && (
                                        <p className="text-red-500 text-xs mt-1">{errors.age_requirement_min.message}</p>
                                    )}
                                </div>

                                {/* Maximum Age Input */}
                                <div className="w-full">
                                    <input
                                        type="number"
                                        min={14}
                                        placeholder="Maximum Age"
                                        {...register('age_requirement_max', {
                                            required: "Maximum Age is required",
                                            min: { value: 14, message: "Minimum age must be 14 or older" }
                                        })}
                                        className={`mt-1 block w-full p-4 rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-[42px] 
                                         ${errors.age_requirement_max ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.age_requirement_max && (
                                        <p className="text-red-500 text-xs mt-1">{errors.age_requirement_max.message}</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>




                    {/* 4th Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>


                        {/* Compensation Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compensation/Pay Structure *
                                {errors.salary_type && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>
                            <Controller
                                name="salary_type"
                                control={control}
                                rules={{ required: "Compensation is required" }}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Select
                                        ref={ref}
                                        options={compensationTypes}
                                        value={value ? compensationTypes.find((option) => option.value === value) : null}
                                        onChange={(selectedOption) => onChange(selectedOption?.value)}
                                        styles={customSelectStyles}
                                        placeholder="Select a compensation type"
                                        className="mt-1"
                                        isClearable={true}
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        noOptionsMessage={() => 'No options found'}

                                    />

                                )}
                            />
                        </div>


                        {/* Amount */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount *
                                {errors.pay_structure && (
                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                )}
                            </label>

                            <input
                                type="text"
                                placeholder="Amount"
                                {...register('pay_structure', { required: "Amount is required" })}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                    if (value) {
                                        e.target.value = Number(value).toLocaleString(); // Format with commas
                                    } else {
                                        e.target.value = ""; // Keep input empty if cleared
                                    }
                                }}
                                className="block w-full p-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-[42px]"

                            />

                        </div>

                    </div>







                    {/* location on map */}
                    {/* <div className="col-span-full mt-2">
                        <label
                            htmlFor="location-on-map"
                            className="block text-sm/6 font-medium text-gray-900"
                        >
                            Location On Map*
                            {errors.job_location_map && (
                                <span className="text-red-500 ml-2 text-xs">Required</span>
                            )}
                        </label>
                        <input
                            id="location-on-map"
                            autoComplete="location-on-map"
                            type="url"
                            {...register("job_location_map", {
                                required: "Location on Map is required",
                            })}
                            className="block w-full p-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-[42px]"
                            placeholder="Map Location"
                        />

                    </div> */}




                    {/* Job Description */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description*
                            {errors.job_description && (
                                <span className="text-red-500 ml-2 text-xs">Required Edit or Add Description</span>
                            )}

                        </label>

                        <Controller
                            name="job_description"
                            control={control}
                            rules={{ required: "Job Description is required" }}
                            render={({ field: { onChange, value } }) => (

                                <RichTextEditor
                                    onChange={(content) => onChange(content)}
                                    minCharacters={2000}
                                    value={value}
                                    placeholder="Enter job description..."
                                    className="mt-2"
                                />
                            )}
                        />

                    </div>



                    <div>
                        <button
                            type="submit"
                            disabled={isPosting}
                            className="inline-flex hover:cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Post Job {isPosting ? <Loader size={18} className='ms-2 animate-spin duration-1000 transition-all' /> : <FileText size={18} className='ms-2' />}
                        </button>
                    </div>


                </form>

            </div>


        </>


    )


}
