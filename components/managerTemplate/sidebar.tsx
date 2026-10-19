'use client';
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import MenuItem from "./menuItem";
import { removeCookie, GetCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/types";
import { BASE_IMAGE_PROFILE } from "@/global";

type MenuType = {
  id: string,
  icon: ReactNode,
  path: string,
  label: string
};

type CashierProp = {
  children: ReactNode,
  id: string,
  user: IUser | null,
  title: string,
  menuList: MenuType[]
};

const Sidebar = ({ children, id, title, menuList, user }: CashierProp) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const name = GetCookie("name"); // Ambil nama pengguna dari cookie
    if (name) {
      setUserName(name); // Setel nama pengguna ke state
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("id");
    removeCookie("name");
    removeCookie("role");
    router.replace(`/login`);
  };

  return (
    <div className="w-full min-h-dvh bg-white">
      {/* header section */}
      <header className="flex justify-between items-center p-4 mb-0 bg-yellow-500 border-b border-primary">
        <div className="flex gap-2 ">
          <button onClick={() => setIsShow(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black bg-yellow-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m16.5 4.5h16.5" />
            </svg>
          </button>
          <h1 className="font-bold text-xl text-black">
            {title}
          </h1>
        </div>

        <div className="relative">
          <button onClick={toggleDropdown} className="flex itemscenter space-x-2 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25 2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span className="font-bold">Logout</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-10 top-full">
              <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black">Settings</a>
              <a onClick={handleLogout} className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black">Logout</a>
            </div>
          )}
        </div>
      </header>
      {/* end header section */}
      {/* content section */}
      <div className="p-4">
        {children}
      </div>
      {/* end content section */}
      {/* sidebar section */}
      <div className={`backdrop-blur-md flex flex-col w-2/3 md:w-1/3 lg:w-1/5 h-full fixed top-0 right-full transition-transform z-50 bg-gray-100 border-r border-primary rounded-r-[20px] bg-opacity-60 ${isShow ? `translate-x-full sidebar-glow` : ``}`}>
        {/* close button */}
        <div className="ml-auto p-2">
          <button onClick={() => setIsShow(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1- 18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>
        {/* end close button */}

        {/* logo section */}
        <div className="mb-3 w-full flex justify-center ">
          <div className="flex items-center space-x-2">
            <Image 
  src="/image/LEGO_logo.svg.png" 
  alt="Logo" 
  width={40} 
  height={40} 
  className="rounded-full" 
/>
            <h1 className="text-2xl font-bold text-gray-800">Restaurant lama saji</h1>
          </div>
        </div>
        {/* end logo section */}

        {/* user section */}
        <div className="w-full mt-10 mb-6 bg-primary text-black p-3 flex gap-2 items-center ">
          {user?.profile_picture ? (
            <Image src={`${BASE_IMAGE_PROFILE}/${user?.profile_picture}`} alt="Profile" width={40} height={40} className="rounded-full" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          )}
          <div className="text-sm font-semibold">
            {userName}
          </div>
        </div>
        {/* end user section */}

        {/* menu section */}
        <div className="w-full p-2 overflow-y-auto">
          <div className="px-5">
            {menuList.map((menu, index) => (
              <MenuItem icon={menu.icon} label={menu.label} path={menu.path} active={menu.id === id} key={`keyMenu${index}`} />
            ))}
          </div>
        </div>
        {/* menu section */}
      </div>
      {/* end sidebar section */}
    </div>
  )
}
export default Sidebar;