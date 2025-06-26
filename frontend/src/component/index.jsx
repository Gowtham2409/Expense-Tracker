import './expense.css';
import { useState, useEffect } from "react";
import axios from "axios";
import {
    FaChartBar,
    FaClipboardList,
    FaClock,
    FaTrash
} from "react-icons/fa";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";

export default function ExpenseTracker() {
    const [transactions, setTransactions] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [activeTab, setActiveTab] = useState("expense");

    useEffect(() => {
        axios.get("http://localhost:4200/transactions")
            .then(res => setTransactions(res.data))
            .catch(err => console.error("Error fetching transactions:", err));
    }, []);

    const handleAdd = () => {
        if (!title || !amount) return;
        const newTransaction = {
            title,
            amount: parseFloat(amount),
        };
        axios.post("http://localhost:4200/transactions", newTransaction)
            .then(res => {
                setTransactions([...transactions, res.data]);
                setTitle("");
                setAmount("");
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:4200/transactions/${id}`)
            .then(() => setTransactions(transactions.filter(t => t._id !== id)));
    };

    const income = transactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
    const balance = income + expense;

    const chartData = [
        { name: "Income", value: income },
        { name: "Expense", value: Math.abs(expense) },
    ];

    const COLORS = ["#00e676", "#ff5252"];

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2 className="logo" >CK</h2>
                <nav>
                    <button onClick={() => setActiveTab("expense")} className={activeTab === "expense" ? "active" : ""}>
                        <FaClipboardList /> Expense
                    </button>
                    <button onClick={() => setActiveTab("stats")} className={activeTab === "stats" ? "active" : ""}>
                        <FaChartBar /> Stats
                    </button>
                    <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "active" : ""}>
                        <FaClock /> History
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                {/* Summary Cards for all tabs */}
                <div className="summary-cards row-layout">
                    <div>
                        <p>Income</p>
                        <h3 className="pos">₹{income.toFixed(2)}</h3>
                    </div>
                    <div>
                        <p>Expense</p>
                        <h3 className="neg">₹{Math.abs(expense).toFixed(2)}</h3>
                    </div>
                    <div>
                        <p>Balance</p>
                        <h3>₹{balance.toFixed(2)}</h3>
                    </div>
                </div>

                {activeTab === "expense" && (
                    <div className="expense-tab">
                        <h1>New Transaction</h1>
                        <h3>Add your income or expense</h3>
                        <input
                            type="text"
                            placeholder="Enter title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <h3>Amount</h3>
                        <input
                            type="number"
                            placeholder="Enter amount..."
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={handleAdd}>+ Add Transaction</button>

                        <h3 style={{ marginTop: "30px" }}>Recent</h3>

                        {transactions.slice(-4).reverse().map(item => (
                            <div key={item._id} className="history-item">
                                {/* <div className='history-item-container'> */}
                                <span className='history-title'>{item.title}</span>
                                <span className={item.amount < 0 ? "neg" : "pos"}>
                                    {item.amount < 0 ? "-" : "+"}₹{Math.abs(item.amount)}
                                </span>
                                {/* </div> */}
                            </div>
                        ))}
                    </div>

                )
                }

                {
                    activeTab === "stats" && (
                        <div className="stats-tab">
                            <div className="charts-wrapper">
                                <div className="chart-box">
                                    <h3>Bar Chart</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={chartData}>
                                            <XAxis dataKey="name" stroke="#aaa" />
                                            <YAxis stroke="#aaa" />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#6558f5" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="chart-box">
                                    <h3>Pie Chart</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === "history" && (
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
                                            <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )
                }
            </main >
        </div >
    );
}
