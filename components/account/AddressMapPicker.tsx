'use client';

import 'leaflet/dist/leaflet.css';
import {useEffect, useRef} from 'react';
import type {Map as LeafletMap, Marker} from 'leaflet';

type Point = {lat: number; lng: number};
const TBILISI: Point = {lat: 41.7151, lng: 44.8271};

/** OpenStreetMap with a draggable pin; tap the map or drag the pin to choose the exact spot. */
export default function AddressMapPicker({value, onChange, locateLabel}: {value: Point | null; onChange: (point: Point) => void; locateLabel: string}) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const initial = useRef(value);

  useEffect(() => {
    let cancelled = false;
    import('leaflet').then(({default: L}) => {
      if (cancelled || !holder.current || map.current) {
        return;
      }
      const start = initial.current ?? TBILISI;
      const leafletMap = L.map(holder.current).setView([start.lat, start.lng], initial.current ? 17 : 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(leafletMap);
      // A CSS pin instead of Leaflet's default PNG icon (its image paths break under bundlers).
      const icon = L.divIcon({className: 'address-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 30]});
      const pin = L.marker([start.lat, start.lng], {draggable: true, icon, opacity: initial.current ? 1 : 0.5}).addTo(leafletMap);
      const choose = (point: Point) => {
        pin.setLatLng([point.lat, point.lng]).setOpacity(1);
        onChangeRef.current(point);
      };
      pin.on('dragend', () => choose(pin.getLatLng()));
      leafletMap.on('click', (event) => choose(event.latlng));
      map.current = leafletMap;
      marker.current = pin;
    });

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  function locate() {
    navigator.geolocation?.getCurrentPosition((position) => {
      const point = {lat: position.coords.latitude, lng: position.coords.longitude};
      marker.current?.setLatLng([point.lat, point.lng]).setOpacity(1);
      map.current?.setView([point.lat, point.lng], 17);
      onChangeRef.current(point);
    });
  }

  return (
    <div className="address-map">
      <div ref={holder} className="address-map__canvas" />
      <button type="button" className="account-btn account-btn--ghost address-map__locate" onClick={locate}>
        <i className="fa-regular fa-location-crosshairs" /> {locateLabel}
      </button>
    </div>
  );
}
