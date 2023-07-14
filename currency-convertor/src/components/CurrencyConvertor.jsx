import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const initialState = {
  amount: '',
  fromCurrency: '',
  toCurrency: '',
  convertedAmount: '',
  currencyList: [],
  fetchedData: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload };
    case 'SET_FROM_CURRENCY':
      return { ...state, fromCurrency: action.payload };
    case 'SET_TO_CURRENCY':
      return { ...state, toCurrency: action.payload };
    case 'SET_CONVERTED_AMOUNT':
      return { ...state, convertedAmount: action.payload };
    case 'SET_CURRENCY_LIST':
      return { ...state, currencyList: action.payload };
    case 'SET_FETCHED_DATA':
      return { ...state, fetchedData: action.payload };
    default:
      return state;
  }
};

const CurrencyConverter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [alert, setAlert] = useState(false);
  const { amount, fromCurrency, toCurrency, convertedAmount, currencyList, fetchedData } = state;

  useEffect(() => {
    fetchCurrencyList();
  }, []);

  const fetchCurrencyList = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      const data = response.data;
      const currencies = Object.keys(data.rates);
      const currencyData = currencies.map((currency) => ({
        currency,
        rate: data.rates[currency],
      }));
      dispatch({ type: 'SET_CURRENCY_LIST', payload: currencyData });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConvert = async () => {
    if (amount && fromCurrency && toCurrency) {
      try {
        const response = await axios.post('/api/v1/currency_converter/convert', {
          amount,
          from: fromCurrency,
          to: toCurrency,
        });
        const data = response.data;
        dispatch({ type: 'SET_CONVERTED_AMOUNT', payload: data.converted_amount });
        console.log('API Call successful');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleSaveData = async () => {
    try {
      await axios.post('/api/v1/currency_converter/save_data');
      console.log('Data saved successfully');
      setAlert(true);

      // Fetch the data from the database after saving
      const response = await fetch('/api/v1/currency_converter/fetch_data');
      const data = await response.json();
      dispatch({ type: 'SET_FETCHED_DATA', payload: data });
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDownload = () => {
    if (currencyList.length === 0) {
      console.error('Currency list not available');
      return;
    }

    const sheetData = currencyList.map((currency) => ({
      Currency: currency.currency,
      Rate: currency.rate,
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Currency List');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, 'currency_list.xlsx');
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  const handleChangeAmount = (e) => {
    dispatch({ type: 'SET_AMOUNT', payload: e.target.value });
  };

  const handleChangeFromCurrency = (e) => {
    dispatch({ type: 'SET_FROM_CURRENCY', payload: e.target.value });
  };

  const handleChangeToCurrency = (e) => {
    dispatch({ type: 'SET_TO_CURRENCY', payload: e.target.value });
  };

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  }, [alert]);

  return (
    <div className="container mt-5 convertor" style={{ backgroundColor: 'gray', padding: '20px' }}>
      {alert && (
        <div className="alert alert-success" role="alert">
          Your data is saved!
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Currency Converter</h2>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={handleChangeAmount}
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="fromCurrency">From Currency</label>
            <select
              id="fromCurrency"
              className="form-control"
              value={fromCurrency}
              onChange={handleChangeFromCurrency}
            >
              <option value="">Select currency</option>
              {currencyList.map((currency) => (
                <option value={currency.currency} key={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="toCurrency">To Currency</label>
            <select
              id="toCurrency"
              className="form-control"
              value={toCurrency}
              onChange={handleChangeToCurrency}
            >
              <option value="">Select currency</option>
              {currencyList.map((currency) => (
                <option value={currency.currency} key={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="text-center">
            <button className="btn btn-primary mx-2" onClick={handleConvert}>
              Convert
            </button>
            <button className="btn btn-primary mx-2" onClick={handleSaveData}>
              Save Data
            </button>
            <button className="btn btn-primary mx-2" onClick={handleDownload}>
              Download
            </button>
          </div>
          <br />
          {convertedAmount && (
            <div className="text-center mt-3">
              Converted Amount: {convertedAmount} {toCurrency}
            </div>
          )}
          {/* {fetchedData.length > 0 && (
            <div className="mt-5">
              <h4>Fetched Data:</h4>
              <ul>
                {fetchedData.map((data, index) => (
                  <li key={index}>
                    Column 1: {data.column1}, Column 2: {data.column2}, Column 3: {data.column3}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
