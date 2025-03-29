"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="grid-rows-[60px_1fr] border-r border-r--gray-300 hidden lg:grid p-2">
      <div className="text-2xl font-extrabold text-[#008080] px-4">Ritease</div>
      <div>
        <ul>
          <SidebarItem name={"Home"} active={pathname === "/"} link={"/"} />
          <SidebarItem
            name={"Upload"}
            active={pathname === "/upload"}
            link={"/upload"}
          />
          <SidebarItem
            name={"PDF"}
            active={pathname === "/pdf"}
            link={"/pdf"}
          />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarItem = ({
  name,
  link,
  active,
}: {
  name: string;
  active: boolean;
  link: string;
}) => {
  return (
    <li className="py-2 border-b border-b-gray-300">
      <Link
        className={`flex gap-4 items-center ${
          active ? "text-[#008080]" : "dark:text-white text-[#333]"
        }`}
        href={link}
      >
        <div
          className={`h-2 w-2 rounded-full ${
            active ? "bg-[#008080]" : "dark:bg-white bg-[#333]"
          }`}
        ></div>
        <div>{name}</div>
      </Link>
    </li>
  );
};
