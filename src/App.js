
import React, { useState } from "react";

function App() {
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
    setForm({ date: "", depart: "", arrivee: "", kilometres: "", peage: "", trainAvion: "", autresFrais: "" });
  };

  const simulateCalculation = () => {
    const fakeKm = 120;
    const fakePeage = 17.8;
    setForm({
      ...form,
      kilometres: fakeKm.toString(),
      peage: fakePeage.toString()
    });
  };

  const totalKilometres = historique.reduce((sum, item) => sum + Number(item.kilometres || 0), 0);
  const totalPeage = historique.reduce((sum, item) => sum + Number(item.peage || 0), 0);
  const totalTrainAvion = historique.reduce((sum, item) => sum + Number(item.trainAvion || 0), 0);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h2>Ajouter un déplacement</h2>
      <input name="date" value={form.date} onChange={handleChange} placeholder="Date" /><br/>
      <input name="depart" value={form.depart} onChange={handleChange} placeholder="Départ" /><br/>
      <input name="arrivee" value={form.arrivee} onChange={handleChange} placeholder="Arrivée" /><br/>
      <input name="kilometres" value={form.kilometres} onChange={handleChange} placeholder="Km" />
      <input name="peage" value={form.peage} onChange={handleChange} placeholder="Péage €" />
      <button onClick={simulateCalculation}>Calculer automatiquement</button><br/>
      <input name="trainAvion" value={form.trainAvion} onChange={handleChange} placeholder="Train/Avion €" /><br/>
      <textarea name="autresFrais" value={form.autresFrais} onChange={handleChange} placeholder="Autres frais" /><br/>
      <button onClick={handleSubmit}>Ajouter</button>

      <h3>Historique</h3>
      {historique.map(item => (
        <div key={item.id} style={{ marginBottom: 10, borderBottom: "1px solid #ccc" }}>
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

export default App;
