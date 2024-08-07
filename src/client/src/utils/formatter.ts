import axios from 'axios';

export const errorParser = (error: any): string => {

  const errMsg =
    error?.response?.data?.message ||
    error?.response?.statusText ||
    error?.message;
  if (
    errMsg?.includes("timeout") ||
    errMsg?.includes("Network Error") ||
    errMsg?.includes("timed out")
  ) {
    return "Request timeout. Please Check your network status and try again.";
  } else if (errMsg?.includes("jwt")) {
    return "Your session has expired, relogin into your account";
  } else if (errMsg?.includes("429")) {
    return "We are currently experiencing high traffic and won't be able to process your request, please checkback-in in the next 5 minutes";
  } else {
    return errMsg || "An error occurred.";
  }
};

export const getColonTimeFromDate = (date: Date | null): string | undefined => {
  return date?.toTimeString().slice(0, 8);
};


export const Countries =  [
  { name: 'Nigeria', code: 'NG', domain: '+234' },
  { name: 'United States', code: 'US', domain: '+1' },
  { name: 'United Kingdom', code: 'GB', domain: '+44' },
  { name: 'Canada', code: 'CA', domain: '+1' },
  { name: 'Australia', code: 'AU', domain: '+61' },
  { name: 'India', code: 'IN', domain: '+91' },
  { name: 'Germany', code: 'DE', domain: '+49' },
  { name: 'France', code: 'FR', domain: '+33' },
  { name: 'Italy', code: 'IT', domain: '+39' },
  { name: 'Spain', code: 'ES', domain: '+34' },
  { name: 'Brazil', code: 'BR', domain: '+55' },
  { name: 'Mexico', code: 'MX', domain: '+52' },
  { name: 'South Africa', code: 'ZA', domain: '+27' },
  { name: 'China', code: 'CN', domain: '+86' },
  { name: 'Japan', code: 'JP', domain: '+81' },
  { name: 'Russia', code: 'RU', domain: '+7' },
  { name: 'South Korea', code: 'KR', domain: '+82' },
  { name: 'Argentina', code: 'AR', domain: '+54' },
  { name: 'Colombia', code: 'CO', domain: '+57' },
  { name: 'Kenya', code: 'KE', domain: '+254' },
  { name: 'Egypt', code: 'EG', domain: '+20' },
  { name: 'Saudi Arabia', code: 'SA', domain: '+966' },
  { name: 'Turkey', code: 'TR', domain: '+90' },
  { name: 'Indonesia', code: 'ID', domain: '+62' },
  { name: 'Pakistan', code: 'PK', domain: '+92' },
  { name: 'Bangladesh', code: 'BD', domain: '+880' },
  { name: 'Vietnam', code: 'VN', domain: '+84' },
  { name: 'Philippines', code: 'PH', domain: '+63' },
  { name: 'Thailand', code: 'TH', domain: '+66' },
  { name: 'Malaysia', code: 'MY', domain: '+60' },
  { name: 'Singapore', code: 'SG', domain: '+65' },
  { name: 'United Arab Emirates', code: 'AE', domain: '+971' },
  { name: 'Israel', code: 'IL', domain: '+972' },
  { name: 'Sweden', code: 'SE', domain: '+46' },
  { name: 'Norway', code: 'NO', domain: '+47' },
  { name: 'Denmark', code: 'DK', domain: '+45' },
  { name: 'Finland', code: 'FI', domain: '+358' },
  { name: 'Netherlands', code: 'NL', domain: '+31' },
  { name: 'Belgium', code: 'BE', domain: '+32' },
  { name: 'Switzerland', code: 'CH', domain: '+41' },
  { name: 'Austria', code: 'AT', domain: '+43' },
  { name: 'Poland', code: 'PL', domain: '+48' },
  { name: 'Czech Republic', code: 'CZ', domain: '+420' },
  { name: 'Hungary', code: 'HU', domain: '+36' },
  { name: 'Portugal', code: 'PT', domain: '+351' },
  { name: 'Greece', code: 'GR', domain: '+30' },
  { name: 'Romania', code: 'RO', domain: '+40' },
  { name: 'Ukraine', code: 'UA', domain: '+380' },
  { name: 'Chile', code: 'CL', domain: '+56' },
  { name: 'Peru', code: 'PE', domain: '+51' },
  { name: 'Venezuela', code: 'VE', domain: '+58' },
  { name: 'New Zealand', code: 'NZ', domain: '+64' },
  { name: 'Ireland', code: 'IE', domain: '+353' }
];

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

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
  return Math.round(d);
}



const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export const getAddressFromCoordinates = async (lat: number, lng: number, apiKey: string): Promise<string> => {
  try {
    const response = await axios.get(GEOCODE_API_URL, {
      params: {
        latlng: `${lat},${lng}`,
        key: apiKey
      }
    });

    if (response.data.status === 'OK') {
      const results = response.data.results;
      if (results.length > 0) {
        return results[0].formatted_address;
      }
    }
    throw new Error('No address found');
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};


export function extractTime(dateString:string) {
	const date = new Date(dateString);
	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());
	return `${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(val:number) {
	return val.toString().padStart(2, "0");
}

export function getAcronym(input: string): string {
  const words = input.split(' ');
  const acronym = words.map(word => word[0].toUpperCase()).join('');
  return acronym;
}