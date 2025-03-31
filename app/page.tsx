"use client";
import { Button } from "@/components/ui/button";
import { Folder2 } from "iconsax-react";
import { useCallback, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FileRecord } from "@/types";

const Upload = () => {
  const [preview, setPreview] = useState<FileRecord>({
    file_url: "",
    file_name: "",
    file_type: "",
  });
  const router = useRouter();
  const onDrop = useCallback(
    (acceptedFiles: readonly FileWithPath[]) => {
      acceptedFiles.map((file) => {
        const files = new FileReader();
        files.onload = () => {
          if (typeof files.result === "string") {
            setPreview({
              ...preview,
              file_url: files.result,
              file_name: file.name,
              file_type: file.type,
            });
          } else {
            toast.error("Invalid file type");
          }
        };
        toast.success("upload successful");
        files.readAsDataURL(file);
      });
    },
    [preview]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach((file: FileRejection) => {
      const errorMessage = file.errors
        .map((err: { message: string }) => err.message)
        .join(", ");
      toast.error(`File rejected: ${file.file.name}. Reason: ${errorMessage}`);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    onDrop,
    onDropRejected,
  });

  const addToUploadedArray = () => {
    const storedFiles = JSON.parse(localStorage.getItem("pdfs") || "[]");
  
    // Add new file at the beginning
    const updatedFiles = [preview, ...storedFiles].slice(0, 5);
  
    // Save updated array back to localStorage
    localStorage.setItem("pdfs", JSON.stringify(updatedFiles));
  };

  return (
    <div className="w-[90%] lg:w-1/2 mx-auto">
      <p className="lg:text-3xl dar:text-white text-center mt-12 font-bold">
        Upload your PDF here
      </p>
      {preview.file_url ? (
        <div
          className="h-52 mt-12 text-[#919094] dark:text-white border border-dashed w-full rounded flex flex-col items-center justify-center gap-4 text-[12px] cursor-pointer"
          {...getRootProps()}
        >
          <Image
            src={`/assets/filetypespdf.svg`}
            alt=""
            height={20}
            width={20}
          />
          {preview?.file_name && <p className="text-lg">{preview.file_name}</p>}
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          className="h-52 mt-12 text-[#919094] dark:text-white border border-dashed w-full rounded flex flex-col items-center justify-center gap-4 text-[12px] cursor-pointer"
          {...getRootProps()}
        >
          {isDragActive ? (
            <p className="text-[#475569] dark:text-white font-medium">
              Drop the files here...
            </p>
          ) : (
            <>
              <Folder2 className="h-6 w-6" />
              <div className="text-center flex flex-col items-center gap-1">
                <p className="text-[#64748B] dark:text-white font-medium">
                  Drop your files or click to upload
                </p>
                <p className="text-[#94A3B8]">
                  Supported files types: PDF, XLS, DOCX
                </p>
              </div>
              <Button
                variant={"outline"}
                className="w-[60px] h-6 cursor-pointer"
              >
                Browse
              </Button>
              <input {...getInputProps()} />
            </>
          )}
        </div>
      )}
      <div className="mb-4 mt-12 flex flex-col gap-4 justify-end">
        <Button
          className={`w-full border border-border cursor-pointer`}
          disabled={!preview?.file_url}
          onClick={() =>
            setPreview({ file_url: "", file_name: "", file_type: "" })
          }
          variant={"ghost"}
        >
          Reset
        </Button>
        <Button
          className={`w-full dark:bg-white dark:text-[#333] bg-gray-500 text-white cursor-pointer`}
          disabled={!preview.file_url}
          onClick={() => {
            localStorage.removeItem('savedAnnotations')
            localStorage.setItem("pdf", JSON.stringify(preview));
            addToUploadedArray();
            router.push("/pdf");
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Upload;
