import { formatDepartureTime } from "../utils/helpers";
import { useApp } from "../context/AppContext";
import { COLORS } from "../styles/colors";

function RideCard({ ride, onBook }) {
  const { userProfile, cancelBooking, showToast } = useApp();
  const isFull = ride.availableSeats === 0;

  const activeName = userProfile.name.trim();
  const isPassenger =
    activeName &&
    ride.passengers.some((p) => p.toLowerCase() === activeName.toLowerCase());

  const handleCancel = (e) => {
    e.stopPropagation();
    const { success, errorMsg } = cancelBooking(ride.id, activeName);
    if (success) {
      showToast("Votre reservation a ete annulee.");
    } else {
      showToast(errorMsg, "error");
    }
  };

  const driverInitial = ride.driverName ? ride.driverName.charAt(0).toUpperCase() : "U";
  const isDriver = activeName && ride.driverName.toLowerCase() === activeName.toLowerCase();

  return (
    <div className="ride-card">
      {isFull && <div className="full-ribbon">Complet</div>}

      <div className="ride-header">
        <div className="driver-info">
          <div className="driver-avatar-sim">{driverInitial}</div>
          <div>
            <span className="info-label" style={{ display: "block", marginBottom: 2 }}>Trajet {ride.id}</span>
            <span className="driver-name">{ride.driverName}</span>
          </div>
        </div>
        <div className="departure-badge">
          {formatDepartureTime(ride.departureTime)}
        </div>
      </div>

      <div className="route-box">
        <div className="route-row">
          <span className="route-dot"></span>
          <span className="place-name">{ride.origin}</span>
        </div>
        <div style={{ borderLeft: "2px dashed var(--color-border)", height: 12, marginLeft: 3, margin: "2px 0 2px 3px" }}></div>
        <div className="route-row">
          <span className="route-dot dest"></span>
          <span className="place-name">{ride.destination}</span>
        </div>
      </div>

      <div className="ride-details">
        <div>
          <span className="info-label" style={{ display: "block", marginBottom: 4 }}>Places restantes</span>
          <span className={`seats-badge ${isFull ? "seats-full" : "seats-available"}`}>
            {isFull ? "0 place restante" : `${ride.availableSeats} place(s) restante(s)`}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="info-label" style={{ display: "block", marginBottom: 4 }}>Tarif</span>
          <span className={ride.price === 0 ? "price-free" : "price-tag"}>
            {ride.price === 0 ? "Gratuit" : `${ride.price} FCFA`}
          </span>
        </div>
      </div>

      {isPassenger ? (
        <button
          className="btn"
          onClick={handleCancel}
          style={{
            width: "100%",
            marginTop: 8,
            background: "rgba(214, 58, 58, 0.08)",
            color: COLORS.red,
            border: `1px solid ${COLORS.red}`,
          }}
        >
          Annuler ma reservation
        </button>
      ) : isDriver ? (
        <button
          className="btn btn-primary"
          disabled={true}
          style={{
            width: "100%",
            marginTop: 8,
            background: "var(--color-surface)",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
            cursor: "not-allowed"
          }}
        >
          Votre propre trajet
        </button>
      ) : (
        <button
          className="btn btn-primary"
          disabled={isFull}
          onClick={() => onBook(ride)}
          style={{ width: "100%", marginTop: 8 }}
        >
          Reserver une place
        </button>
      )}
    </div>
  );
}

export default RideCard;
