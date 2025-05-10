import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BudgetForm from './BudgetForm';
import ExpenseList from './ExpenseList';

const Budget = () => {
  const { id: projectId } = useParams();
  const [budget, setBudget] = useState({
    totalBudget: 0,
    expenses: [],
    remainingBudget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchBudgetData();
  }, [projectId]);
  
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/budget`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch budget data');
      }
      
      const data = await response.json();
      setBudget(data);
    } catch (err) {
      console.error('Error fetching budget data:', err);
      setError('Failed to load budget information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const addExpense = async (expense) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      
      // Refresh budget data after adding expense
      fetchBudgetData();
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
    }
  };
  
  const deleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      
      // Refresh budget data after deleting expense
      fetchBudgetData();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense. Please try again.');
    }
  };
  
  const updateBudget = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ totalBudget: amount })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update budget');
      }
      
      // Refresh budget data after updating budget
      fetchBudgetData();
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Failed to update budget. Please try again.');
    }
  };
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  
  return (
    <div className="budget-container">
      {/* Header row with title and back button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Project Budget</h1>
        <button className="btn btn-outline-secondary" onClick={() => window.history.back()}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn-close float-end" onClick={() => setError(null)}></button>
        </div>
      )}
      
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Total Budget</h5>
              <h2 className="text-primary">${budget.totalBudget.toFixed(2)}</h2>
              <button 
                className="btn btn-sm btn-outline-primary mt-1"
                data-bs-toggle="modal"
                data-bs-target="#updateBudgetModal"
              >
                <i className="bi bi-pencil-square me-1"></i>Update
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Spent</h5>
              <h2 className="text-danger">
                ${(budget.totalBudget - budget.remainingBudget).toFixed(2)}
              </h2>
              <p className="text-muted mt-3 mb-1">
                {budget.expenses.length} expense(s)
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Remaining</h5>
              <h2 className={`${budget.remainingBudget < 0 ? 'text-danger' : 'text-success'}`}>
                ${budget.remainingBudget.toFixed(2)}
              </h2>
              <p className="text-muted mt-3 mb-1">
                {((budget.remainingBudget / budget.totalBudget) * 100).toFixed(1)}% remaining
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        {/* <div className="col-md-5">
          <BudgetForm onAddExpense={addExpense} />
        </div> */}
        
        <div className="col-md-12">
          <ExpenseList 
            expenses={budget.expenses} 
            onDeleteExpense={deleteExpense} 
          />
        </div>
      </div>
      
      {/* Update Budget Modal */}
      {/* <div className="modal fade" id="updateBudgetModal" tabIndex="-1" aria-labelledby="updateBudgetModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateBudgetModalLabel">Update Budget</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.elements.budgetAmount.value);
                updateBudget(amount);
                document.querySelector('#updateBudgetModal .btn-close').click();
              }}>
                <div className="mb-3">
                  <label htmlFor="budgetAmount" className="form-label">Budget Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="budgetAmount" 
                      name="budgetAmount"
                      defaultValue={budget.totalBudget}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Budget</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Budget;
