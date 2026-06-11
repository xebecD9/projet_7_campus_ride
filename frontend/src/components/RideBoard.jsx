import { useState } from "react";
import { COLORS } from "../styles/colors";
import { useRides } from "../hooks/useRides";
import RideCard from "./RideCard";
import BookingModal from "./BookingModal";

function RideBoard({ filters }) {
  const { rides } = useRides(filters);
  const [selectedRide, setSelectedRide] = useState(null);

  if (rides.length === 0) {
    return <div style={{ textAlign: "center", padding: 60, color: COLORS.muted }}>Aucun trajet trouve</div>;
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} onBook={() => setSelectedRide(ride)} />
        ))}
      </div>

      {selectedRide && (
        <BookingModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={() => setSelectedRide(null)}
        />
      )}
    </>
  );
}

export default RideBoard;
