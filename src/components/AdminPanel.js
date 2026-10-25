import React, { useEffect, useState } from "react";
import { fetchBookings, fetchExhibitions } from "../api";

const AdminPanel = () => {
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
      <h1>Admin Panel</h1>
      <section>
        <h2>Manage Exhibitions</h2>
        <ul>
          {exhibitions.map((exhibition) => (
            <li key={exhibition.id}>{exhibition.name}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Manage Bookings</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>{booking.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
