import { Link } from "react-router-dom";
import { Popover } from "@headlessui/react";
import { User, Crown, KeyRound, LogOut, LayoutDashboard, Gauge } from "lucide-react";

interface ProfileMenuProps {
    LoginStatus: boolean;
    HandleLogOut: () => void;
    data : { employer?: { logo?: string } };
    color?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ LoginStatus, HandleLogOut, data, color }) => {

    return (
        <Popover className="relative">
            {({ }) => (
                <>
                    <Popover.Button
                        className={`cursor-pointer flex items-center gap-x-1 text-sm font-semibold text-gray-400 ${color ? "text-white" : ""}`}
                    >
                        <img
                            src={data?.employer?.logo ?? "/DeaflutProfile.jpeg"}
                            loading="lazy"
                            alt="User profile"
                            className="w-[30px] h-[30px] rounded-full object-cover"
                        />
                    </Popover.Button>

                    <Popover.Panel
                        className="absolute -left-32 top-9 z-10 mt-3 w-52 dropdown rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
                    >
                        <PopoverContent LoginStatus={LoginStatus} HandleLogOut={HandleLogOut} />
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );

};


interface PopoverContentProps {
    LoginStatus: boolean;
    HandleLogOut: () => void;
}


const PopoverContent: React.FC<PopoverContentProps> = ({ LoginStatus, HandleLogOut }) => (

    <div className="p-4">
        <MenuItem link="/employerprofile" icon={<User size={20} />} text="Profile" />
        <MenuItem link="/plans" icon={<Crown size={20} />} text="Premium" />
        <MenuItem link="/dashboard" icon={<LayoutDashboard  size={20} />} text="Dashboard" />
        <MenuItem link="/planusage" icon={<Gauge size={20} />} text="Plan Usage" />

        {!LoginStatus ? (
            <MenuItem link="/auth" icon={<KeyRound size={20} />} text="Login" />
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