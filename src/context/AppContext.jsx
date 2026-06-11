import { createContext, useContext, useState, useEffect } from "react";
import initialRides from "../data/rides.json";

const AppContext = createContext();

// Fonction utilitaire pour verifier si deux dates de depart se chevauchent dans la meme heure
const isSamePeriod = (timeStr1, timeStr2) => {
  const date1 = new Date(timeStr1);
  const date2 = new Date(timeStr2);
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return false;
  // Conflit si la difference est de moins d'une heure (3600000 millisecondes)
  return Math.abs(date1.getTime() - date2.getTime()) < 3600000;
};

export function AppProvider({ children }) {
  // ── Mode actif ──────────────────────────────────────────
  const [mode, setMode] = useState("passenger");

  // ── Chargement des données initiales ─────────────────────
  const [rides, setRides] = useState(() => {
    const stored = localStorage.getItem("campus_rides_v2");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Erreur de lecture de localStorage for rides:", e);
      }
    }
    return initialRides;
  });

  // ── Profil de l'utilisateur actif ────────────────────────
  const [userProfile, setUserProfile] = useState(() => {
    const stored = localStorage.getItem("campus_user_profile");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Erreur de lecture de localStorage for profile:", e);
      }
    }
    return { name: "", matricule: "" };
  });

  // Sauvegarder le profil dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem("campus_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // ── Toast de notification ───────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  };

  // ── Action : publier un nouveau trajet ──────────────────
  const addRide = (rideData) => {
    const driverNameNormalized = rideData.driverName.trim();

    // 1. Un utilisateur ne peut pas etre chauffeur d'un trajet et passager d'un autre a la meme periode
    const isPassengerAtSameTime = rides.some((r) =>
      r.passengers.some((p) => p.toLowerCase() === driverNameNormalized.toLowerCase()) &&
      isSamePeriod(r.departureTime, rideData.departureTime)
    );
    if (isPassengerAtSameTime) {
      return {
        success: false,
        errorMsg: "Vous avez deja reserve un trajet en tant que passager a la meme periode."
      };
    }

    // 2. Un chauffeur ne peut pas proposer deux trajets a la meme periode
    const isDriverAtSameTime = rides.some((r) =>
      r.driverName.toLowerCase() === driverNameNormalized.toLowerCase() &&
      isSamePeriod(r.departureTime, rideData.departureTime)
    );
    if (isDriverAtSameTime) {
      return {
        success: false,
        errorMsg: "Vous proposez deja un autre trajet a la meme periode."
      };
    }

    // Calcul de l'ID unique numerote de 1 a N
    const maxId = rides.reduce((max, r) => Math.max(max, parseInt(r.id) || 0), 0);
    const newRideId = (maxId + 1).toString();

    const newRide = {
      ...rideData,
      driverName: driverNameNormalized,
      id: newRideId,
      passengers: [],
      availableSeats: Number(rideData.availableSeats),
      price: Number(rideData.price),
    };
    
    setRides((prev) => {
      const updated = [newRide, ...prev];
      localStorage.setItem("campus_rides_v2", JSON.stringify(updated));
      return updated;
    });
    
    return { success: true, ride: newRide };
  };

  // ── Action : réserver une place ─────────────────────────
  const bookRide = (rideId, passengerName) => {
    let success = false;
    let errorMsg = "";
    const nameTrimmed = passengerName.trim();

    setRides((prev) => {
      const rideToBook = prev.find((r) => r.id === rideId);
      
      if (!rideToBook) {
        errorMsg = "Trajet introuvable.";
        return prev;
      }

      // 1. Un utilisateur ne peut pas etre chauffeur et passager du meme trajet
      if (rideToBook.driverName.toLowerCase() === nameTrimmed.toLowerCase()) {
        errorMsg = "Vous ne pouvez pas reserver une place sur votre propre trajet.";
        return prev;
      }

      // 2. Un utilisateur ne peut pas etre chauffeur d'un trajet et passager d'un autre a la meme periode
      const isDriverAtSameTime = prev.some((r) =>
        r.driverName.toLowerCase() === nameTrimmed.toLowerCase() &&
        isSamePeriod(r.departureTime, rideToBook.departureTime)
      );
      if (isDriverAtSameTime) {
        errorMsg = "Vous conduisez deja un trajet a la meme periode.";
        return prev;
      }

      // 3. Un utilisateur ne peut pas reserver deux trajets differents a la meme periode
      const isPassengerAtSameTime = prev.some((r) =>
        r.id !== rideId &&
        r.passengers.some((p) => p.toLowerCase() === nameTrimmed.toLowerCase()) &&
        isSamePeriod(r.departureTime, rideToBook.departureTime)
      );
      if (isPassengerAtSameTime) {
        errorMsg = "Vous avez deja une reservation pour un autre trajet a la meme periode.";
        return prev;
      }

      // 4. Securite anti-surreservation
      if (rideToBook.availableSeats <= 0) {
        errorMsg = "Ce trajet est complet. Aucune place disponible.";
        return prev;
      }

      // 5. Securite anti-doublon sur le meme trajet
      const alreadyRegistered = rideToBook.passengers.some(
        (p) => p.toLowerCase() === nameTrimmed.toLowerCase()
      );
      if (alreadyRegistered) {
        errorMsg = "Vous etes deja inscrit sur ce trajet.";
        return prev;
      }

      // Tout est valide
      success = true;
      const updated = prev.map((ride) => {
        if (ride.id !== rideId) return ride;
        return {
          ...ride,
          availableSeats: ride.availableSeats - 1,
          passengers: [...ride.passengers, nameTrimmed],
        };
      });

      localStorage.setItem("campus_rides_v2", JSON.stringify(updated));
      return updated;
    });

    return { success, errorMsg };
  };

  // ── Action : annuler une réservation ────────────────────
  const cancelBooking = (rideId, passengerName) => {
    let success = false;
    let errorMsg = "";
    const nameTrimmed = passengerName.trim();

    setRides((prev) => {
      const rideToCancel = prev.find((r) => r.id === rideId);
      
      if (!rideToCancel) {
        errorMsg = "Trajet introuvable.";
        return prev;
      }

      const isRegistered = rideToCancel.passengers.some(
        (p) => p.toLowerCase() === nameTrimmed.toLowerCase()
      );
      if (!isRegistered) {
        errorMsg = "Ce passager n'est pas inscrit sur ce trajet.";
        return prev;
      }

      success = true;
      const updated = prev.map((ride) => {
        if (ride.id !== rideId) return ride;
        return {
          ...ride,
          availableSeats: ride.availableSeats + 1,
          passengers: ride.passengers.filter(
            (p) => p.toLowerCase() !== nameTrimmed.toLowerCase()
          ),
        };
      });

      localStorage.setItem("campus_rides_v2", JSON.stringify(updated));
      return updated;
    });

    return { success, errorMsg };
  };

  // ── Action : annuler un trajet complet (conducteur) ─────
  const cancelRide = (rideId) => {
    let success = false;
    let errorMsg = "";

    setRides((prev) => {
      const rideToCancel = prev.find((r) => r.id === rideId);
      if (!rideToCancel) {
        errorMsg = "Trajet introuvable.";
        return prev;
      }
      success = true;
      const updated = prev.filter((r) => r.id !== rideId);
      localStorage.setItem("campus_rides_v2", JSON.stringify(updated));
      return updated;
    });

    return { success, errorMsg };
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        rides,
        addRide,
        bookRide,
        cancelBooking,
        cancelRide,
        userProfile,
        setUserProfile,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
