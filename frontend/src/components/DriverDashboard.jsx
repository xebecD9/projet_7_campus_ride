import { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatDepartureTime } from "../utils/helpers";
import { COLORS } from "../styles/colors";

export default function DriverDashboard() {
  const { rides, cancelRide, showToast } = useApp();
  const [driverName, setDriverName] = useState("");
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");

    const nameClean = driverName.trim().toLowerCase();
    const pwClean = password.trim();

    if (!nameClean || !pwClean) {
      setAuthError("Veuillez saisir votre nom et votre mot de passe.");
      return;
    }

    // 1. Vérifier si le conducteur existe dans le système
    const driverExists = rides.some((r) => r.driverName.toLowerCase() === nameClean);
    if (!driverExists) {
      setAuthError("Aucun trajet trouve pour ce nom de conducteur.");
      return;
    }

    // 2. Vérifier si le mot de passe correspond à l'un des trajets de ce conducteur
    const authValid = rides.some(
      (r) => r.driverName.toLowerCase() === nameClean && r.password === pwClean
    );
    if (!authValid) {
      setAuthError("Mot de passe incorrect.");
      return;
    }

    setIsUnlocked(true);
    showToast("Connexion reussie en tant que conducteur.");
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPassword("");
    setAuthError("");
    showToast("Session fermee.");
  };

  const handleCancelRide = (rideId) => {
    if (window.confirm("Voulez-vous vraiment annuler ce trajet ?")) {
      const { success, errorMsg } = cancelRide(rideId);
      if (success) {
        showToast("Votre trajet a ete annule avec succes.");
      } else {
        showToast(errorMsg, "error");
      }
    }
  };

  // Filtrer et ordonner les trajets uniquement pour ce conducteur connecté
  const myRides = isUnlocked
    ? rides
        .filter(
          (ride) =>
            ride.driverName.toLowerCase() === driverName.trim().toLowerCase() &&
            ride.password === password.trim()
        )
        .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime))
    : [];

  return (
    <div className="dashboard-card">
      <div className="dashboard-title-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, letterSpacing: "-0.5px" }}>
            Gestion des trajets
          </h2>
          {isUnlocked && (
            <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>
              Session active pour le conducteur <strong>{driverName}</strong>
            </p>
          )}
        </div>
        {isUnlocked && (
          <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 11 }} onClick={handleLogout}>
            Fermer la session
          </button>
        )}
      </div>

      {!isUnlocked ? (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>
            Veuillez entrer votre nom et le mot de passe associe a vos trajets pour acceder a leur gestion et voir vos passagers.
          </p>

          <div className="form-group">
            <label className="form-label">Nom du conducteur</label>
            <input
              type="text"
              className="input-control"
              placeholder="Entrer votre nom"
              value={driverName}
              onChange={(e) => {
                setDriverName(e.target.value);
                if (authError) setAuthError("");
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe du trajet</label>
            <input
              type="password"
              className="input-control"
              placeholder="Entrer votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (authError) setAuthError("");
              }}
            />
          </div>

          {authError && <div className="form-error">{authError}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 12, marginTop: 8 }}>
            Acceder a mes trajets
          </button>
        </form>
      ) : (
        <div className="driver-rides-list">
          {myRides.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: COLORS.muted }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Tous vos trajets ont ete annules.</p>
            </div>
          ) : (
            myRides.map((ride) => {
              const isFull = ride.availableSeats === 0;
              return (
                <div key={ride.id} className="driver-ride-item">
                  <div className="driver-ride-summary">
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase" }}>
                        Trajet {ride.id}
                      </span>
                      <h3 style={{ fontSize: 16, margin: "2px 0 6px" }}>
                        De {ride.origin} a {ride.destination}
                      </h3>
                      <div style={{ fontSize: 13, color: COLORS.muted, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span>Depart : {formatDepartureTime(ride.departureTime)}</span>
                        <span>•</span>
                        <span>Tarif : {ride.price === 0 ? "Gratuit" : `${ride.price} FCFA`}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span
                        className={`seats-badge ${isFull ? "seats-full" : "seats-available"}`}
                        style={{ fontSize: 13 }}
                      >
                        {ride.availableSeats} place(s) restante(s)
                      </span>
                    </div>
                  </div>

                  <div className="passenger-section">
                    <div className="passenger-title">
                      Passagers inscrits ({ride.passengers.length})
                    </div>
                    {ride.passengers.length === 0 ? (
                      <p className="no-passengers">Aucun passager inscrit pour le moment.</p>
                    ) : (
                      <ul className="passenger-list">
                        {ride.passengers.map((passenger, index) => (
                          <li key={index} className="passenger-item">
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div className="passenger-avatar">
                                {passenger.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>{passenger}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Bouton pour annuler le trajet */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                    <button
                      className="btn btn-secondary"
                      style={{
                        padding: "8px 16px",
                        fontSize: 12,
                        borderColor: "var(--color-red)",
                        color: "var(--color-red)",
                        background: "rgba(178, 90, 90, 0.05)"
                      }}
                      onClick={() => handleCancelRide(ride.id)}
                    >
                      Annuler le trajet
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
