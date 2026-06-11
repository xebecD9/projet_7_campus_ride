import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function useRides(filters = {}) {
  const { rides } = useApp();

  const filteredRides = useMemo(() => {
    const { type, query } = filters;
    let result = rides;

    if (query) {
      const q = query.toLowerCase().trim();
      result = rides.filter((ride) => {
        if (type === "origin") {
          return ride.origin.toLowerCase().includes(q);
        } else if (type === "destination") {
          return ride.destination.toLowerCase().includes(q);
        } else if (type === "price") {
          const maxPrice = parseFloat(query);
          if (isNaN(maxPrice)) return true;
          return ride.price <= maxPrice;
        } else if (type === "driver") {
          return ride.driverName.toLowerCase().includes(q);
        }
        return true;
      });
    }

    // Ordonner tous les trajets par ordre chronologique (le plus proche d'abord)
    return [...result].sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
  }, [rides, filters.type, filters.query]);

  return { rides: filteredRides };
}
