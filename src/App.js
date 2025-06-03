
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const GOOGLE_MAPS_API_KEY = "AIzaSyBXfliSOf6dxFuJZTKxRdL_Vpwsld5rvvs";

export default function FraisDeplacement() {
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
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Ajouter un déplacement</h2>
          <Input name="date" value={form.date} onChange={handleChange} placeholder="Date du déplacement" />
          <Input name="depart" value={form.depart} onChange={handleChange} placeholder="Lieu de départ" />
          <Input name="arrivee" value={form.arrivee} onChange={handleChange} placeholder="Lieu d'arrivée" />
          <div className="flex gap-2 flex-wrap">
            <Input name="kilometres" value={form.kilometres} onChange={handleChange} placeholder="Nombre de kilomètres" />
            <Input name="peage" value={form.peage} onChange={handleChange} placeholder="Frais de péage (€)" />
            <Button onClick={calculateDistance}>Calculer automatiquement</Button>
          </div>
          <Input name="trainAvion" value={form.trainAvion} onChange={handleChange} placeholder="Frais de train ou avion (€)" />
          <Textarea name="autresFrais" value={form.autresFrais} onChange={handleChange} placeholder="Autres frais (repas, parking, etc.)" />
          <Button onClick={handleSubmit}>Ajouter</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Historique des déplacements</h2>
        {historique.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <p><strong>Date :</strong> {item.date}</p>
              <p><strong>De :</strong> {item.depart} <strong>à</strong> {item.arrivee}</p>
              <p><strong>Km :</strong> {item.kilometres} km</p>
              <p><strong>Péage :</strong> {item.peage} €</p>
              <p><strong>Train/Avion :</strong> {item.trainAvion} €</p>
              <p><strong>Autres frais :</strong> {item.autresFrais}</p>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Totaux</h3>
            <p><strong>Total kilomètres :</strong> {totalKilometres} km</p>
            <p><strong>Total péages :</strong> {totalPeage} €</p>
            <p><strong>Total train/avion :</strong> {totalTrainAvion} €</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
