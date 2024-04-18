import { useState } from "react";
import { FormError, FormSuccess } from "../Messages";
import { Transaction } from "./Transaction";

export function CSVUpload() {
    const [file, setFile] = useState<File>();
    
    const [error, setError] = useState<string | null>();
    const [successMsg, setSuccessMsg] = useState<string | null>();

    const reader = new FileReader();

    function handleUpload(event: React.FormEvent<HTMLInputElement>) {
        event.preventDefault();
        
        setError(null);
        setSuccessMsg(null);

        if (!file) return setError("You haven't uploaded a CSV file");
    
        reader.onload = (event) => {
            const csvContent = event.target?.result;
            if (!csvContent || csvContent instanceof ArrayBuffer) return setError("Unable to read uploaded CSV file");

            const rows = csvContent
                .split("\n")
                .slice(1)
                .map((row) => row.split(","));

            const transactions = rows
                .filter((row) => row[3] === "Card Transaction" || row[3] === "Faster Transaction") // filter by type
                .map((row) => new Transaction().fromRow(row))
                .filter((Transaction) => Transaction.isValid);
            
            if (transactions.length == 0) return setError("The uploaded CSV file has no valid transactions");
                
            // -------------------------------------------------------------------------------------
            // TODO: STORE "transactions" IN THE DATABASE
            // -------------------------------------------------------------------------------------
            
            setSuccessMsg(`${transactions.length} transactions have been successfully imported`);
            setTimeout(() => setSuccessMsg(null), 10000);

            setFile(undefined);
        };

        reader.readAsText(file);
    };

    return <div>
        <h1>Upload your csv file</h1>

        <input 
            type="file" 
            id="uploadFile" 
            accept=".csv" 
            multiple={false} 
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : undefined)}
        />
        
        <br />

        <input type="button" value="Upload CSV" onClick={handleUpload} />

        <FormError error={error} />
        <FormSuccess message={successMsg} />
    </div>
}