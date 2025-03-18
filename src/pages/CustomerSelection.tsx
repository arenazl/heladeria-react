import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customers } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import '../styles/CustomerSelection.css';

const CustomerSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setCustomer, order } = useOrder();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm]);

  const handleCustomerClick = (customerId: number) => {
    const selectedCustomer = customers.find(customer => customer.id === customerId);
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      // Only navigate to confirmation if there are items in the order
      if (order.items.length > 0) {
        navigate('/confirmation');
      } else {
        // If no items, navigate to categories to start ordering
        navigate('/categories');
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Selecciona un Cliente</h2>
        
        <div className="customer-search-container">
          <input
            type="text"
            className="customer-search-input"
            placeholder="Buscar cliente por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="customer-search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <div className="customer-list">
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id} 
              className="customer-card"
              onClick={() => handleCustomerClick(customer.id)}
            >
              <div className="customer-avatar">
                {customer.name.charAt(0)}
              </div>
              <div className="customer-info">
                <h2>{customer.name}</h2>
                <p className="customer-address">{customer.address}</p>
                <p className="customer-phone">{customer.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSelection;
