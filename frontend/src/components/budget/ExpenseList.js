// components/budget/ExpenseList.js
import React from 'react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  // Helper function to get the appropriate icon for each category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'materials':
        return 'bi-box-seam';
      case 'labor':
        return 'bi-people';
      case 'services':
        return 'bi-gear';
      case 'equipment':
        return 'bi-tools';
      default:
        return 'bi-tag';
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Expense History</h5>
        </div>
        <div className="card-body text-center py-5">
          <i className="bi bi-receipt text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 text-muted">No expenses recorded yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Expense History</h5>
        <span className="badge bg-light text-dark">{expenses.length} items</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>
                    <span className="d-flex align-items-center">
                      <i className={`bi ${getCategoryIcon(expense.category)} me-2`}></i>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(expense.date)}</td>
                  <td className="text-end">${parseFloat(expense.amount).toFixed(2)}</td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => onDeleteExpense(expense.id)}
                      title="Delete expense"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;