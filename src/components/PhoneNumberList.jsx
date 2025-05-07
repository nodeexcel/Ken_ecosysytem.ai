import React, { useState } from "react";
import { Trash2, PhoneOutgoing, Plus, X, Info } from "lucide-react";

const initialRows = [
  {
    id: "1",
    phone: "+41778090925",
    country: "Switzerland",
    active: true,
    totalCalls: 0,
    direction: "outbound",
    createdAt: "27/03/2025 03:30 PM",
  },
  // more rows...
];

export default function PhoneNumbers() {
  const [rows, setRows] = useState(initialRows);
  const [showModal, setShowModal] = useState(false);

  const toggleActive = (id) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 lg:px-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Phone Numbers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-5 py-3 flex items-center gap-2"
        >
          New Phone Number
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Phone Number</th>
              <th className="px-6 py-4 text-left">Country</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Total Calls</th>
              <th className="px-6 py-4 text-center">Direction</th>
              <th className="px-6 py-4 text-left">Creation Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-5 font-medium text-gray-900">{row.phone}</td>
                <td className="px-6 py-5 text-gray-600">{row.country}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        row.active
                          ? "border-green-500 text-green-600"
                          : "border-gray-400 text-gray-500"
                      }`}
                    >
                      {row.active ? "Active" : "Inactive"}
                    </span>
                    <ToggleSwitch
                      checked={row.active}
                      onChange={() => toggleActive(row.id)}
                    />
                  </div>
                </td>
                <td className="px-6 py-5 text-center text-gray-600">{row.totalCalls}</td>
                <td className="px-6 py-5 text-center">
                  <PhoneOutgoing size={18} className="text-green-600 inline" />
                </td>
                <td className="px-6 py-5 text-gray-600">{row.createdAt}</td>
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Add a New Number
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Enter your new phone number in the field below.
            </p>

            {/* Tabs */}
            <div className="flex mb-4 bg-gray-100 rounded-xl overflow-hidden">
              <button className="flex-1 py-2 bg-white text-sm font-medium text-gray-800 shadow-sm">
                Outbound Number
              </button>
              <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200">
                Inbound Number
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Name The Number
                </label>
                <input
                  type="text"
                  placeholder="Enter number name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Number
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2">
                  <span className="text-xl">🇺🇸</span>
                  <input
                    type="text"
                    placeholder="Enter number"
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div className="bg-yellow-100 text-yellow-800 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <Info size={16} />
                You Will Receive a Call on This Number to Validate It
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium">
                Add Number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${
        checked ? "bg-indigo-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
