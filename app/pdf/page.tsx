"use client";

import { FileRecord } from "@/types";
import { Instance } from "@nutrient-sdk/viewer";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";

export default function PDFAnnotator() {
  const containerRef = useRef(null);
  const instanceRef = useRef<Instance | null>(null);
  const downloadPdfRef = useRef<() => void>(() => {}); // Mutable reference for download function
  const [pdfFile, setPdfFile] = useState<FileRecord | null>(null);

  // Load annotations from localStorage
  const loadAnnotations = () => {
    const savedAnnotations = localStorage.getItem("savedAnnotations");
    return savedAnnotations ? JSON.parse(savedAnnotations) : null;
  };

  // Add file to downloaded list
  const addToDownloadedArray = useCallback((preview: FileRecord) => {
    const storedFiles = JSON.parse(
      localStorage.getItem("downloaded-pdfs") || "[]"
    );
    const updatedFiles = [...storedFiles, preview];
    localStorage.setItem("downloaded-pdfs", JSON.stringify(updatedFiles));
  }, []);

  // Define download function and store in useRef
  const downloadPdf = useCallback(async () => {
    const instance = instanceRef.current;
    if (!instance || !pdfFile) return;

    try {
      const buffer = await instance.exportPDF();
      const firstBuffer = Array.isArray(buffer) ? buffer[0] : buffer;

      const blob = new Blob([firstBuffer], { type: "application/pdf" });
      const objectUrl = window.URL.createObjectURL(blob);

      const updatedFile = {
        file_name: `${pdfFile.file_name}-new`,
        file_type: "application/pdf",
        file_url: objectUrl,
      };

      addToDownloadedArray(updatedFile);

      // Cleanup
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  }, [pdfFile, addToDownloadedArray]);

  // Store latest downloadPdf function in ref
  useEffect(() => {
    downloadPdfRef.current = downloadPdf;
  }, [downloadPdf]);

  // Load PDF from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPdf = localStorage.getItem("pdf");
      if (storedPdf) {
        setPdfFile(JSON.parse(storedPdf));
      }
    }
  }, []);

  // Load NutrientViewer and configure toolbar
  useEffect(() => {
    if (!pdfFile?.file_url || typeof window === "undefined") return;

    const container = containerRef.current;
    const { NutrientViewer } = window;

    if (container && NutrientViewer) {
      NutrientViewer.load({
        container,
        document: pdfFile.file_url,
        autoSaveMode: NutrientViewer.AutoSaveMode.IMMEDIATE,
        instantJSON: loadAnnotations(), // Load saved annotations
      }).then((instance) => {
        instanceRef.current = instance;

        // Save annotations when changes occur
        instance.addEventListener("annotations.create", () => {
          // Manually save
          instance.save();

          // Then export and store
          instance.exportInstantJSON().then((instantJSON) => {
            localStorage.setItem(
              "savedAnnotations",
              JSON.stringify(instantJSON)
            );
          });
        });

        // Modify toolbar
        const newToolbarItems = instance.toolbarItems.filter(
          (item) => item.type !== "export-pdf"
        );

        newToolbarItems.push({
          type: "export-pdf" as const,
          id: "download-pdf",
          icon: "/download.svg",
          title: "Download",
          onPress: () => downloadPdfRef.current(),
        });

        instance.setToolbarItems(newToolbarItems);
      });
    }

    return () => {
      NutrientViewer?.unload(container);
    };
  }, [pdfFile?.file_url]);

  if (!pdfFile?.file_url)
    return (
      <div className="h-[90vh] w-full grid place-items-center">
        <p>
          No PDF to display.{" "}
          <Link href={`/`} className="text-sm font-medium text-[#008080]">
            Upload a PDF to start
          </Link>
        </p>
      </div>
    );

  return <div ref={containerRef} style={{ height: "90vh", width: "100%" }} />;
}
