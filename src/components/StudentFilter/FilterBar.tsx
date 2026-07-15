import { SearchIcon } from "lucide-react"
import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Selecet from 'react-select';
import { AllLocations } from "../../Hooks/Utlis";
import { useStudentSearch } from "../../Context/StudentFilterContext";
import { AllSearchCategory } from "../../Hooks/Utlis";
import { useAuth } from "@/Context/AuthContext";
import toast from "react-hot-toast";


// form inputs
interface Inputs {

    category: string
    location: string
    salary_type: string
}


// types
interface Option {
    value: string;
    label: string;
}



// Compensation Types
const compensationTypes: Option[] = [

    { label: "Hourly Gigs", value: "Hourly Gigs" },
    { label: "Daily Gigs", value: "Daily Gigs" },
    { label: "Weekend Gigs", value: "Weekend Gigs" },
    { label: "Vacation Gigs", value: "Vacation Gigs" },
    { label: "Project Based", value: "project" },
];




const SelectedStyles = {

    control: (provided: any, state: any) => ({
        ...provided,
        border: "none",
        borderRadius: "8px",
        backgroundColor: "white",
        padding: "2px 4px",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(16, 185, 129, 0.2)" : "none",
        transition: "all 0.2s ease",
        width: "100%",
        minWidth: "250px",
        maxWidth: "600px",
        "&:hover": {
            backgroundColor: "white",
            boxShadow: "0 0 0 1px rgba(16, 185, 129, 0.15)",
        },
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: "6px 12px",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#9ca3af",
        fontSize: "0.95rem",
    }),
    input: (provided: any) => ({
        ...provided,
        margin: "0",
        padding: "0",
        color: "#374151",
    }),
    menu: (provided: any) => ({
        ...provided,
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        width: "100%",
        minWidth: "330px",
        maxWidth: "700px",
        overflow: "hidden",
        marginTop: "8px",
        zIndex: 10,
        backgroundColor: "white",
    }),
    menuList: (provided: any) => ({
        ...provided,
        padding: "6px",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? "#10b981"
            : state.isFocused
                ? "#ecfdf5"
                : "transparent",
        color: state.isSelected ? "white" : "#374151",
        borderRadius: "6px",
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:active": {
            backgroundColor: "#059669",
        }
    }),
    dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        color: state.isFocused ? "#10b981" : "#9ca3af",
        padding: "0 8px",
        "&:hover": {
            color: "#10b981",
        }
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        color: "#9ca3af",
        padding: "0 8px",
        "&:hover": {
            color: "#ef4444",
        }
    }),
    loadingIndicator: (provided: any) => ({
        ...provided,
        color: "#10b981",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "#374151",
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "#ecfdf5",
        borderRadius: "4px",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: "#065f46",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: "#059669",
        "&:hover": {
            backgroundColor: "#d1fae5",
            color: "#ef4444",
        },
    }),

}


export default function FilterBar() {




    // Auth Context
    const { isAuthenticated, setLoginModalOpen } = useAuth()


    // Search keyword for loaction
    const [Search, setSearch] = useState<string>("")


    // Job serach context
    const { updateSearchParams } = useStudentSearch();


    // Get Job Category
    const { data, isLoading, isFetching } = AllSearchCategory()


    // Form State
    const { handleSubmit, control, } = useForm<Inputs>();



    // Get All Locations
    const { data: Location, isLoading: LocationLoading } = AllLocations(Search)



    // On Submit
    const Onsubmit = (data: Inputs) => {

        if (!isAuthenticated) {

            toast.error("Please Login to Search");

            setLoginModalOpen(true);

            return

        }

        updateSearchParams({
            category: data.category,
            location: data.location,
            salary_type: data.salary_type
        })

    }


    return (

        <>

            {/* Filter section */}
            <div className="w-full max-w-7xl mx-auto p-2 sm:-mt-20 -mt-24">


                <form onSubmit={handleSubmit(Onsubmit)}>


                    <div className="flex flex-col md:flex-row bg-white rounded-lg sm:shadow-lg shadow-xl border sm:border-gray-50 border-gray-300 px-2 py-3 sm:py-0 sm:px-0">


                        {/* Keywords Input */}
                        <div className="flex-1 flex items-center gap-2 p-5 border-b md:border-b-0 md:border-r border-gray-200">

                            {/* <Briefcase className="text-emerald-500" size={26} /> */}

                            <div className="w-full">
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Select
                                            ref={ref}
                                            options={data}
                                            value={data?.find((option: Option) => option.value === value) || null}
                                            onChange={(option: any) => onChange(option ? option.value : null)}
                                            placeholder="Search a Category or Job Title..."
                                            isSearchable={true}
                                            isClearable={true}
                                            isLoading={isLoading || isFetching}
                                            noOptionsMessage={() => "No options Found..."}
                                            classNamePrefix="select"
                                            styles={SelectedStyles}
                                        />

                                    )}
                                />

                            </div>

                        </div>


                        {/* Location Dropdown */}
                        <div className="flex-1 flex items-center gap-2 p-5 border-b md:border-b-0 md:border-r border-gray-200">

                            {/* <MapPin className="text-emerald-500" size={26} /> */}

                            <div className="w-full">

                                <div className="mt-2">
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field: { onChange, value, ref } }) => (
                                            <Select
                                                ref={ref}
                                                options={Location}
                                                onInputChange={(value) => setSearch(value)}
                                                value={value ? Location?.find((option: Option) => option?.label === value) : null}
                                                isSearchable={true}
                                                isClearable={true}
                                                className="basic-single"
                                                onChange={(option: any) => { onChange(option?.label) }}
                                                placeholder="Search a City...."
                                                classNamePrefix="select"
                                                noOptionsMessage={() => "No Locations Found..."}
                                                isLoading={LocationLoading}
                                                styles={SelectedStyles}
                                            />
                                        )}
                                    />
                                </div>

                            </div>

                        </div>


                        {/* Category Dropdown */}
                        <div className="flex-1 flex items-center gap-2 p-5 border-b md:border-b-0 md:border-r border-gray-200">

                            {/* <Calendar className="text-emerald-500" size={18} /> */}

                            {/* Availability */}
                            <div className="w-full">

                                <div>
                                    <Controller
                                        name="salary_type"
                                        control={control}
                                        render={({ field: { onChange, value, ref } }) => (
                                            <Selecet
                                                ref={ref}
                                                options={compensationTypes}
                                                value={value ? compensationTypes?.find((option) => option?.value === value) : null}
                                                onChange={(option) => { onChange(option?.value) }}
                                                placeholder={"Select Your Salary Type..."}
                                                isSearchable={false}
                                                className="basic-single"
                                                isClearable={true}
                                                classNamePrefix="select"
                                                styles={SelectedStyles}

                                            />
                                        )}
                                    />
                                </div>

                            </div>
                        </div>


                        {/* Search Button */}
                        <button type='submit' className="bg-emerald-500 hover:cursor-pointer text-white px-8 py-3 rounded-lg sm:rounded-r-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                            <SearchIcon size={20} />
                            <span>Search</span>
                        </button>

                    </div>

                </form>

            </div>

        </>


    )
}
