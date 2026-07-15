import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { motion } from "framer-motion";
import { X, GraduationCap, Briefcase } from "lucide-react";


interface LoginModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}


export default function LoginModal({ isOpen, setIsOpen }: LoginModalProps) {

    const location = useLocation();
    const shouldKeepCurrentRoute = !["/", "/auth", "/findtalent", "/findtalent/"].includes(location.pathname);
    const authLinkState = shouldKeepCurrentRoute ? { from: location } : undefined;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 90, damping: 15, delay: 0.08 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.25, staggerChildren: 0.1 }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="p-0 w-[92vw] sm:max-w-3xl md:max-w-4xl overflow-hidden rounded-2xl bg-transparent border-0 ring-0 shadow-2xl"
            >
                {/* Close Button */}
                <DialogClose className="absolute right-3 top-3 hover:cursor-pointer z-50 rounded-full bg-black/50 p-1.5 backdrop-blur-md border border-white/10 hover:bg-black/70 transition-all group">
                    <X className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                    <span className="sr-only">Close</span>
                </DialogClose>

                {/* Grid: stacked on mobile, side-by-side on md+ */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >

                    {/* ── Card 1: Employer / Hire Employee ── */}
                    <motion.div
                        className="relative overflow-hidden group cursor-pointer flex flex-col justify-between
                                   h-[52vw] min-h-[220px] max-h-[340px]
                                   md:h-auto md:min-h-[480px] md:max-h-none
                                   p-5 sm:p-8 md:p-10
                                   rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Background */}
                        <div className="absolute inset-0 z-0">
                            <motion.img
                                src="/employers.jpg"
                                alt="Employers"
                                loading="lazy"
                                className="w-full h-full object-cover brightness-[0.60]"
                                whileHover={{ scale: 1.07 }}
                                transition={{ duration: 0.7 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/95 via-orange-900/40 to-black/40 z-10" />
                        </div>

                        {/* Badge top-left */}
                        <div className="relative z-20">
                            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-full backdrop-blur-sm">
                                RECRUITER
                            </span>
                        </div>

                        {/* Content bottom */}
                        <motion.div
                            className="relative z-20 text-white"
                            variants={cardVariants}
                        >
                            {/* Icon */}
                            <div className="inline-flex p-1.5 sm:p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400 backdrop-blur-sm mb-2 sm:mb-3">
                                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                            </div>

                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight mb-1 sm:mb-2 group-hover:text-orange-300 transition-colors">
                                Hire Candidates
                            </h2>

                            {/* Description — hidden on small mobile, shown sm+ */}
                            <p className="hidden sm:block text-xs sm:text-sm text-gray-300 max-w-xs leading-relaxed mb-3">
                                Students • Freshers • Experienced Professionals
                            </p>

                            <Link to={'/auth'} state={authLinkState} onClick={() => setIsOpen(false)} className="inline-block">
                                <motion.button
                                    className="mt-1 px-4 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold hover:cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-lg border border-orange-400/20 transition-all duration-300"
                                    whileHover={{ scale: 1.04, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>


                    {/* ── Card 2: Student / I Want a Job ── */}
                    <motion.div
                        className="relative overflow-hidden group cursor-pointer flex flex-col justify-between
                                   h-[52vw] min-h-[220px] max-h-[340px]
                                   md:h-auto md:min-h-[480px] md:max-h-none
                                   p-5 sm:p-8 md:p-10
                                   rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none
                                   border-t border-white/5 md:border-t-0 md:border-l border-white/10"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Background */}
                        <div className="absolute inset-0 z-0">
                            <motion.img
                                src="/employe-modal.webp"
                                alt="Students"
                                loading="lazy"
                                className="w-full h-full object-cover brightness-[0.60]"
                                whileHover={{ scale: 1.07 }}
                                transition={{ duration: 0.7 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-900/40 to-black/40 z-10" />
                        </div>

                        {/* Badge top-left */}
                        <div className="relative z-20">
                            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                                CANDIDATE
                            </span>
                        </div>

                        {/* Content bottom */}
                        <motion.div
                            className="relative z-20 text-white"
                            variants={cardVariants}
                        >
                            {/* Icon */}
                            <div className="inline-flex p-1.5 sm:p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 backdrop-blur-sm mb-2 sm:mb-3">
                                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                            </div>

                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight mb-1 sm:mb-2 group-hover:text-emerald-300 transition-colors">
                                Find Opportunities
                            </h2>

                            {/* Description — hidden on small mobile, shown sm+ */}
                            <p className="hidden sm:block text-xs sm:text-sm text-gray-300 max-w-xs leading-relaxed mb-3">
                                Jobs • Gigs • Internships
                            </p>

                            <a href="https://studentsgigs.com/auth" onClick={() => setIsOpen(false)} className="inline-block">
                                <motion.button
                                    className="mt-1 px-4 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold hover:cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg border border-emerald-400/20 transition-all duration-300"
                                    whileHover={{ scale: 1.04, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Get Started
                                </motion.button>
                            </a>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
