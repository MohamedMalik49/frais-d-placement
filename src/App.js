
import React, { useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyBXfliSOf6dxFuJZTKxRdL_Vpwsld5rvvs";

export default function App() {
  const [form, setForm] = useState({
    date: "",
    depart: "",
    arrivee: "",
    kilometres: "",
    peage: "",
    trainAvion: "",
    autresFrais: ""
  });

  const [historique, setHistorique] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const nouvelItem = { ...form, id: Date.now() };
    setHistorique([nouvelItem, ...historique]);
    setForm({
      date: "",
      depart: "",
      arrivee: "",
      kilometres: "",
      peage: "",
      trainAvion: "",
      autresFrais: ""
    });
  };

  const calculateDistance = async () => {
    const origin = encodeURIComponent(form.depart);
    const destination = encodeURIComponent(form.arrivee);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.rows[0].elements[0].status === "OK") {
        const distanceMeters = data.rows[0].elements[0].distance.value;
        const distanceKm = (distanceMeters / 1000).toFixed(1);
        const estimatedPeage = (distanceKm * 0.09).toFixed(2);
        setForm({
          ...form,
          kilometres: distanceKm,
          peage: estimatedPeage
        });
      } else {
        alert("Impossible de calculer la distance.");
      }
    } catch (error) {
      alert("Erreur lors de la récupération des données Google Maps.");
    }
  };

  const totalKilometres = historique.reduce((sum, item) => sum + Number(item.kilometres || 0), 0);
  const totalPeage = historique.reduce((sum, item) => sum + Number(item.peage || 0), 0);
  const totalTrainAvion = historique.reduce((sum, item) => sum + Number(item.trainAvion || 0), 0);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Ajouter un déplacement</h2>
      <input name="date" value={form.date} onChange={handleChange} placeholder="Date du déplacement" /><br /><br />
      <input name="depart" value={form.depart} onChange={handleChange} placeholder="Lieu de départ" /><br /><br />
      <input name="arrivee" value={form.arrivee} onChange={handleChange} placeholder="Lieu d'arrivée" /><br /><br />
      <input name="kilometres" value={form.kilometres} onChange={handleChange} placeholder="Kilomètres" />
      <input name="peage" value={form.peage} onChange={handleChange} placeholder="Péage (€)" />
      <button onClick={calculateDistance}>Calculer automatiquement</button><br /><br />
      <input name="trainAvion" value={form.trainAvion} onChange={handleChange} placeholder="Frais train/avion (€)" /><br /><br />
      <textarea name="autresFrais" value={form.autresFrais} onChange={handleChange} placeholder="Autres frais" /><br /><br />
      <button onClick={handleSubmit}>Ajouter</button>

      <h3>Historique</h3>
      {historique.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
          <p><strong>{item.date}</strong> : {item.depart} → {item.arrivee}</p>
          <p>Km : {item.kilometres} - Péage : {item.peage} € - Train/Avion : {item.trainAvion} €</p>
          <p>Autres frais : {item.autresFrais}</p>
        </div>
      ))}

      <h4>Totaux</h4>
      <p>Kilomètres : {totalKilometres} km</p>
      <p>Péage : {totalPeage} €</p>
      <p>Train/Avion : {totalTrainAvion} €</p>
    </div>
  );
}
