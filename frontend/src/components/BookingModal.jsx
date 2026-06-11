import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { formatDepartureTime } from "../utils/helpers";
import { COLORS } from "../styles/colors";

export default function BookingModal({ ride, onClose, onSuccess }) {
  const { bookRide, showToast, userProfile, setUserProfile } = useApp();
  const [passengerName, setPassengerName] = useState("");
  const [error, setError] = useState("");

  // Pré-remplir le nom du passager si l'utilisateur a configuré son profil lors d'une session précédente
  useEffect(() => {
    if (userProfile.name) {
      const fullIdentifier = userProfile.matricule
        ? `${userProfile.name} - ${userProfile.matricule}`
        : userProfile.name;
      setPassengerName(fullIdentifier);
    }
  }, [userProfile]);

  const handleConfirm = () => {
    const trimmedName = passengerName.trim();
    if (!trimmedName) {
      setError("Votre nom ou matricule est requis pour reserver.");
      return;
    }

    // Effectuer la réservation via le context
    const { success, errorMsg } = bookRide(ride.id, trimmedName);

    if (!success) {
      setError(errorMsg);
      showToast(errorMsg, "error");
      return;
    }

    // Enregistrer localement dans le profil utilisateur pour les prochaines réservations de la session
    if (!userProfile.name) {
      if (trimmedName.includes("-")) {
        const parts = trimmedName.split("-");
        setUserProfile({
          name: parts[0].trim(),
          matricule: parts[1].trim(),
        });
      } else {
        setUserProfile((prev) => ({ ...prev, name: trimmedName }));
      }
    }

    showToast(`Reservation confirmee pour le trajet de ${ride.origin} a ${ride.destination} !`);
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: 20, margin: 0 }}>Confirmer la reservation</h2>
        <p style={{ color: COLORS.muted, fontSize: 13, marginTop: -10 }}>
          Vous etes sur le point de reserver une place sur ce trajet.
        </p>

        <div className="modal__summary">
          <p>
            <span style={{ fontWeight: 700, color: COLORS.accent }}>Itineraire: </span>
            <span>
              De <strong>{ride.origin}</strong> a <strong>{ride.destination}</strong>
            </span>
          </p>
          <p>
            <span style={{ fontWeight: 700, color: COLORS.accent }}>Depart: </span>
            <span>{formatDepartureTime(ride.departureTime)}</span>
          </p>
          <p>
            <span style={{ fontWeight: 700, color: COLORS.accent }}>Tarif: </span>
            <span><strong>{ride.price === 0 ? "Gratuit" : `${ride.price} FCFA`}</strong></span>
          </p>
          <p>
            <span style={{ fontWeight: 700, color: COLORS.accent }}>Conducteur: </span>
            <span><strong>{ride.driverName}</strong></span>
          </p>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label className="form-label">Votre nom complet ou Matricule *</label>
          <input
            type="text"
            className="input-control"
            placeholder="Entrer votre nom ou matricule"
            value={passengerName}
            onChange={(e) => {
              setPassengerName(e.target.value);
              if (error) setError("");
            }}
            autoFocus
          />
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
            Cette information sera visible par le conducteur dans son tableau de bord.
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal__actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Confirmer la reservation
          </button>
        </div>
      </div>
    </div>
  );
}
