// src/pages/InvoicePrint.js
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toWords } from "number-to-words";
import { useReactToPrint } from "react-to-print";

const InvoiceNewPrint = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `https://billing-backend-seven.vercel.app/invoices/mono/${id}`
        );
        const data = await response.json();
        if (data.success) {
          setInvoice(data.data);
        } else {
          setError("Invoice not found");
        }
      } catch (error) {
        setError("Error fetching invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Laundry Invoice",
    pageStyle: `
@page {
  size: A4;
  margin: 5mm;
}

@media print {
  html, body {
    margin: 0;
    padding: 24px;
    width: 250mm;
    height: 280mm;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
    

  #print-root, #root {
  height: 100vh;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  .no-print {
    display: none !important;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  .invoice-container {
    margin: 0 auto;
    max-width: 180mm;
    padding: 10mm;
  }

  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }
}
`,
  });

  if (loading) return <div>Loading invoice...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-2 sm:p-6 md:p-10 text-xs sm:text-sm">
      {/* Print Button */}
      <div className="mb-4 text-right">
        <button
          className="no-print bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
          onClick={handlePrint}
        >
          🖨️ Print Invoice
        </button>
      </div>

      {/* Printable Content */}
      <div ref={componentRef} className="overflow-x-auto">
        <div className="border-2 border-black max-w-full md:max-w-5xl mx-auto text-[0.65rem] sm:text-xs md:text-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 relative border-b-2 border-black p-2 sm:p-4">
            <h1 className="text-base sm:text-xl text-blue-600 font-bold text-center w-full sm:w-auto">
              T A X&nbsp;I N V O I C E
            </h1>
            <span className="sm:static absolute top-2 right-2 sm:relative text-xs sm:text-base font-semibold mt-1 sm:mt-0 bg-white px-1">
              ORIGINAL FOR RECIPIENT
            </span>
          </div>

          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b-2 border-black">
            <div className="flex flex-col sm:flex-row items-start gap-2 mb-2 p-2">
              <img
                src="/src/assets/Logo.png"
                alt="Logo"
                className="w-20 h-16 object-contain mb-2 sm:mb-0"
              />
              <div>
                <p className="text-base sm:text-lg font-bold">
                  SHINE INFOSOLUTIONS
                </p>
                <p>
                  GSTIN: <span className="font-bold">09FTJPS4577P1ZD</span>
                </p>
                <p>
                  87a, Bankati chak, Raiganj road, Near Chhoti Masjid, Gorakhpur
                </p>
                <p>Gorakhpur, UTTAR PRADESH, 273001</p>
                <p>
                  <strong>Mobile:</strong> +91 7054284786, 9140427414
                </p>
                <p>
                  <strong>Email:</strong> info@shineinfosolutions.in
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 border border-t-0 border-b-0 border-r-0 border-black text-xs sm:text-sm font-semibold">
              <div className="border border-t-0 border-black p-2">
                <p>Invoice #:</p>
                <p className="font-bold">{invoice.invoiceNumber}</p>
              </div>
              <div className="border border-black border-t-0 border-r-0 p-2">
                <p>Invoice Date:</p>
                <p className="font-bold">{invoice.invoiceDate}</p>
              </div>
              <div className="border border-black border-b-0 p-2">
                <p>Place of Supply:</p>
                <p className="font-bold">{invoice.customerGST}</p>
              </div>
              <div className="border border-black border-b-0 border-r-0 p-2">
                <p>Due Date:</p>
                <p className="font-bold">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-r-2 border-black p-2">
              <p>
                <strong>Customer Details:</strong>
              </p>
              <p>GSTIN: {invoice.customerGST}</p>
              <p>Billing Address: {invoice.customerAddress}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full border-2 border-black text-[0.65rem] sm:text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1">#</th>
                  <th className="border border-black px-2 py-1">Item</th>
                  <th className="border border-black px-2 py-1">HSN/ SAC</th>
                  <th className="border border-black px-2 py-1">Rate / Item</th>
                  <th className="border border-black px-2 py-1">Qty</th>
                  <th className="border border-black px-2 py-1">
                    Taxable Value
                  </th>
                  <th className="border border-black px-2 py-1">Tax Amount</th>
                  <th className="border border-black px-2 py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.productDetails?.map((product, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {product.item}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {product.hsn}
                    </td>
                    <td className="border border-black px-2 py-1">
                      ₹{product.rate}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {product.qty}
                    </td>
                    <td className="border border-black px-2 py-1">
                      ₹{product.taxableValue}
                    </td>
                    <td className="border border-black px-2 py-1">
                      ₹{product.taxAmount}
                    </td>
                    <td className="border border-black px-2 py-1">
                      ₹{product.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 text-xs font-bold">
            <p>
              Total Items / Qty: {invoice.productDetails.length} /{" "}
              {invoice.productDetails.reduce(
                (acc, product) => acc + product.qty,
                0
              )}
            </p>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-t-2 border-black p-1">
            <div></div>
            <div className="p-2 text-xs text-center font-semibold">
              <p>
                <b>Taxable Amount: ₹</b> {invoice.amountDetails.totalAmount}
              </p>
              <p>
                <b>CGST 9.0%: ₹</b> {invoice.amountDetails.gstPercentage}
              </p>
              <p>
                <b>SGST 9.0%: ₹</b> {invoice.amountDetails.discountOnTotal}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 border-t-2 border-black">
            <div></div>
            <h2 className="font-bold p-2 text-md text-right">
              TOTAL: ₹ {invoice.amountDetails.totalAmount}
            </h2>
          </div>

          {/* Amount in words */}
          <div className="p-2 border-t-2 border-black text-right">
            <strong>Total amount (in words): INR</strong>{" "}
            {capitalizeWords(
              toWords(invoice.amountDetails.totalAmount) + " only"
            )}
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-black">
            <div className="p-4">
              <p className="font-bold mb-1">Bank Details:</p>
              <p>
                <strong>Bank:</strong> HDFC Bank
              </p>
              <p>
                <strong>Account #:</strong> 50200068337918
              </p>
              <p>
                <strong>IFSC Code:</strong> HDFC0004331
              </p>
              <p>
                <strong>Branch:</strong> GEETA PRESS
              </p>
            </div>
            <div className="p-4 border-t sm:border-t-0 sm:border-l border-black text-right flex flex-col justify-between">
              <div>
                <p className="font-semibold">Amount Payable: ₹</p>
              </div>
              <div>
                <p className="font-bold">For SHINE INFOSOLUTIONS</p>
                <p className="italic mt-6">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceNewPrint;
