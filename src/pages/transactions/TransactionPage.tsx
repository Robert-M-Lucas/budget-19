import { useEffect, useState } from "react";

// CSS
import "./transactionsTable.scss";
import {getTransactionsPage} from "../../utils/transaction_utils.ts";
import {auth} from "../../utils/firebase.ts";
import {getTransactions, Transaction} from "../../utils/transaction.ts";

export function TransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    console.log("A");

    // adjusted dylan.s code to use getTransactionPage instead of getTransactions
    useEffect(() => {
        if (!auth.currentUser) return;

        getTransactionsPage(auth.currentUser, itemsPerPage, currentPage)
            .then((pageTransactions) => {
                console.log("Fetched transactions:");
                console.log(pageTransactions);
                setTransactions(pageTransactions);
            });
    }, [currentPage]);

    console.log("B");

    if (transactions.length === 0) {
        return <div>Fetching transactions</div>;
    }

    console.log("C");

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Emoji</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Notes</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <TransactionItem key={transaction.forceGetDocName()} data={transaction}/>
                    // maps every transaction as a row in the table
                ))}
                </tbody>
            </table>
            <div className="pagination">
                {/* conditional previous page button, only displayed if page number > 1 */}
                {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>
                        <span>&lt;</span> Previous
                    </button>
                )}
                {/* spacers to push buttons to the edges */}
                <div className="spacer"></div>
                <span className="page-counter">Page {currentPage}</span>
                <div className="spacer"></div>
                <button onClick={() => setCurrentPage(currentPage + 1)}>
                    Next <span>&gt;</span>
                </button>
            </div>
        </div>
    );
}

function TransactionItem({data}: { data: Transaction }) {
    return (
        <tr>
            <td>{data.name}</td>
            <td>{data.category}</td>
            <td>{data.emoji}</td>
            <td>{data.dateTime}</td>
            <td>{data.amount}</td>
            <td>{data.notes}</td>
        </tr>
    );
}