"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FileRecord } from "@/types";

export default function Home() {
  const [pdfs, setPdfs] = useState<FileRecord[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("pdfs") || "[]");
    setPdfs(storedFiles);
  }, []);

  const handleClick = (pdf: {
    file_name: string;
    file_type: string;
    file_url: string;
  }) => {
    localStorage.setItem("pdf", JSON.stringify(pdf)); // Set clicked file as active
    router.push("/pdf"); // Navigate to the PDF page
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Recently Uploaded PDFs</h1>
        <Button
          className={`w-fit dark:bg-white dark:text-[#333] bg-gray-500 text-white cursor-pointer`}
          onClick={() => {
            router.push("upload");
          }}
        >
          <PlusCircle className="h-6 w-6" />
          <p className="hidden lg:block">Click to upload a pdf</p>
        </Button>
      </div>
      {pdfs.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">File Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.slice(0, 4).map((pdf, index) => (
              <tr key={index} className="">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pdf.file_name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleClick(pdf)}
                    className="text-blue-500 hover:underline curosr-pointer"
                  >
                    View PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No PDFs uploaded yet.</p>
      )}
    </div>
  );
}
