import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom pin icon — кара фон, алтын жиек
const museumIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="
      width:44px;height:44px;
      background:#1a1a1a;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 20px rgba(0,0,0,.35);
      border:3px solid #c8a96e;
      display:flex;align-items:center;justify-content:center;
    ">
      <span style="transform:rotate(45deg);font-size:18px;line-height:1;margin-top:-4px;margin-left:-1px;">
        🏛
      </span>
    </div>
  `,
  iconSize:    [44, 44],
  iconAnchor:  [22, 44],
  popupAnchor: [0, -50],
})

// Бишкек: Museum орноктогу болжолдуу координат
const MUSEUM_POS = [42.8746, 74.5698]

export default function MuseumMap({ height = '400px', className = '' }) {
  return (
    <div
      className={'rounded-3xl overflow-hidden ' + className}
      style={{ height, width: '100%' }}
    >
      <MapContainer
        center={MUSEUM_POS}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomControl position="bottomright" />

        <Marker position={MUSEUM_POS} icon={museumIcon}>
          <Popup offset={[0, -10]}>
            <div style={{ minWidth: 160, padding: '4px 2px' }}>
              <p style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 15, fontWeight: 600,
                color: '#1a1a1a', marginBottom: 4,
              }}>
                🏛 MUSEUM
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12, color: '#6b6b6b', lineHeight: 1.5,
              }}>
                Museum Avenue, 1<br />
                Bishkek, Kyrgyzstan
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11, color: '#c8a96e', marginTop: 6,
              }}>
                Tue–Fri 10:00–18:00 · Sat–Sun 10:00–19:00
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
