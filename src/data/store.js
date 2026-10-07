const MEDICINES_KEY = "pharmaguard_medicines";
const ALERTS_KEY = "pharmaguard_alerts";
const SHIPMENTS_KEY = "pharmaguard_shipments";

const defaultMedicines = [
  {
    id: 1,
    batch: "PCM24031",
    name: "Paracetamol 500mg",
    manufacturer: "Cipla Ltd.",
    manufacturing: "12 Dec 2025",
    expiry: "12 Dec 2027",
    quantity: 500,
    status: "Genuine",
  },
  {
    id: 2,
    batch: "AMX24018",
    name: "Amoxicillin 250mg",
    manufacturer: "Sun Pharma",
    manufacturing: "05 Aug 2025",
    expiry: "05 Aug 2027",
    quantity: 300,
    status: "Genuine",
  },
  {
    id: 3,
    batch: "MET24044",
    name: "Metformin 500mg",
    manufacturer: "Mankind Pharma",
    manufacturing: "21 Nov 2025",
    expiry: "21 Nov 2028",
    quantity: 750,
    status: "Genuine",
  },
  {
    id: 4,
    batch: "AZT24009",
    name: "Azithromycin 500mg",
    manufacturer: "Dr. Reddy's",
    manufacturing: "09 Aug 2024",
    expiry: "09 Aug 2026",
    quantity: 200,
    status: "Expired",
  },
];

const defaultAlerts = [
  {
    id: 1,
    type: "Critical",
    title: "Potential counterfeit batch detected",
    description:
      "Batch PCM24029 does not match the registered manufacturer record.",
    batch: "PCM24029",
    location: "Chennai Distribution Centre",
    time: "10 minutes ago",
    icon: "critical",
  },
  {
    id: 2,
    type: "Warning",
    title: "Expired medicine identified",
    description:
      "An expired pharmaceutical batch was detected during verification.",
    batch: "AZT24009",
    location: "Apollo Pharmacy - Chennai",
    time: "1 hour ago",
    icon: "warning",
  },
];

export function getMedicines() {
  const saved = localStorage.getItem(MEDICINES_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    MEDICINES_KEY,
    JSON.stringify(defaultMedicines)
  );

  return defaultMedicines;
}

export function saveMedicines(medicines) {
  localStorage.setItem(
    MEDICINES_KEY,
    JSON.stringify(medicines)
  );
}

export function getAlerts() {
  const saved = localStorage.getItem(ALERTS_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    ALERTS_KEY,
    JSON.stringify(defaultAlerts)
  );

  return defaultAlerts;
}

export function saveAlerts(alerts) {
  localStorage.setItem(
    ALERTS_KEY,
    JSON.stringify(alerts)
  );
}

const defaultShipments = [
  {
    id: "SHP-26081",
    batch: "PCM24031",
    medicine: "Paracetamol 500mg",
    origin: "Cipla Manufacturing Unit",
    destination: "Apollo Distribution Centre",
    status: "In Transit",
    updated: "14 Aug 2026, 10:42 AM",
  },
  {
    id: "SHP-26079",
    batch: "AMX24018",
    medicine: "Amoxicillin 250mg",
    origin: "Sun Pharma",
    destination: "Chennai Central Warehouse",
    status: "Delivered",
    updated: "13 Aug 2026, 04:18 PM",
  },
  {
    id: "SHP-26076",
    batch: "MET24044",
    medicine: "Metformin 500mg",
    origin: "Mankind Pharma",
    destination: "MedPlus Distribution Centre",
    status: "In Transit",
    updated: "13 Aug 2026, 11:25 AM",
  },
];

export function getShipments() {
  const saved = localStorage.getItem(SHIPMENTS_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    SHIPMENTS_KEY,
    JSON.stringify(defaultShipments)
  );

  return defaultShipments;
}

export function saveShipments(shipments) {
  localStorage.setItem(
    SHIPMENTS_KEY,
    JSON.stringify(shipments)
  );
}

export function resetMedicines() {
  localStorage.removeItem(MEDICINES_KEY);
  window.location.reload();
}
