import axios from "axios";

const BASE_URL = "https://6adc5242fa5e73d4ab2d553a.mockapi.io";

export const fetchBookings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Bookings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const fetchExhibitions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Exhibitions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Bookings`, bookingData);
    try {
      const notification = await fetch('/api/telegram/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.data),
      })
      if (!notification.ok) throw new Error(`Telegram API returned ${notification.status}`)
    } catch (notificationError) {
      console.error('Booking saved, but Telegram notification failed:', notificationError)
    }
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const createExhibition = async (exhibitionData) => {
  const response = await axios.post(`${BASE_URL}/Exhibitions`, exhibitionData);
  return response.data;
};

export const updateExhibition = async (id, exhibitionData) => {
  const response = await axios.put(`${BASE_URL}/Exhibitions/${id}`, exhibitionData);
  return response.data;
};

export const removeExhibition = async (id) => {
  await axios.delete(`${BASE_URL}/Exhibitions/${id}`);
};

export const removeBooking = async (id) => {
  await axios.delete(`${BASE_URL}/Bookings/${id}`);
};
