import React, { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Trash2, CheckCircle } from 'lucide-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Country, State } from 'country-state-city';
import Select from "react-select";
import Flag from 'react-world-flags';
import { AddProfile, GetProfile } from '../../Hooks/UserProfile';
import toast from 'react-hot-toast';
import InitialAvatar from './InitialAvatar';


// modal props
interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string
}



// Form Inputs types
interface FormInputs {
    company_name: string;
    company_info: string;
    email: string;
    phone_number: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    logo?: string | File | null;
}



// country option types
interface CountryOption {
    value: string;
    label: string;
    flag: string;
}



// state option types
interface StateOption {
    value: string;
    label: string;
    stateCode: string;
    latitude: string;
    longitude: string;
}



const ModernProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, title }) => {



    // Add Profile
    const { mutate: AddUserProfile } = AddProfile();



    // Get Profile
    const { data, isLoading, isFetching, isError } = GetProfile()



    // Img Preview State
    const [logoPreview, setLogoPreview] = useState<string | null>(null)



    // Edit id state
    const [ID, SetId] = useState('')



    // Country and City
    const [countries, setCountries] = useState<CountryOption[]>([]);

    const [state, setState] = useState<StateOption[]>([]);

    const [SelectedState, setSelectedState] = useState<StateOption[]>([]);

    const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);




    // Form State
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        setError,
        clearErrors,
        control
    } = useForm<FormInputs>();




    // Set default values
    useEffect(() => {

        if (isOpen && data) {

            const selectedUser = data?.employer

            setSelectedCountry(selectedUser?.country ?? null);

            reset(selectedUser)

            SetId(selectedUser?.id ?? '')

            setLogoPreview(selectedUser?.logo || null)
            clearErrors('logo')

        }

    }, [clearErrors, data, isOpen, reset]);




    // Load countries on mount
    useEffect(() => {

        const allCountries = Country.getAllCountries();

        const formattedCountries: CountryOption[] = allCountries.map(country => ({
            value: country.isoCode,
            label: country.name,
            flag: country.isoCode
        }));

        formattedCountries.sort((a, b) => a.label.localeCompare(b.label));

        setCountries(formattedCountries);

    }, [])




    // Load State based on selected country
    useEffect(() => {

        if (selectedCountry) {

            const countryStates = State.getStatesOfCountry(selectedCountry.value) || [];

            const formattedStates: StateOption[] = countryStates.map(state => ({
                value: state.name,
                label: state.name,
                stateCode: state.isoCode,
                latitude: state?.latitude ?? '',
                longitude: state?.longitude ?? ''
            }));

            formattedStates.sort((a, b) => a.label.localeCompare(b.label));

            setState(formattedStates);

        } else {
            setState([]);
        }
    }, [selectedCountry])




    // handle CountryChange
    const handleCountryChange = (selectedOption: any, onChange: any) => {

        setSelectedCountry(selectedOption);

        onChange(selectedOption);

    }




    // Handle logo change
    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setValue('logo', file);
                clearErrors('logo');

            };
            reader.readAsDataURL(file);
        }
    };




    // Submit Form
    const onFormSubmit: SubmitHandler<FormInputs> = (data) => {

        if (!logoPreview && !(data.logo instanceof File)) {
            setError('logo', { type: 'required', message: 'Company logo is required' });
            toast.error("Company logo is required");
            return;
        }

        const formdata = new FormData()

        formdata.append("company_name", data.company_name)
        formdata.append("company_info", data.company_info)
        formdata.append("email", data.email)
        formdata.append("phone_number", data.phone_number)
        formdata.append("street_address", data.street_address)
        formdata.append("city", data.city)
        formdata.append("state", data.state)
        formdata.append("postal_code", data.postal_code)
        formdata.append("country", JSON.stringify(data.country))
        data.logo instanceof File && formdata.append("logo", data.logo);



        AddUserProfile({ formData: formdata, id: ID }, {

            onSuccess: (res) => {

                if (res.status >= 200 && res.status <= 300) {

                    toast.success("Profile Updated successfully")
                    onClose()
                    reset()
                }
                else {

                    toast.error("Something went wrong. Please try again.")
                    console.log(res);

                }
            },
            onError: (error) => {
                toast.error("An error occurred: " + error.message);
            }

        })


    };


    if (!isOpen) return null;




    return (



        <AnimatePresence>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-1000 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm"
            >


                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="w-full sm:max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                >



                    {

                        isLoading || isFetching || isError ?

                            // Loader
                            <div className="p-8 max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl">

                                {/* Header */}

                                <div className='flex justify-between items-center'>

                                    <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded-md mb-6"></div>

                                    <motion.button
                                        type="button"
                                        whileHover={{ rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={26} />
                                    </motion.button>


                                </div>



                                {/* Form Fields */}
                                <div className="space-y-6">
                                    {/* Logo Upload Section */}
                                    <div className="flex justify-center">
                                        <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>

                                    {/* Input Fields */}
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
                                    ))}

                                    {/* Grid Fields */}
                                    <div className="grid grid-cols-2 gap-6">
                                        {[...Array(2)].map((_, i) => (
                                            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Buttons */}
                                <div className="mt-6 flex justify-end space-x-4">
                                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                                    <div className="h-10 w-32 bg-gray-300 animate-pulse rounded-md"></div>
                                </div>
                            </div>


                            :


                            <div>


                                <form onSubmit={handleSubmit(onFormSubmit)}>


                                    {/* Header */}
                                    <div className="px-8 py-6 border-b border-gray-100">


                                        <div className="flex items-center justify-between">


                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {title}
                                            </h2>


                                            <motion.button
                                                type="button"
                                                whileHover={{ rotate: 90 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={onClose}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                            >
                                                <X size={20} />
                                            </motion.button>


                                        </div>


                                    </div>



                                    {/* Content */}
                                    <div className="sm:px-8 px-4 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">


                                        <div className="space-y-8">


                                            {/* Logo Upload Section */}
                                            <div className="flex flex-col items-center space-y-4">


                                                <div className="relative group">

                                                    {logoPreview ? (

                                                        <div className="relative">

                                                            <motion.img
                                                                initial={{ scale: 0.8, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                src={logoPreview}
                                                                alt="Company logo"
                                                                loading='lazy'
                                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                                            />

                                                            <motion.button
                                                                type="button"
                                                                whileHover={{ scale: 1.1 }}
                                                                onClick={() => {
                                                                    setLogoPreview(null);
                                                                    setValue('logo', null);
                                                                    setError('logo', { type: 'required', message: 'Company logo is required' });
                                                                }}
                                                                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                                                            >
                                                                <Trash2 size={16} />
                                                            </motion.button>

                                                        </div>

                                                    ) : (
                                                        <label className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full transition-all group">
                                                            <InitialAvatar
                                                                username={data?.employer?.username}
                                                                name={data?.employer?.company_name}
                                                                alt="Company avatar"
                                                                className="h-32 w-32 border-4 border-white shadow-xl ring-4 ring-emerald-100 transition-transform duration-300 group-hover:scale-105 group-hover:ring-blue-100"
                                                                textClassName="text-5xl"
                                                            />
                                                            <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-md ring-1 ring-emerald-100 transition-colors group-hover:text-blue-700 group-hover:ring-blue-100">
                                                                <Camera className="h-3.5 w-3.5" />
                                                                Upload *
                                                            </span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                {...register('logo')}
                                                                onChange={handleLogoChange}
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                    )}

                                                </div>
                                                {errors.logo && (
                                                    <p className="text-sm font-medium text-red-500">{errors.logo.message}</p>
                                                )}

                                            </div>




                                            {/* Form Fields */}
                                            <div className="space-y-6">

                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">


                                                    {/* Company Name */}
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Company Name
                                                            {errors.company_name && (
                                                                <span className="text-red-500 ml-2 text-xs">Required</span>
                                                            )}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            {...register('company_name', { required: true })}
                                                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.company_name ? 'border-red-500' : 'border-gray-200'
                                                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                            placeholder="Enter company name"
                                                        />
                                                    </div>


                                                    {/* Email */}
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Email
                                                            {errors.email && (
                                                                <span className="text-red-500 ml-2 text-xs">Valid email required</span>
                                                            )}
                                                        </label>
                                                        <input
                                                            type="email"
                                                            {...register('email', {
                                                                required: true,
                                                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                                            })}
                                                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'
                                                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                            placeholder="company@example.com"
                                                        />
                                                    </div>

                                                </div>


                                                {/* Company Info */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Company Info

                                                    </label>
                                                    <textarea
                                                        {...register('company_info')}
                                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.company_info ? 'border-red-500' : 'border-gray-200'
                                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                        rows={4}
                                                        placeholder="Tell us about your company..."
                                                    />
                                                </div>



                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                                    {/* Phone Number */}
                                                    <div className="space-y-2">

                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Phone
                                                            {errors.phone_number && (
                                                                <span className="text-red-500 ml-2 text-xs">Valid phone required</span>
                                                            )}
                                                        </label>

                                                        <Controller
                                                            name="phone_number"
                                                            control={control}
                                                            rules={{
                                                                maxLength: {
                                                                    value: 13,
                                                                    message: "Phone number cannot exceed 10 digits"
                                                                },
                                                                required: true
                                                            }}
                                                            render={({ field: { onChange, value } }) => (
                                                                <PhoneInput
                                                                    international
                                                                    defaultCountry="IN"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.phone_number ? 'border-red-500' : 'border-gray-200'
                                                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                                    placeholder="Phone"
                                                                />
                                                            )}
                                                        />

                                                    </div>


                                                    {/* Street */}
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Street
                                                            {errors.street_address && (
                                                                <span className="text-red-500 ml-2 text-xs">Valid street required</span>
                                                            )}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            {...register('street_address', { required: true })}
                                                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.street_address ? 'border-red-500' : 'border-gray-200'
                                                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                            placeholder="Enter street address"
                                                        />
                                                    </div>


                                                </div>



                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                                                    {/* Country */}
                                                    <div className="sm:col-span-full">


                                                        <label
                                                            htmlFor="country"
                                                            className="block text-sm/6 font-medium text-gray-900"
                                                        >
                                                            Country
                                                            {errors.country && (
                                                                <span className="text-red-500 ml-2 text-xs">Valid country required</span>
                                                            )}

                                                        </label>


                                                        <div className="mt-2">
                                                            <Controller
                                                                name="country"
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field: { onChange, value, ref } }) => (
                                                                    <Select
                                                                        ref={ref}
                                                                        options={countries}
                                                                        value={countries.find(country => country.label === value) || selectedCountry || null}
                                                                        onChange={(option) => handleCountryChange(option, onChange)}
                                                                        placeholder="Select a country..."
                                                                        isSearchable={true}
                                                                        className={`w-full bg-gray-50 border ${errors.country ? 'border-red-500' : 'border-gray-200'
                                                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                                        classNamePrefix="select"
                                                                        formatOptionLabel={(option: CountryOption) => (
                                                                            <div className="flex items-center">
                                                                                <Flag code={option.flag} style={{ width: 20, height: 15, marginRight: 10 }} />
                                                                                {option.label}
                                                                            </div>
                                                                        )}

                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>




                                                    {/* State */}
                                                    <div className="col-span-full">

                                                        <label
                                                            htmlFor="city-area"
                                                            className="block text-sm/6 font-medium text-gray-900"
                                                        >
                                                            State
                                                            {errors.state && (
                                                                <span className="text-red-500 ml-2 text-xs">Valid state required</span>
                                                            )}

                                                        </label>

                                                        <div className="mt-2">
                                                            <Controller
                                                                name="state"
                                                                rules={{ required: true }}
                                                                control={control}
                                                                render={({ field: { onChange, value, ref } }) => (
                                                                    <Select
                                                                        ref={ref}
                                                                        options={state}
                                                                        value={state.find(state => state.value === value) || SelectedState || null}
                                                                        onChange={(option: any) => { setSelectedState(option), onChange(option.value) }}
                                                                        placeholder={selectedCountry && Object.keys(selectedCountry).length > 0 ? "Select a State..." : "First select a country"}
                                                                        isSearchable={true}
                                                                        isDisabled={!selectedCountry || Object.keys(selectedCountry).length === 0}
                                                                        className={`w-full bg-gray-50 border ${errors.state ? 'border-red-500' : 'border-gray-200'
                                                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                                        classNamePrefix="select"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>


                                                </div>



                                                {/* city and postal code */}
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                                    {[
                                                        { name: 'city', label: 'City' },
                                                        { name: 'postal_code', label: 'Postal Code' },
                                                    ].map((field) => (
                                                        <div key={field.name} className="space-y-2">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {field.label}
                                                                {errors[field.name as keyof FormInputs] && (
                                                                    <span className="text-red-500 ml-2 text-xs">Required</span>
                                                                )}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                {...register(field.name as keyof FormInputs, { required: true })}
                                                                className={`w-full px-4 py-3 bg-gray-50 border ${errors[field.name as keyof FormInputs] ? 'border-red-500' : 'border-gray-200'
                                                                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                                                                placeholder={field.label}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>


                                            </div>

                                        </div>


                                    </div>

                                    {/* Footer */}
                                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                                        <div className="flex justify-end space-x-4">
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={onClose}
                                                className="px-6 hover:cursor-pointer py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={isSubmitting}
                                                className="px-6 py-2.5 hover:cursor-pointer text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin">↻</span>
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className='flex items-center justify-between gap-1'>Save <CheckCircle size={16} className='mt-1' /> </span>

                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                    }

                </motion.div>

            </motion.div>



        </AnimatePresence>
    );
};

export default ModernProfileModal;
