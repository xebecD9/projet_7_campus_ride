import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { validateRideForm } from "../utils/helpers";
import { COLORS } from "../styles/colors";

const INITIAL_FORM = {
  driverName: "",
  password: "", // Ajout du mot de passe chauffeur
  origin: "",
  destination: "",
  departureTime: "",
  availableSeats: 3,
  price: 0,
};

function PublishRide() {
  const { addRide, showToast, userProfile, setUserProfile } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Synchroniser le nom du conducteur avec le profil utilisateur actif
  useEffect(() => {
    if (userProfile.name) {
      setForm((prev) => ({ ...prev, driverName: userProfile.name }));
    }
  }, [userProfile.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRideForm(form);
    
    // Validation locale du mot de passe requis
    if (!form.password || !form.password.trim()) {
      validationErrors.password = "Le mot de passe est requis.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Veuillez corriger les erreurs dans le formulaire.", "error");
      return;
    }

    const { success, errorMsg } = addRide(form);
    if (!success) {
      setErrors({ driverName: errorMsg });
      showToast(errorMsg, "error");
      return;
    }

    showToast("Votre trajet a ete publie avec succes !");
    
    // Si l'utilisateur n'avait pas encore de nom enregistré dans son profil, on le met à jour
    if (form.driverName.trim() && !userProfile.name) {
      setUserProfile((prev) => ({ ...prev, name: form.driverName.trim() }));
    }

    // Réinitialiser le formulaire (en conservant le nom du conducteur et le mot de passe pour simplifier)
    setForm({
      ...INITIAL_FORM,
      driverName: form.driverName,
      password: form.password,
    });
    setErrors({});
  };

  const handleShortcutClick = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520, margin: "0 auto" }}>
      <div className="form-card">
        <h2 style={{ color: COLORS.accent, margin: 0, fontSize: 22, letterSpacing: "-0.5px" }}>
          Proposer un trajet
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 6, marginBottom: 24 }}>
          Partagez vos places disponibles avec la communaute etudiante.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Nom du conducteur */}
          <div className={`form-group ${errors.driverName ? "error" : ""}`}>
            <label className="form-label">Nom du conducteur *</label>
            <input
              className="input-control"
              placeholder="Entrer votre nom"
              value={form.driverName}
              onChange={(e) => {
                setForm({ ...form, driverName: e.target.value });
                if (errors.driverName) setErrors({ ...errors, driverName: "" });
              }}
            />
          </div>
          {errors.driverName && <span style={{ fontSize: 11, color: COLORS.red, marginTop: -14, marginLeft: 4, fontWeight: 600 }}>{errors.driverName}</span>}

          {/* Mot de passe du conducteur */}
          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <label className="form-label">Mot de passe du trajet *</label>
            <input
              type="password"
              className="input-control"
              placeholder="Entrer votre mot de passe"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
          </div>
          {errors.password && <span style={{ fontSize: 11, color: COLORS.red, marginTop: -14, marginLeft: 4, fontWeight: 600 }}>{errors.password}</span>}

          {/* Départ */}
          <div className={`form-group ${errors.origin ? "error" : ""}`}>
            <label className="form-label">Lieu de depart *</label>
            <input
              className="input-control"
              placeholder="Entrer votre lieu de depart"
              value={form.origin}
              onChange={(e) => {
                setForm({ ...form, origin: e.target.value });
                if (errors.origin) setErrors({ ...errors, origin: "" });
              }}
            />
            <div className="shortcuts-list">
              {["Domayo", "Kakataré", "Dougoy"].map((place) => (
                <span
                  key={place}
                  className="shortcut-tag"
                  onClick={() => handleShortcutClick("origin", place)}
                >
                  {place}
                </span>
              ))}
            </div>
          </div>
          {errors.origin && <span style={{ fontSize: 11, color: COLORS.red, marginTop: -14, marginLeft: 4, fontWeight: 600 }}>{errors.origin}</span>}

          {/* Destination */}
          <div className={`form-group ${errors.destination ? "error" : ""}`}>
            <label className="form-label">Destination *</label>
            <input
              className="input-control"
              placeholder="Entrer votre lieu d'arrivee"
              value={form.destination}
              onChange={(e) => {
                setForm({ ...form, destination: e.target.value });
                if (errors.destination) setErrors({ ...errors, destination: "" });
              }}
            />
            <div className="shortcuts-list">
              {["Sekandé", "Kongola", "Irad"].map((place) => (
                <span
                  key={place}
                  className="shortcut-tag"
                  onClick={() => handleShortcutClick("destination", place)}
                >
                  {place}
                </span>
              ))}
            </div>
          </div>
          {errors.destination && <span style={{ fontSize: 11, color: COLORS.red, marginTop: -14, marginLeft: 4, fontWeight: 600 }}>{errors.destination}</span>}

          {/* Date & Heure */}
          <div className={`form-group ${errors.departureTime ? "error" : ""}`}>
            <label className="form-label">Date et Heure de depart *</label>
            <input
              type="datetime-local"
              className="input-control"
              value={form.departureTime}
              onChange={(e) => {
                setForm({ ...form, departureTime: e.target.value });
                if (errors.departureTime) setErrors({ ...errors, departureTime: "" });
              }}
            />
          </div>
          {errors.departureTime && <span style={{ fontSize: 11, color: COLORS.red, marginTop: -14, marginLeft: 4, fontWeight: 600 }}>{errors.departureTime}</span>}

          {/* Places & Prix */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div className={`form-group ${errors.availableSeats ? "error" : ""}`}>
                <label className="form-label">Places *</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  placeholder="Entrer votre nombre de places"
                  className="input-control"
                  value={form.availableSeats}
                  onChange={(e) => {
                    setForm({ ...form, availableSeats: e.target.value });
                    if (errors.availableSeats) setErrors({ ...errors, availableSeats: "" });
                  }}
                />
              </div>
              {errors.availableSeats && <span style={{ fontSize: 11, color: COLORS.red, marginTop: 4, display: "block", marginLeft: 4, fontWeight: 600 }}>{errors.availableSeats}</span>}
            </div>

            <div>
              <div className={`form-group ${errors.price ? "error" : ""}`}>
                <label className="form-label">Prix (FCFA) *</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="Entrer votre prix"
                  className="input-control"
                  value={form.price}
                  onChange={(e) => {
                    setForm({ ...form, price: e.target.value });
                    if (errors.price) setErrors({ ...errors, price: "" });
                  }}
                />
              </div>
              {errors.price && <span style={{ fontSize: 11, color: COLORS.red, marginTop: 4, display: "block", marginLeft: 4, fontWeight: 600 }}>{errors.price}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: 14, fontSize: 15, marginTop: 12 }}
          >
            Publier le trajet
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublishRide;
