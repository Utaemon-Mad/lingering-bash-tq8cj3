import React, { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("app_theme") === "dark";
  });

  const [tareas, setTareas] = useState(() => {
    const saved = localStorage.getItem("app_tareas");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            titulo: "Visita importante",
            fecha: "2026-09-22",
            urgente: true,
            completada: false,
          },
        ];
  });

  const [movimientos, setMovimientos] = useState(() => {
    const saved = localStorage.getItem("app_movimientos");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            concepto: "Prima por trabajo",
            monto: 350.0,
            tipo: "ingreso",
            fecha: "2026-09-15",
          },
        ];
  });

  const [notas, setNotas] = useState(() => {
    const saved = localStorage.getItem("app_notas");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            titulo: "Idea para proyecto",
            contenido: "App para organizar tareas, gastos e ideas.",
            fecha: "2026-09-19",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("app_tareas", JSON.stringify(tareas));
  }, [tareas]);
  useEffect(() => {
    localStorage.setItem("app_movimientos", JSON.stringify(movimientos));
  }, [movimientos]);
  useEffect(() => {
    localStorage.setItem("app_notas", JSON.stringify(notas));
  }, [notas]);
  useEffect(() => {
    localStorage.setItem("app_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    fecha: "",
    urgente: false,
  });
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    concepto: "",
    monto: "",
    tipo: "gasto",
  });
  const [nuevaNota, setNuevaNota] = useState({ titulo: "", contenido: "" });

  const agregarTarea = (e) => {
    e.preventDefault();
    if (!nuevaTarea.titulo.trim()) return;
    setTareas([
      ...tareas,
      { ...nuevaTarea, id: Date.now(), completada: false },
    ]);
    setNuevaTarea({ titulo: "", fecha: "", urgente: false });
  };

  const toggleTarea = (id) => {
    setTareas(
      tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  const agregarMovimiento = (e) => {
    e.preventDefault();
    if (!nuevoMovimiento.concepto.trim() || !nuevoMovimiento.monto) return;
    setMovimientos([
      ...movimientos,
      {
        id: Date.now(),
        concepto: nuevoMovimiento.concepto,
        monto: parseFloat(nuevoMovimiento.monto),
        tipo: nuevoMovimiento.tipo,
        fecha: new Date().toISOString().split("T")[0],
      },
    ]);
    setNuevoMovimiento({ concepto: "", monto: "", tipo: "gasto" });
  };

  const eliminarMovimiento = (id) => {
    setMovimientos(movimientos.filter((m) => m.id !== id));
  };

  const agregarNota = (e) => {
    e.preventDefault();
    if (!nuevaNota.titulo.trim()) return;
    setNotas([
      ...notas,
      {
        ...nuevaNota,
        id: Date.now(),
        fecha: new Date().toISOString().split("T")[0],
      },
    ]);
    setNuevaNota({ titulo: "", contenido: "" });
  };

  const eliminarNota = (id) => {
    setNotas(notas.filter((n) => n.id !== id));
  };

  const totalIngresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + m.monto, 0);
  const totalGastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);
  const balanceTotal = totalIngresos - totalGastos;

  return (
    <div
      className={`flex flex-col h-screen max-w-md mx-auto font-sans border-x transition-colors duration-200 ${
        darkMode
          ? "bg-slate-950 text-slate-100 border-slate-800"
          : "bg-slate-100 text-slate-800 border-slate-200"
      }`}
    >
      {/* HEADER */}
      <header
        className={`p-4 flex justify-between items-center shadow-md ${
          darkMode
            ? "bg-slate-900 border-b border-slate-800 text-white"
            : "bg-slate-900 text-white"
        }`}
      >
        <div>
          <h1 className="text-lg font-bold">Mi Agenda Personal</h1>
          <span className="text-[10px] text-slate-400">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-xl text-xs font-bold border transition ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-amber-400"
              : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
          title="Cambiar Tema"
        >
          {darkMode ? "🌙 Oscuro" : "☀️ Claro"}
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl shadow-sm border ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Balance General
              </span>
              <div
                className={`text-2xl font-extrabold mt-1 ${
                  balanceTotal >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {balanceTotal.toFixed(2)} €
              </div>
              <div
                className={`grid grid-cols-2 gap-2 mt-3 pt-3 border-t text-xs ${
                  darkMode ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <div>
                  <span className="text-slate-400 block">
                    Primas / Ingresos
                  </span>
                  <span className="font-bold text-emerald-500">
                    +{totalIngresos.toFixed(2)} €
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Gastos</span>
                  <span className="font-bold text-rose-500">
                    -{totalGastos.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl shadow-sm border ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Tareas Prioritarias</h2>
                <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                  {tareas.filter((t) => !t.completada && t.urgente).length}
                </span>
              </div>
              <div className="space-y-2">
                {tareas.filter((t) => !t.completada && t.urgente).length ===
                0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No tienes tareas urgentes pendientes.
                  </p>
                ) : (
                  tareas
                    .filter((t) => !t.completada && t.urgente)
                    .map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm ${
                          darkMode
                            ? "bg-amber-950/30 border-amber-800/50 text-slate-200"
                            : "bg-amber-50 border-amber-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={t.completada}
                          onChange={() => toggleTarea(t.id)}
                          className="rounded accent-amber-500 w-4 h-4"
                        />
                        <span className="flex-1 font-medium">{t.titulo}</span>
                        {t.fecha && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              darkMode
                                ? "bg-slate-900 border-slate-700 text-slate-400"
                                : "bg-white border-slate-200 text-slate-500"
                            }`}
                          >
                            {t.fecha}
                          </span>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAREAS */}
        {activeTab === "tareas" && (
          <div className="space-y-4">
            <form
              onSubmit={agregarTarea}
              className={`p-4 rounded-2xl shadow-sm border space-y-3 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <h2 className="font-bold text-sm">Nueva Tarea / Visita</h2>
              <input
                type="text"
                placeholder="Ej: Visitar a cierta persona / Tarea clave"
                value={nuevaTarea.titulo}
                onChange={(e) =>
                  setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })
                }
                className={`w-full text-sm p-2.5 border rounded-xl focus:outline-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={nuevaTarea.fecha}
                  onChange={(e) =>
                    setNuevaTarea({ ...nuevaTarea, fecha: e.target.value })
                  }
                  className={`flex-1 text-xs p-2.5 border rounded-xl ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-300"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                />
                <label
                  className={`flex items-center gap-1 text-xs px-3 py-2.5 rounded-xl border ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-300"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={nuevaTarea.urgente}
                    onChange={(e) =>
                      setNuevaTarea({
                        ...nuevaTarea,
                        urgente: e.target.checked,
                      })
                    }
                    className="accent-amber-500"
                  />
                  Urgente
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl"
              >
                Añadir Pendiente
              </button>
            </form>

            <div className="space-y-2">
              {tareas.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    darkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-slate-200"
                  } ${t.completada ? "opacity-40" : ""}`}
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <input
                      type="checkbox"
                      checked={t.completada}
                      onChange={() => toggleTarea(t.id)}
                      className="accent-indigo-500 w-4 h-4"
                    />
                    <span
                      className={`text-xs ${
                        t.completada ? "line-through" : "font-medium"
                      }`}
                    >
                      {t.titulo}
                    </span>
                  </div>
                  <button
                    onClick={() => eliminarTarea(t.id)}
                    className="text-slate-500 hover:text-rose-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANZAS */}
        {activeTab === "finanzas" && (
          <div className="space-y-4">
            <form
              onSubmit={agregarMovimiento}
              className={`p-4 rounded-2xl shadow-sm border space-y-3 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <h2 className="font-bold text-sm">Anotar Gastos o Primas</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setNuevoMovimiento({ ...nuevoMovimiento, tipo: "gasto" })
                  }
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                    nuevoMovimiento.tipo === "gasto"
                      ? "bg-rose-500/20 border-rose-500 text-rose-500"
                      : darkMode
                      ? "border-slate-800 text-slate-500"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNuevoMovimiento({ ...nuevoMovimiento, tipo: "ingreso" })
                  }
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                    nuevoMovimiento.tipo === "ingreso"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                      : darkMode
                      ? "border-slate-800 text-slate-500"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  Prima / Ingreso
                </button>
              </div>
              <input
                type="text"
                placeholder="Concepto (ej: Prima del trabajo, Gasolina)"
                value={nuevoMovimiento.concepto}
                onChange={(e) =>
                  setNuevoMovimiento({
                    ...nuevoMovimiento,
                    concepto: e.target.value,
                  })
                }
                className={`w-full text-sm p-2.5 border rounded-xl focus:outline-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Monto (€)"
                value={nuevoMovimiento.monto}
                onChange={(e) =>
                  setNuevoMovimiento({
                    ...nuevoMovimiento,
                    monto: e.target.value,
                  })
                }
                className={`w-full text-sm p-2.5 border rounded-xl focus:outline-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl"
              >
                Guardar Registro
              </button>
            </form>

            <div className="space-y-2">
              {movimientos.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                    darkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div>
                    <p className="font-medium">{m.concepto}</p>
                    <span className="text-[10px] text-slate-400">
                      {m.fecha}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        m.tipo === "ingreso"
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {m.tipo === "ingreso" ? "+" : "-"}
                      {m.monto.toFixed(2)} €
                    </span>
                    <button
                      onClick={() => eliminarMovimiento(m.id)}
                      className="text-slate-500 hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTAS / IDEAS */}
        {activeTab === "notas" && (
          <div className="space-y-4">
            <form
              onSubmit={agregarNota}
              className={`p-4 rounded-2xl shadow-sm border space-y-3 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <h2 className="font-bold text-sm">Cajón de Ideas / Notas</h2>
              <input
                type="text"
                placeholder="Título de la idea"
                value={nuevaNota.titulo}
                onChange={(e) =>
                  setNuevaNota({ ...nuevaNota, titulo: e.target.value })
                }
                className={`w-full text-sm p-2.5 border rounded-xl focus:outline-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
              <textarea
                placeholder="Escribe tus notas aquí..."
                rows="3"
                value={nuevaNota.contenido}
                onChange={(e) =>
                  setNuevaNota({ ...nuevaNota, contenido: e.target.value })
                }
                className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-white"
                    : "bg-white border-slate-200"
                }`}
              ></textarea>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-xl"
              >
                Guardar Idea
              </button>
            </form>

            <div className="space-y-2">
              {notas.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border space-y-1 text-xs ${
                    darkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold">{n.titulo}</h4>
                    <button
                      onClick={() => eliminarNota(n.id)}
                      className="text-slate-500 hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </div>
                  <p className={darkMode ? "text-slate-300" : "text-slate-600"}>
                    {n.contenido}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* BARRA INFERIOR (MARGEN CORREGIDO) */}
      <nav
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t p-2 flex justify-around text-xs shadow-lg z-50 ${
          darkMode
            ? "bg-slate-900/95 backdrop-blur border-slate-800"
            : "bg-white/95 backdrop-blur border-slate-200"
        }`}
      >
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`p-2 flex flex-col items-center ${
            activeTab === "dashboard"
              ? "text-indigo-500 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="text-base">🏠</span>
          <span className="text-[10px]">Inicio</span>
        </button>
        <button
          onClick={() => setActiveTab("tareas")}
          className={`p-2 flex flex-col items-center ${
            activeTab === "tareas"
              ? "text-indigo-500 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="text-base">📋</span>
          <span className="text-[10px]">Tareas</span>
        </button>
        <button
          onClick={() => setActiveTab("finanzas")}
          className={`p-2 flex flex-col items-center ${
            activeTab === "finanzas"
              ? "text-indigo-500 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="text-base">💰</span>
          <span className="text-[10px]">Gastos</span>
        </button>
        <button
          onClick={() => setActiveTab("notas")}
          className={`p-2 flex flex-col items-center ${
            activeTab === "notas"
              ? "text-indigo-500 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="text-base">💡</span>
          <span className="text-[10px]">Ideas</span>
        </button>
      </nav>
    </div>
  );
}
