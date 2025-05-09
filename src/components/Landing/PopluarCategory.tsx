import { Star } from "lucide-react";
import AnimatedContent from "./AnimatedContent/AnimatedContent";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { TrendingJobsList } from "@/Hooks/Utlis";

export default function PopluarCategory() {


    // Slide Types
    interface SlideTypes {
        id: number;
        title: string;
        image: string;
    }


    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: 2,
            slidesToSlide: 2,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };



    // Get Trending Jobs Data
    const { data, isLoading, isFetching, isError } = TrendingJobsList();


    
    return (




        <>



            <div className="px-2 md:px-32  py-28">

                <AnimatedContent
                    distance={150}
                    direction="vertical"
                    reverse={false}
                    config={{ tension: 80, friction: 20 }}
                    initialOpacity={0.2}
                    animateOpacity={true}
                    scale={1.1}
                    threshold={0.2}
                    delay={200}
                >

                    <h2 className=" text-3xl font-semibold mb-6 flex items-center justify-center sm:justify-start text-center"> Popluar Categories <Star color="#FFD700" className="ms-2 sm:mt-2 mt-0" size={30} /></h2>

                    <p className=" text-slate-500 mb-5 text-center sm:text-justify max-w-xl px-2 sm:px-0">
                        Explore hiring categories such as full-time roles, part-time & freelance work, internships & entry-level positions,
                        and remote & hybrid opportunities to find the right talent for your business.
                    </p>



                    <Carousel
                        responsive={responsive}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        swipeable={true}
                        focusOnSelect={true}
                        keyBoardControl={true}
                        transitionDuration={5000}
                        slidesToSlide={1}
                        containerClass="carousel-container"
                        removeArrowOnDeviceType={["tablet", "mobile"]}
                        dotListClass="custom-dot-list-style"
                        itemClass="carousel-item-padding-40-px "
                    >

                        {isLoading || isFetching || isError ?

                            (Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-lg mx-2 overflow-hidden shadow-lg animate-pulse bg-gray-200 h-60 sm:w-60 w-80"
                                    >
                                        <div className="absolute inset-0 bg-gray-200 flex items-end justify-center">
                                            <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-10"></div>
                                        </div>
                                    </div>

                                ))) : (

                                data?.map((service: SlideTypes, index: number) => (

                                    <div
                                        key={index}
                                        className="relative rounded-lg mx-2 overflow-hidden shadow-lg hover:scale-105 duration-300"
                                    >
                                        <img
                                            src={service?.image}
                                            alt={service?.title}
                                            className="w-full  h-auto object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40  flex items-end justify-center">
                                            <p className="text-white font-semibold text-md pb-10 hover:scale-105 duration-300">
                                                {service.title}
                                            </p>
                                        </div>
                                    </div>
                                ))

                            )
                        }

                    </Carousel>

                </AnimatedContent>

            </div >

        </>


    )


}
