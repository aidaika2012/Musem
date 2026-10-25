const BASE_URL = "https://6adc5242fa5e73d4ab2d553a.mockapi.io";

export const fetchBookings = async () => {
  const response = await fetch(`${BASE_URL}/Bookings`);
  return response.json();
};

export const fetchExhibitions = async () => {
  const response = await fetch(`${BASE_URL}/Exhibitions`);
  return response.json();
};
