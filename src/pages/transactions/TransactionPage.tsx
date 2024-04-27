import {useState} from "react";
import {auth} from "../../utils/firebase.ts";
import {getTransactionsFilterOrderBy, Transaction} from "../../utils/transaction.ts";
import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {User} from "firebase/auth";
import {Header} from "../../components/Header.tsx";
import {signInWithGoogle} from "../../utils/authentication.ts";
import {limit, orderBy, startAfter} from "firebase/firestore";
import strftime from "strftime";

// CSS
import "./transactionsTable.scss";

export function TransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [authResolved, setAuthResolved] = useState(false);
    const [update, setUpdate] = useState(0);
    const [pageStarts, setPageStarts] = useState([Infinity]);
    const itemsPerPage = 14;


    if (!authResolved) {
        auth.authStateReady().then(() => setAuthResolved(true));
        return <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Waiting for Auth</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    if (auth.currentUser === null) {
        auth.onAuthStateChanged((new_user: User | null) => {
            if (new_user !== null) {
                setUpdate(update + 1);
            }
        });
        return <>
            <Header/>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Not Logged In</h1>
                    <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>
                        Sign in with Google
                    </button>
                </div>
            </FullscreenCenter>
        </>;
    }

    if (!transactions) {
        getTransactionsFilterOrderBy(auth.currentUser, orderBy("dateTime", "desc"), limit(itemsPerPage), startAfter(pageStarts[pageStarts.length - 1]))
            .then((pageTransactions) => {
                setTransactions(pageTransactions);
            });

        return <>
            <Header/>
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
                <tr>
                    <td>Fetching...</td>
                    <td>Fetching...</td>
                    <td>Fetching...</td>
                    <td>Fetching...</td>
                    <td>Fetching...</td>
                    <td>Fetching...</td>
                </tr>
                </tbody>
            </table>
        </>;
    }


    // adjusted dylan.s code to use getTransactionPage instead of getTransactions
    // useEffect(() => {
    //     getTransactionsPage(auth.currentUser, itemsPerPage, currentPage)
    //         .then((pageTransactions) => {
    //             console.log("Fetched transactions:");
    //             console.log(pageTransactions);
    //             setTransactions(pageTransactions);
    //         });
    // }, [currentPage]);

    return <>
        <Header/>
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
            { transactions.length == 0 &&
                <h1 className="vw-100 text-center text-muted">[No More Data]</h1>
            }
            <div className="pagination p-2">
                {/* conditional previous page button, only displayed if page number > 1 */}
                {currentPage > 0 && (
                    <button onClick={() => {
                        setCurrentPage(currentPage - 1);
                        pageStarts.pop()
                        setPageStarts(pageStarts);
                        setTransactions(null);
                    }}>
                        <span>&lt;</span> Previous
                    </button>
                )}
                {/* spacers to push buttons to the edges */}
                <div className="spacer"></div>
                <span className="page-counter">Page {currentPage + 1}</span>
                <div className="spacer"></div>
                {transactions.length === itemsPerPage &&
                <button onClick={() => {
                    setCurrentPage(currentPage + 1);
                    pageStarts.push(transactions[transactions.length - 1].dateTime);
                    setPageStarts(pageStarts);
                    setTransactions(null);
                }}>
                    Next <span>&gt;</span>
                </button>
                }
            </div>

        </div>
    </>;
}

function TransactionItem({data}: { data: Transaction }) {
    return (
        <tr>
            <td>{data.name}</td>
            <td>{data.category}</td>
            <td>{data.emoji}</td>
            <td>{strftime("%d/%m/%y - %H:%M", new Date(data.dateTime))}</td>
            {data.amount > 0 ?
                <td className="d-flex justify-content-between" style={{color: "green"}}>
                    <span>£</span>
                    <span>{data.amount.toFixed(2)}</span>
                </td> :
                <td className="d-flex justify-content-between" style={{color: "red"}}>
                    <span>£</span>
                    <span>{data.amount.toFixed(2)}</span>
                </td>
            }
            <td>{data.notes}</td>
        </tr>
    );
}