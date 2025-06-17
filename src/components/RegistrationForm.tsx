import React, { useState } from "react";
import { SuccessModal } from "./SuccessModal.tsx";
import { AdminPanel } from "./AdminPanel.tsx";

interface FormData {
  nombre: string;
  dni: string;
  carrera: string;
  tipoParticipante: string;
  correo: string;
}

interface RegistrationData {
  id: string;
  nombre: string;
  dni: string;
  carrera: string;
  tipoParticipante: string;
  correo: string;
  fechaRegistro: string;
}

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    dni: "",
    carrera: "",
    tipoParticipante: "",
    correo: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveToLocalStorage = (data: FormData) => {
    const registrationData: RegistrationData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...data,
      fechaRegistro: new Date().toISOString(),
    };

    const existingData = localStorage.getItem("norbert-registrations");
    let registrations: RegistrationData[] = [];

    if (existingData) {
      try {
        registrations = JSON.parse(existingData);
      } catch (error) {
        console.error("Error parsing existing data:", error);
        registrations = [];
      }
    }

    registrations.push(registrationData);
    localStorage.setItem(
      "norbert-registrations",
      JSON.stringify(registrations),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (Object.values(formData).some((value) => value.trim() === "")) {
      alert("Por favor, completa todos los campos");
      return;
    }

    // Guardar en localStorage
    saveToLocalStorage(formData);

    // Mostrar modal de éxito
    setShowModal(true);

    // Resetear formulario
    setFormData({
      nombre: "",
      dni: "",
      carrera: "",
      tipoParticipante: "",
      correo: "",
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 relative">
      {/* Botón invisible de administración */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="absolute top-4 right-4 w-8 h-8 opacity-0 hover:opacity-20 bg-gray-500 rounded transition-opacity duration-300"
        title="Panel de administración"
      />

      <div className="max-w-md mx-auto">
        {/* Logo y header */}
        <div className="text-center mb-8">
          <div className="">
            <img src="banner.png" />
          </div>
          <div className="w-full h-1 bg-teal-500 mb-6"></div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Bienvenidos!
          </h3>
          <p className="text-gray-600">Ingresa tus datos para registrarte</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Nombre y apellidos
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              DNI/ código de estudiante
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Ingresa tu DNI o código"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Carrera/ Empresa
            </label>
            <input
              type="text"
              name="carrera"
              value={formData.carrera}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Ingresa tu carrera o empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Tipo de participante o cargo
            </label>
            <input
              type="text"
              name="tipoParticipante"
              value={formData.tipoParticipante}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Ej: Estudiante, Docente, Profesional"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      <SuccessModal isOpen={showModal} onClose={handleCloseModal} />

      {/* Panel de administración */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />
    </div>
  );
};
