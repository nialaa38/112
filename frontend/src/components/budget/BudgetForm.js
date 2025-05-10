// components/budget/BudgetForm.js
import React, { useState } from 'react';

const BudgetForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'materials',
    date: new Date().toISOString().split('T')[0]
  });
  
  const categories = [
    { value: 'materials', label: 'Materials' },
    { value: 'labor', label: 'Labor' },
    { value: 'services', label: 'Services' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const expense = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    onAddExpense(expense);
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'materials',
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Add New Expense</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-plus-circle me-2"></i>Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};


export default BudgetForm;