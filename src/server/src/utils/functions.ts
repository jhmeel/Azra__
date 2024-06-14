export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Helper function to calculate the distance between two coordinates
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export const base64ToFile = (base64: string, filename = "image.jpg"): File => {
  // Convert base64 string to Blob
  const byteCharacters = atob(base64.split(",")[1]); // Remove the base64 header and decode the string
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" }); // Change the MIME type if necessary

  // Create a File object from the Blob
  const file = new File([blob], filename, { type: "image/jpeg" });

  return file;
};
