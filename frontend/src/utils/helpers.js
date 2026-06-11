/**
 * Formate une date ISO en chaîne lisible pour l'affichage du départ.
 * Ex: "Jeu. 12 juin à 07:30"
 */
export function formatDepartureTime(isoString) {
  const date = new Date(isoString);
  const day = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" });
  const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${day} à ${time}`;
}

/**
 * Valide les champs du formulaire de publication de trajet.
 * Retourne un objet d'erreurs (vide si tout est valide).
 */
export function validateRideForm(form) {
  const errors = {};

  if (!form.driverName || !form.driverName.trim()) {
    errors.driverName = "Le nom du conducteur est requis.";
  }
  if (!form.origin || !form.origin.trim()) {
    errors.origin = "Le lieu de départ est requis.";
  }
  if (!form.destination || !form.destination.trim()) {
    errors.destination = "La destination est requise.";
  }
  if (!form.departureTime) {
    errors.departureTime = "La date et l'heure de départ sont requises.";
  }
  if (!form.availableSeats || Number(form.availableSeats) < 1) {
    errors.availableSeats = "Au moins 1 place est requise.";
  }
  if (form.price === "" || form.price === undefined || Number(form.price) < 0) {
    errors.price = "Le prix doit être 0 ou plus.";
  }

  return errors;
}
