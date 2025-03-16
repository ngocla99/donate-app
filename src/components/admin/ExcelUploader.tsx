import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { parse } from "date-fns";
import { AlertCircle, ArrowDownToLine, CheckCircle, FileText, Upload } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { BankTransaction } from "./BankTransactionTable";
import { useTranslation } from "react-i18next";

interface ExcelUploaderProps {
  onTransactionsProcessed: (transactions: BankTransaction[]) => void;
  userId: string;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onTransactionsProcessed, userId }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStatus, setProcessStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is Excel
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setProcessStatus("processing");

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Read the file
      const fileData = await file.arrayBuffer();

      // Process Excel data
      const parsedTransactions = await processExcelData(fileData);

      // Pass transactions to parent component
      onTransactionsProcessed(parsedTransactions);

      clearInterval(interval);
      setProgress(100);
      setProcessStatus("success");

      toast({
        title: "Processing successful",
        description: `${parsedTransactions.length} transactions processed successfully.`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      setProcessStatus("error");
      toast({
        variant: "destructive",
        title: "Processing failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your file. Please check the format and try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const processExcelData = async (fileData: ArrayBuffer): Promise<BankTransaction[]> => {
    const workbook = XLSX.read(fileData);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });

    // Find the header row based on specific column values
    let headerRow = -1;
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any[];
      // Check if this is the header row containing the column names
      if (
        row &&
        row.some((cell) => cell && String(cell).includes("STT")) &&
        row.some((cell) => cell && String(cell).includes("Ngày")) &&
        row.some((cell) => cell && String(cell).includes("Debit")) &&
        row.some((cell) => cell && String(cell).includes("Credit"))
      ) {
        headerRow = i;
        break;
      }
    }

    if (headerRow === -1) {
      throw new Error("Could not find transaction data header in the Excel file");
    }

    // Get header row to map columns to their correct positions
    const headers = data[headerRow] as string[];

    // Find column indexes
    const findColumnIndex = (keywords: string[]): number => {
      return headers.findIndex((header) => header && keywords.some((keyword) => String(header).includes(keyword)));
    };

    const numCol = findColumnIndex(["STT", "No."]);
    const dateCol = findColumnIndex(["Ngày", "Date"]);
    const debitCol = findColumnIndex(["ghi nợ", "Debit"]);
    const creditCol = findColumnIndex(["ghi có", "Credit"]);
    const balanceCol = findColumnIndex(["Số dư", "Balance"]);
    const descCol = findColumnIndex(["chi tiết", "detail"]);

    // Validate that all required columns are found
    if (numCol === -1 || dateCol === -1 || debitCol === -1 || creditCol === -1 || balanceCol === -1 || descCol === -1) {
      throw new Error("Missing required columns in the Excel file");
    }

    // Start processing from the row after the header
    const startRow = headerRow + 1;

    // Find the footer row (typically contains "Tổng số" or "Total")
    let endRow = data.length;
    for (let i = startRow; i < data.length; i++) {
      const row = data[i] as any[];
      if (!row || row.length === 0) continue;

      // Check first few columns for footer indicators
      const firstCells = row.slice(0, 3).join(" ");
      if (firstCells.includes("Tổng số") || firstCells.includes("Total")) {
        endRow = i;
        break;
      }
    }

    // Add a Map to track date occurrences
    const dateOccurrences = new Map<string, number>();

    // Process only actual transaction rows
    const parsedTransactions: BankTransaction[] = [];
    for (let i = startRow; i < endRow; i++) {
      const row = data[i] as any[];
      if (!row || row.length < Math.max(numCol, dateCol, debitCol, creditCol, balanceCol, descCol)) continue;

      // Extract transaction number
      const id = parseInt(String(row[numCol])) || 0;
      if (isNaN(id) || id === 0) continue; // Skip non-numeric IDs

      // Extract and parse date
      let date = "";
      let docNumber = "";
      if (row[dateCol]) {
        const dateDocParts = String(row[dateCol]).split("\n");
        if (dateDocParts.length >= 1) {
          const rawDate = dateDocParts[0].trim();
          try {
            const parsedDate = parse(rawDate, "dd/MM/yyyy", new Date());
            if (!isNaN(parsedDate.getTime())) {
              // Check if this date has appeared before
              const baseDate = parsedDate.toISOString().split("T")[0];
              const occurrences = dateOccurrences.get(baseDate) || 0;

              // Add seconds based on occurrence count
              parsedDate.setSeconds(occurrences);
              date = parsedDate.toISOString();

              // Update occurrence count
              dateOccurrences.set(baseDate, occurrences + 1);
            }
          } catch (error) {
            console.warn(`Invalid date format for: ${rawDate}`);
          }
        }
        if (dateDocParts.length >= 2) docNumber = dateDocParts[1].trim();
      }

      // Parse numeric values
      const parseAmount = (value: any): number => {
        if (!value && value !== 0) return 0;
        const valueStr = String(value).replace(/,/g, "").trim();
        return parseFloat(valueStr) || 0;
      };

      const debit = parseAmount(row[debitCol]);
      const credit = parseAmount(row[creditCol]);
      const balance = parseAmount(row[balanceCol]);
      const description = row[descCol] ? String(row[descCol]).trim() : "";

      // Only add valid transactions (with a date and either debit or credit)
      if (date && (debit > 0 || credit > 0)) {
        parsedTransactions.push({
          id,
          date,
          docNumber,
          debit,
          credit,
          balance,
          description,
        });
      }
    }

    if (parsedTransactions.length === 0) {
      throw new Error("No valid transaction data found in the Excel file");
    }

    return parsedTransactions;
  };

  const downloadTemplate = () => {
    // Create a link element
    const link = document.createElement("a");
    link.href = "/excel/template-history-transaction.xlsx"; // Path to your public file
    link.download = "bank_statement_template.xlsx"; // Name for the downloaded file

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template download",
      description: "Bank statement template downloaded successfully.",
    });
  };

  const resetStates = () => {
    setFile(null);
    setProcessStatus("idle");
    setProgress(0);
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button variant='outline' onClick={downloadTemplate} size='sm'>
          <ArrowDownToLine className='h-4 w-4 mr-2' />
          {t("admin.upload.downloadTemplate")}
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          {!file && (
            <div
              className='border-dashed border-2 border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors'
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input id='file-upload' type='file' accept='.xlsx,.xls' className='hidden' onChange={handleFileChange} />
              <Upload className='h-8 w-8 mx-auto mb-2 text-gray-400' />
              <p className='text-sm text-gray-600'>
                {processing ? t("admin.upload.dragAndDrop") : t("admin.upload.selectFile")}
              </p>
              <p className='text-xs text-gray-500 mt-1'>Excel files only (.xlsx, .xls)</p>
            </div>
          )}

          {file && (
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <FileText className='h-8 w-8 text-blue-500' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{file.name}</p>
                  <p className='text-xs text-gray-500'>{Math.round(file.size / 1024)} KB</p>
                </div>
                {!processing && processStatus === "idle" && (
                  <Button variant='ghost' size='sm' onClick={() => setFile(null)}>
                    {t("admin.upload.remove")}
                  </Button>
                )}
              </div>

              {processing && (
                <div className='space-y-2'>
                  <Progress value={progress} />
                  <p className='text-xs text-gray-500 text-right'>{progress}%</p>
                </div>
              )}

              {processStatus === "processing" && (
                <div className='flex items-center space-x-2 text-amber-600'>
                  <AlertCircle className='h-4 w-4' />
                  <p className='text-sm'>{t("admin.upload.processing")}</p>
                </div>
              )}

              {processStatus === "success" && (
                <div className='flex items-center space-x-2 text-green-600'>
                  <CheckCircle className='h-4 w-4' />
                  <p className='text-sm'>{t("admin.upload.success")}</p>
                </div>
              )}

              {processStatus === "error" && (
                <div className='flex items-center space-x-2 text-red-600'>
                  <AlertCircle className='h-4 w-4' />
                  <p className='text-sm'>{t("admin.upload.error")}</p>
                </div>
              )}

              {!processing && processStatus === "idle" && (
                <Button className='w-full' onClick={processFile}>
                  {t("admin.upload.processFile")}
                </Button>
              )}

              {(processStatus === "success" || processStatus === "error") && (
                <Button variant='outline' className='w-full' onClick={resetStates}>
                  {t("admin.upload.processAnotherFile")}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className='bg-amber-50 border border-amber-200 rounded-md p-4'>
        <h3 className='font-medium text-amber-800 mb-2'>{t("admin.upload.bankStatementFormatGuidelines")}</h3>
        <ul className='list-disc list-inside text-sm text-amber-700 space-y-1'>
          <li>{t("admin.upload.fileMustContainBankTransactionDetailsInStandardFormat")}</li>
          <li>{t("admin.upload.requiredColumns")}</li>
          <li>{t("admin.upload.maximumFileSize")}</li>
          <li>{t("admin.upload.supportedFormats")}</li>
        </ul>
      </div>
    </div>
  );
};
