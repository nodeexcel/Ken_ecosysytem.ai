import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentFailed() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const error = query.get('error');

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Oops! Something went wrong while processing your payment.
          {error && <span className="block mt-2 text-red-400 text-sm">Error: {error}</span>}
        </p>
      </div>
    </div>
  );
}

export default PaymentFailed;
