import { useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface UseExcelUploadOptions<T> {
  onDataParsed: (data: T[]) => void;
  columnMapping: Record<string, keyof T>;
  requiredColumns?: string[];
}

export function useExcelUpload<T>({
  onDataParsed,
  columnMapping,
  requiredColumns = [],
}: UseExcelUploadOptions<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    const isValidType =
      validTypes.includes(file.type) ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv");

    if (!isValidType) {
      toast.error(
        "Format file tidak valid. Gunakan file Excel (.xlsx, .xls) atau CSV"
      );
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData =
        XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      if (jsonData.length === 0) {
        toast.error("File Excel kosong");
        return;
      }

      // Check required columns
      const firstRow = jsonData[0];
      const fileColumns = Object.keys(firstRow);

      const missingColumns = requiredColumns.filter(
        (col) =>
          !fileColumns.some((fc) => fc.toLowerCase() === col.toLowerCase())
      );

      if (missingColumns.length > 0) {
        toast.error(
          `Kolom wajib tidak ditemukan: ${missingColumns.join(", ")}`
        );
        return;
      }

      // Map data to expected format
      const mappedData: T[] = jsonData.map((row, index) => {
        const mappedRow: Record<string, unknown> = {
          id: `AC-00${String(index + 1).padStart(3, "0")}`,
        };

        for (const [excelCol, targetKey] of Object.entries(columnMapping)) {
          const matchingKey = Object.keys(row).find(
            (k) => k.toLowerCase() === excelCol.toLowerCase()
          );
          if (matchingKey) {
            mappedRow[targetKey as string] = row[matchingKey];
          }
        }

        return mappedRow as T;
      });

      onDataParsed(mappedData);
      toast.success(`${mappedData.length} data berhasil diimport dari Excel`);
    } catch (error) {
      console.error("Error parsing Excel:", error);
      toast.error("Gagal membaca file Excel");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    triggerUpload,
    fileInputRef,
    handleFileChange,
  };
}

export function downloadExcel<T>(
  data: T[],
  filename: string,
  headers: Record<string, string>
) {
  const exportData = data.map((item) => {
    const row: Record<string, unknown> = {};
    for (const [key, header] of Object.entries(headers)) {
      row[header] = (item as Record<string, unknown>)[key];
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
  toast.success("Data berhasil diexport ke Excel");
}
