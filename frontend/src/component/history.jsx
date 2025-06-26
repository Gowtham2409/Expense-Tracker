import './expense.css';
export default function History({ transactions, handleDelete }) {
    return (
        <>
            <h2 className="section-title">Transaction History</h2>
            <div className="history">
                {transactions.length === 0 ? (
                    <p className="empty">No transactions yet.</p>
                ) : (
                    transactions.map((item) => (
                        <div key={item._id} className="history-item">
                            {/* <div className='history-item-container'> */}
                            <span className='history-title'>{item.title}</span>
                            <span className={item.amount < 0 ? "neg" : "pos"}>
                                {item.amount < 0 ? "-" : "+"}₹{Math.abs(item.amount)}
                            </span>
                            {/* </div> */}
                            <button className="btn-his" onClick={() => handleDelete(item._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
