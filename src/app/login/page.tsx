"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Stethoscope, Mail, Lock, Chrome, Apple, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { RegistroModal } from "@/componentes/RegistroModal";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalRecuperar, setModalRecuperar] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const [recuperacionEnviada, setRecuperacionEnviada] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      });

      if (res?.error) {
        setError("Correo o contraseña incorrectos");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperar = (e: React.FormEvent) => {
    e.preventDefault();
    setRecuperacionEnviada(true);
    setTimeout(() => {
      setModalRecuperar(false);
      setRecuperacionEnviada(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[450px] space-y-8 p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
        
        {/* Logo y Titulo */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#0056b3] p-3 rounded-2xl shadow-lg shadow-blue-500/20">
            <Stethoscope size={32} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Consul Dent</h1>
            <p className="text-sm text-gray-400 font-medium">Gestión Dental Inteligente</p>
          </div>
        </div>

        {/* Botones Sociales */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-sm text-gray-600"
          >
            <Chrome size={18} className="text-red-500" />
            Google
          </button>
          <button 
            onClick={() => signIn("apple", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-sm text-gray-600"
          >
            <Apple size={18} className="text-black" />
            Apple
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-300 font-bold tracking-widest">o con tu correo</span>
          </div>
        </div>

        {/* Formulario Manual */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
              <Mail size={12} /> Correo Electrónico
            </label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@clinicadental.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Lock size={12} /> Contraseña
              </label>
              <button 
                type="button" 
                onClick={() => setModalRecuperar(true)}
                className="text-[10px] font-bold text-[#0056b3] hover:underline uppercase tracking-tighter"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] outline-none transition-all text-sm"
            />
          </div>

          {error && <p className="text-xs text-rose-500 font-bold text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0056b3] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-[#004a99] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Iniciar Sesión"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Pie de página */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <button 
              onClick={() => setModalRegistro(true)}
              className="text-[#0056b3] font-bold hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>

      {/* Modal Recuperar Contraseña */}
      {modalRecuperar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animar-entrada space-y-6">
            <h2 className="text-xl font-bold text-gray-900 text-center">Recuperar Acceso</h2>
            {recuperacionEnviada ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center text-emerald-500"><CheckCircle2 size={40} /></div>
                <p className="text-sm text-gray-500 font-medium">Instrucciones enviadas a tu correo.</p>
              </div>
            ) : (
              <form onSubmit={handleRecuperar} className="space-y-4">
                <p className="text-xs text-gray-400 text-center">Ingresa tu correo para recibir un enlace de recuperación.</p>
                <input 
                  required
                  type="email"
                  value={emailRecuperacion}
                  onChange={(e) => setEmailRecuperacion(e.target.value)}
                  placeholder="ejemplo@clinicadental.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModalRecuperar(false)} className="flex-1 py-3 text-sm font-bold text-gray-400">Cancelar</button>
                  <button type="submit" className="flex-1 bg-[#0056b3] text-white py-3 rounded-2xl text-sm font-bold">Enviar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <RegistroModal isOpen={modalRegistro} onClose={() => setModalRegistro(false)} />
    </div>
  );
}
