import React, { useEffect, useState } from "react";
import { fetchBookings, fetchExhibitions } from "../api";

const LandingPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const exhibitionsData = await fetchExhibitions();
      const bookingsData = await fetchBookings();
      setExhibitions(exhibitionsData);
      setBookings(bookingsData);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to the Museum</h1>
      <section>
        <h2>Exhibitions</h2>
        <ul>
          {exhibitions.map((exhibition) => (
            <li key={exhibition.id}>{exhibition.name}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Bookings</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>{booking.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default LandingPage;
