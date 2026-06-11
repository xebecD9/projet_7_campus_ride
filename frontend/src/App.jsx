import { useState } from "react";
import { useApp } from "./context/AppContext";
import { COLORS } from "./styles/colors";
import RideBoard from "./components/RideBoard";
import PublishRide from "./components/PublishRide";
import DriverDashboard from "./components/DriverDashboard";

function App() {
  const { mode, setMode, rides, toast } = useApp();
  const [filterQuery, setFilterQuery] = useState("");
  const [filterType, setFilterType] = useState("origin"); // origin, destination, price, driver

  return (
    <div className="app-container">
      {/* ── Toast de notification ────────────────────────── */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span style={{ fontWeight: 800 }}>
            {toast.type === "success" ? "Succes: " : "Erreur: "}
          </span>
          {toast.message}
        </div>
      )}

      {/* ── Header Airbnb Style ───────────────────────────── */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon-text">CR</div>
            <div>
              <div className="logo-title">Campus Ride</div>
              <div className="logo-subtitle">ENSPM - Universite de Maroua</div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: COLORS.muted, fontWeight: 700 }}>
            <span style={{ color: COLORS.accent, fontWeight: 800 }}>{rides.length}</span> trajets actifs
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────── */}
      <main className="app-main">
        {/* Mode switcher (Tabs Soulignes style Airbnb sans emojis) */}
        <div className="mode-tabs">
          <button
            onClick={() => setMode("passenger")}
            className={`tab-btn ${mode === "passenger" ? "active" : ""}`}
          >
            Je cherche un trajet
          </button>
          <button
            onClick={() => setMode("driver")}
            className={`tab-btn ${mode === "driver" ? "active" : ""}`}
          >
            Je propose un trajet
          </button>
        </div>

        {/* ── Mode Passager : recherche + liste ─────────── */}
        {mode === "passenger" && (
          <>
            {/* Barre de recherche unifiee avec menu deroulant de selection du type de filtrage */}
            <div className="search-widget-airbnb">
              <div className="search-field-section" style={{ flex: "0 0 190px" }}>
                <span className="search-field-label">Type de filtrage</span>
                <select
                  className="search-field-select"
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterQuery(""); // Reinitialise la recherche lors du changement de type
                  }}
                >
                  <option value="origin">Lieu de depart</option>
                  <option value="destination">Lieu d'arrivee</option>
                  <option value="price">Prix maximum</option>
                  <option value="driver">Conducteur</option>
                </select>
              </div>
              <div className="search-field-section">
                <span className="search-field-label">Recherche</span>
                <input
                  type={filterType === "price" ? "number" : "text"}
                  className="search-field-input"
                  placeholder={
                    filterType === "origin"
                      ? "Entrer votre depart"
                      : filterType === "destination"
                      ? "Entrer votre destination"
                      : filterType === "price"
                      ? "Entrer votre prix"
                      : "Entrer votre nom"
                  }
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
              </div>
              <button className="search-widget-btn" title="Rechercher">
                OK
              </button>
            </div>

            {/* Categories de filtrage rapide (sans emojis) */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginBottom: 36,
                overflowX: "auto",
                padding: "8px 0",
              }}
            >
              {[
                { id: "all", label: "Tous" },
                { id: "domayo", label: "Domayo" },
                { id: "kakatare", label: "Kakataré" },
                { id: "dougoy", label: "Dougoy" },
                { id: "missinguileo", label: "Missinguiléo" },
                { id: "palar", label: "Palar" },
                { id: "sekande", label: "Sekandé" },
                { id: "kongola", label: "Kongola" },
                { id: "irad", label: "Irad" },
                { id: "ouro_tchede", label: "Ouro-Tchédé" },
              ].map((cat) => {
                const isActive =
                  cat.id === "all"
                    ? !filterQuery
                    : cat.id === "sekande"
                    ? filterType === "destination" && filterQuery.toLowerCase() === "sekandé"
                    : filterType === "origin" && filterQuery.toLowerCase() === cat.label.toLowerCase();

                const handleCategoryClick = () => {
                  if (cat.id === "all") {
                    setFilterQuery("");
                  } else if (cat.id === "sekande") {
                    setFilterType("destination");
                    setFilterQuery("Sekandé");
                  } else {
                    setFilterType("origin");
                    setFilterQuery(cat.label);
                  }
                };

                return (
                  <button
                    key={cat.id}
                    onClick={handleCategoryClick}
                    style={{
                      background: isActive ? "var(--color-accent)" : "white",
                      border: "1px solid #DDDDDD",
                      borderRadius: "20px",
                      cursor: "pointer",
                      padding: "8px 18px",
                      color: isActive ? "white" : "var(--color-muted)",
                      fontWeight: 600,
                      fontSize: 13,
                      transition: "all 0.15s ease",
                      outline: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 24,
                letterSpacing: "-0.5px",
              }}
            >
              Trajets disponibles
            </h2>

            <RideBoard filters={{ type: filterType, query: filterQuery }} />
          </>
        )}

        {/* ── Mode Conducteur : publication + dashboard ── */}
        {mode === "driver" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32,
              alignItems: "start",
            }}
          >
            {/* Formulaire de publication */}
            <PublishRide />

            {/* Dashboard du conducteur */}
            <DriverDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
