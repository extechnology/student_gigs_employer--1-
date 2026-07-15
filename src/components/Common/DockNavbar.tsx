import { Link, useLocation } from "react-router-dom";
import { House, Search, LayoutDashboard, User, Menu, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { GetProfile } from "../../Hooks/UserProfile";
import InitialAvatar from "./InitialAvatar";
import ProtectedPostJobButton from "./ProtectedPostJobButton";

export default function DockNavbar() {
  const location = useLocation();

  // Get employer profile data
  const { data } = GetProfile();

  const currentPath = location.pathname;

  // Active states
  const isHomeActive = currentPath === "/";
  const isSearchActive =
    currentPath === "/findtalent" || currentPath.startsWith("/studentprofile");
  const isDashboardActive = currentPath === "/dashboard";
  const isProfileActive =
    currentPath === "/employerprofile" ||
    currentPath === "/userprofile" ||
    currentPath === "/plans" ||
    currentPath === "/planusage";

  const handleMenuClick = () => {
    document.dispatchEvent(new CustomEvent("open-mobile-menu"));
  };

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: House,
      isActive: isHomeActive,
    },
    {
      label: "Search",
      path: "/findtalent",
      icon: Search,
      isActive: isSearchActive,
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      isActive: isDashboardActive,
    },
    {
      label: "Profile",
      path: "/employerprofile",
      icon: User,
      isActive: isProfileActive,
      isProfile: true,
    },
  ];

  return (
    <>
      {/* Bottom Dock — mobile only */}
      <motion.div
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 left-1/2 z-50 lg:hidden flex flex-col items-center gap-2"
        style={{ width: "min(92vw, 480px)" }}
      >
        {/* CTA Buttons Row — Hire Students + Post Job */}
        <div className="flex items-center justify-center gap-2 w-full px-1">
          {/* Hire Students */}
          <Link
            to="/findtalent"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#eb8125] text-white text-xs font-bold py-2 px-1 rounded-full shadow-lg shadow-orange-300/40 active:scale-95 transition-transform"
          >
            <GraduationCap size={14} />
            Hire Students
          </Link>

          {/* Post Job — uses existing protected route HOC */}
          <div className="flex-1 [&_button]:!w-full [&_button]:!rounded-full [&_button]:!py-2 [&_button]:!px-3 [&_button]:!text-xs [&_button]:!font-bold [&_button]:!shadow-lg [&_button]:!flex [&_button]:!items-center [&_button]:!justify-center [&_button]:!gap-1.5 [&_div]:!w-full [&_div]:!flex [&_div]:!justify-center">
            <ProtectedPostJobButton />
          </div>
        </div>

        {/* Main Dock Pill */}
        <div className="flex items-center justify-around w-full h-[4.25rem] px-2 bg-white/85 backdrop-blur-xl border border-gray-200/60 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          {navItems.map((item) => {
            const IconComponent = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-transform active:scale-95"
              >
                {/* Animated active background */}
                {item.isActive && (
                  <motion.div
                    layoutId="employer-active-dock-pill"
                    className="absolute inset-0 bg-[#004673]/12 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{
                    scale: item.isActive ? 1.08 : 1,
                    y: item.isActive ? -1 : 0,
                  }}
                  className={`relative z-10 flex flex-col items-center justify-center gap-0.5 ${
                    item.isActive
                      ? "text-[#004673]"
                      : "text-gray-400 hover:text-[#004673]"
                  }`}
                >
                  {item.isProfile ? (
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        item.isActive
                          ? "ring-2 ring-[#004673]"
                          : "ring-1 ring-gray-300"
                      }`}
                    >
                      <InitialAvatar
                        imageUrl={data?.employer?.logo}
                        username={data?.employer?.username}
                        name={data?.employer?.company_name}
                        alt="Profile"
                        className="h-6 w-6 rounded-full object-cover"
                        textClassName="text-[10px]"
                      />
                    </div>
                  ) : (
                    <IconComponent
                      size={21}
                      strokeWidth={item.isActive ? 2.5 : 2}
                    />
                  )}
                  <span
                    className={`text-[9px] font-semibold tracking-wide leading-none ${
                      item.isActive ? "text-[#004673]" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* More button → triggers slide-in drawer */}
          <button
            onClick={handleMenuClick}
            className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full text-gray-400 hover:text-[#004673] active:scale-95 transition-transform"
          >
            <Menu size={21} strokeWidth={2} />
            <span className="text-[9px] font-semibold tracking-wide leading-none mt-0.5">
              More
            </span>
          </button>
        </div>
      </motion.div>

      {/* Bottom spacer so content isn't hidden behind dock */}
      <div className="h-36 lg:hidden" />
    </>
  );
}
