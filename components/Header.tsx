"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-between items-center h-full px-4 lg:px-8">
      <div className="flex gap-2">
        <p className="lg:text-2xl font-semibold">Simple PDF editor</p>
      </div>
      <p className="text-sm hidden lg:block">
        Submitted by Alaede Increase-Chris
      </p>
      <div className="lg:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <div className="lg:hidden border">
              <svg
                className="w-6 h-6 fill-current text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-full max-w-screen-sm p-2 flex flex-col gap-1 rounded mr-12 bg-[#FAFAFA] dark:bg-[#333]"
            align={"end"}
          >
            <div
              className="header-dropdown"
              onClick={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              <p className="label-large">Home</p>
            </div>
            <div
              className="header-dropdown"
              onClick={() => {
                router.push("/list");
                setOpen(false);
              }}
            >
              <p className="label-large">View list</p>
            </div>
            <div
              className="header-dropdown"
              onClick={() => {
                router.push("/pdf");
                setOpen(false);
              }}
            >
              <p className="label-large">PDF</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
