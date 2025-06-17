import React, { useState, useEffect } from "react";

interface RegistrationData {
  id: string;
  nombre: string;
  dni: string;
  carrera: string;
  tipoParticipante: string;
  correo: string;
  fechaRegistro: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadRegistrations();
    }
  }, [isOpen]);

  const loadRegistrations = () => {
    const stored = localStorage.getItem("norbert-registrations");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRegistrations(data);
      } catch (error) {
        console.error("Error parsing stored registrations:", error);
        setRegistrations([]);
      }
    }
  };

  const downloadCSV = () => {
    if (registrations.length === 0) {
      alert("No hay registros para descargar");
      return;
    }

    const headers = [
      "ID",
      "Nombre y Apellidos",
      "DNI/Código",
      "Carrera/Empresa",
      "Tipo de Participante",
      "Correo",
      "Fecha de Registro"
    ];

    const csvContent = [
      headers.join(","),
      ...registrations.map(reg => [
        reg.id,
        `"${reg.nombre}"`,
        reg.dni,
        `"${reg.carrera}"`,
        `"${reg.tipoParticipante}"`,
        reg.correo,
        reg.fechaRegistro
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registros-norbert-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllData = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar todos los registros? Esta acción no se puede deshacer.")) {
      localStorage.removeItem("norbert-registrations");
      setRegistrations([]);
      alert("Todos los registros han sido eliminados");
    }
  };

  const deleteRegistration = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const updatedRegistrations = registrations.filter(reg => reg.id !== id);
      localStorage.setItem("norbert-registrations", JSON.stringify(updatedRegistrations));
      setRegistrations(updatedRegistrations);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Panel de Administración - Registros</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total de registros: <span className="font-semibold text-teal-600">{registrations.length}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={downloadCSV}
                disabled={registrations.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
              >
                📥 Descargar CSV
              </button>
              <button
                onClick={clearAllData}
                disabled={registrations.length === 0}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
              >
                🗑️ Limpiar Todo
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-140px)]">
          {registrations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No hay registros guardados</p>
              <p className="text-sm mt-2">Los registros aparecerán aquí cuando los usuarios se registren</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">ID</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Nombre</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">DNI/Código</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Carrera/Empresa</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Tipo</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Correo</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Fecha</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-mono">{registration.id.slice(0, 8)}...</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{registration.nombre}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{registration.dni}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{registration.carrera}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{registration.tipoParticipante}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{registration.correo}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{new Date(registration.fechaRegistro).toLocaleString('es-ES')}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <button
                          onClick={() => deleteRegistration(registration.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          title="Eliminar registro"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
