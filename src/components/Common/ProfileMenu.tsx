import { Link } from "react-router-dom";
import { Popover } from "@headlessui/react";
import { User, Crown, KeyRound, LogOut, LayoutDashboard, Gauge } from "lucide-react";
import InitialAvatar from "./InitialAvatar";



interface ProfileMenuProps {
    LoginStatus: boolean;
    HandleLogOut: () => void;
    data: { employer?: { logo?: string | null; username?: string | null; company_name?: string | null } };
    color?: boolean;
    setLoginModalOpen: (open: boolean) => void;
}



const ProfileMenu: React.FC<ProfileMenuProps> = ({ LoginStatus, HandleLogOut, data, color, setLoginModalOpen }) => {



    return (

        <>
            <Popover className="relative">
                {({ }) => (
                    <>
                        <Popover.Button
                            className={`cursor-pointer flex items-center gap-x-1 text-sm font-semibold text-gray-400 ${color ? "text-white" : ""}`}
                        >
                            <InitialAvatar
                                imageUrl={data?.employer?.logo}
                                username={data?.employer?.username}
                                name={data?.employer?.company_name}
                                alt="User profile"
                                className="h-[30px] w-[30px] border border-white/70 shadow-md"
                                textClassName="text-sm"
                            />
                        </Popover.Button>

                        <Popover.Panel
                            className="absolute -left-32 top-9 z-10 mt-3 w-52 dropdown rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
                        >
                            <PopoverContent LoginStatus={LoginStatus} HandleLogOut={HandleLogOut} setLoginModalOpen={setLoginModalOpen} />
                        </Popover.Panel>
                    </>
                )}
            </Popover>


        </>
    );

};


interface PopoverContentProps {
    LoginStatus: boolean;
    HandleLogOut: () => void;
    setLoginModalOpen: (open: boolean) => void;
}   


const PopoverContent: React.FC<PopoverContentProps> = ({ LoginStatus, HandleLogOut, setLoginModalOpen }) => (

    <div className="p-4">
        <MenuItem link="/employerprofile" icon={<User size={20} />} text="Profile" />
        <MenuItem link="/plans" icon={<Crown size={20} />} text="Premium" />
        <MenuItem link="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" />
        <MenuItem link="/planusage" icon={<Gauge size={20} />} text="Plan Usage" />

        {!LoginStatus ? (
            <Popover.Button as="button" onClick={() => setLoginModalOpen(true)} className="w-full hover:cursor-pointer text-left flex font-semibold items-center gap-2 text-sm text-gray-900 hover:bg-gray-50 p-4 rounded-lg" ><KeyRound size={20} /> Login </Popover.Button>
        ) : (
            <MenuItemLogout icon={<LogOut size={20} />} text="Logout" HandleLogOut={HandleLogOut} />
        )}
    </div>

);


interface MenuItemProps {
    link: string;
    icon: JSX.Element;
    text: string;
}



const MenuItem: React.FC<MenuItemProps> = ({ link, icon, text }) => (

    <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50">
        <div className="flex-auto">
            <Popover.Button as={Link} to={link} className="font-semibold text-gray-900 flex items-center">
                {icon}
                <span className="ml-2">{text}</span>
            </Popover.Button>
        </div>
    </div>

);



interface MenuItemLogoutProps {
    icon: JSX.Element;
    text: string;
    HandleLogOut: () => void;
}



const MenuItemLogout: React.FC<MenuItemLogoutProps> = ({ icon, text, HandleLogOut }) => (

    <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50">
        <div className="flex-auto">
            <Popover.Button
                as="p"
                className="font-semibold text-gray-900 flex items-center cursor-pointer"
                onClick={HandleLogOut}
            >
                {icon}
                <span className="ml-2">{text}</span>
            </Popover.Button>
        </div>
    </div>

);

export default ProfileMenu;
