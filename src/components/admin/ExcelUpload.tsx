import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BankTransaction, BankTransactionTable } from "./BankTransactionTable";
import { ExcelUploader } from "./ExcelUploader";
import { useTranslation } from "react-i18next";

const ExcelUpload = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTransactionsProcessed = (newTransactions: BankTransaction[]) => {
    setTransactions(newTransactions);
  };

  const handleBulkAction = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) return;

    setIsBulkLoading(true);
    try {
      // Prepare data for Supabase
      const supabaseData = transactions
        .filter((transaction) => selectedIds.includes(transaction.id))
        .map((transaction) => ({
          transaction_date: new Date(transaction.date).toISOString(),
          document_number: transaction.docNumber,
          debit: transaction.debit,
          credit: transaction.credit,
          balance: transaction.balance,
          description: transaction.description,
          uploaded_by: user?.id || "",
        }));

      // Insert into database
      const { error: insertError } = await supabase.from("bank_transactions").insert(supabaseData);
      if (insertError) throw insertError;

      toast({
        title: t("admin.upload.success"),
        description: `${selectedIds.length} ${t("transactions")} ${t("admin.upload.processing")}`,
      });

      // Remove processed transactions from the list
      setTransactions(transactions.filter((t) => !selectedIds.includes(t.id)));
    } catch (error) {
      console.error("Error processing transactions:", error);
      toast({
        variant: "destructive",
        title: t("admin.upload.error"),
        description: error instanceof Error ? error.message : t("common.unexpectedError"),
      });
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className='space-y-8'>
      <ExcelUploader onTransactionsProcessed={handleTransactionsProcessed} userId={user?.id || ""} />

      {transactions.length > 0 && (
        <BankTransactionTable
          transactions={transactions}
          onBulkAction={handleBulkAction}
          isBulkLoading={isBulkLoading}
        />
      )}
    </div>
  );
};

export default ExcelUpload;
