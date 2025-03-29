"use client";

import { FileRecord } from "@/types";
import { Instance } from "@nutrient-sdk/viewer";
import { useRef, useEffect, useState, useCallback } from "react";

export default function PDFAnnotator() {
  const containerRef = useRef(null);
  const instanceRef = useRef<Instance | null>(null);
  const downloadPdfRef = useRef<() => void>(() => {}); // Mutable reference for download function
  const [pdfFile, setPdfFile] = useState<FileRecord | null>(null);

  // add to download array
  const addToDownloadedArray = useCallback((preview: FileRecord) => {
    const storedFiles = JSON.parse(
      localStorage.getItem("downloaded-pdfs") || "[]"
    );
    const updatedFiles = [...storedFiles, preview];
    localStorage.setItem("downloaded-pdfs", JSON.stringify(updatedFiles));
  }, []);

  // Define download function and store it in useRef 
  // to store the value in local storage
  const downloadPdf = useCallback(async () => {
    const instance = instanceRef.current;
    if (!instance || !pdfFile) return;

    try {
      const buffer = await instance.exportPDF();
      const firstBuffer = Array.isArray(buffer) ? buffer[0] : buffer; // Ensure we only take the first file
  
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

  // Store latest downloadPdf function in ref (prevents re-renders)
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
      }).then((instance) => {
        instanceRef.current = instance;

        // Modify toolbar
        const newToolbarItems = instance.toolbarItems.filter(
          (item) => item.type !== "export-pdf"
        );

        newToolbarItems.push({
          type: "export-pdf" as const,
          id: "download-pdf",
          icon: "/download.svg",
          title: "Download",
          onPress: () => downloadPdfRef.current(), // ✅ Uses stable function ref
        });

        instance.setToolbarItems(newToolbarItems);
      });
    }

    return () => {
      NutrientViewer?.unload(container);
    };
  }, [pdfFile?.file_url]); // ✅ No `downloadPdf` dependency

  return <div ref={containerRef} style={{ height: "90vh", width: "100%" }} />;
}
