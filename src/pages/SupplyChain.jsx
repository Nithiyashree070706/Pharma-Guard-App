import { useEffect, useState } from "react";

import {
  Factory,
  Warehouse,
  Truck,
  Store,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ==========================================
// FIX LEAFLET DEFAULT MARKER ICON
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ==========================================
// SUPPLY CHAIN COMPONENT
// ==========================================

function SupplyChain() {

  const [shipments, setShipments] = useState([]);

  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [selectedShipment, setSelectedShipment] =
    useState(null);


  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] = useState({
    batch: "",
    origin: "",
    destination: "",
  });


  // ==========================================
  // DEMO MAP LOCATIONS
  // ==========================================

  const demoLocations = {

    factory: [13.0827, 80.2707],

    warehouse: [13.0604, 80.2496],

    current: [12.9716, 77.5946],

    destination: [12.9352, 77.6245],

  };


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    loadShipments();

    loadMedicines();

  }, []);


  // ==========================================
  // LOAD SHIPMENTS
  // ==========================================

  const loadShipments = async () => {

    try {

      const response = await fetch(
        "https://pharma-guard-app.onrender.com/api/shipments"
      );

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to load shipments"
        );

      }


      setShipments(data);


      if (data.length > 0) {

        setSelectedShipment(data[0]);

      }

    } catch (error) {

      console.error(
        "Shipment loading error:",
        error
      );

    }

  };


  // ==========================================
  // LOAD MEDICINES
  // ==========================================

  const loadMedicines = async () => {

    try {

      const response = await fetch(
        "https://pharma-guard-app.onrender.com/api/medicines"
      );

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to load medicines"
        );

      }


      setMedicines(data);

    } catch (error) {

      console.error(
        "Medicine loading error:",
        error
      );

    }

  };


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };


  // ==========================================
  // ADD SHIPMENT
  // ==========================================

  const addShipment = async (e) => {

    e.preventDefault();


    if (
      !form.batch ||
      !form.origin ||
      !form.destination
    ) {

      alert(
        "Please fill all shipment fields."
      );

      return;

    }


    const medicine =
      medicines.find(
        (item) =>
          item.batch === form.batch
      );


    if (!medicine) {

      alert(
        "Medicine batch not found in the registry."
      );

      return;

    }


    try {

      const response = await fetch(
        "https://pharma-guard-app.onrender.com/api/shipments",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            batch:
              medicine.batch,

            medicine:
              medicine.name,

            origin:
              form.origin,

            destination:
              form.destination,

          }),

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to create shipment"
        );

      }


      setShipments((prev) => [

        data,

        ...prev,

      ]);


      setSelectedShipment(data);


      setForm({

        batch: "",
        origin: "",
        destination: "",

      });


      setShowForm(false);


      alert(
        "Shipment created successfully."
      );

    } catch (error) {

      console.error(
        "Shipment creation error:",
        error
      );


      alert(error.message);

    }

  };


  // ==========================================
  // UPDATE SHIPMENT STATUS
  // ==========================================

  const updateShipmentStatus = async (
    newStatus
  ) => {

    if (!selectedShipment) {

      alert(
        "Please select a shipment first."
      );

      return;

    }


    try {

      const response = await fetch(

        `https://pharma-guard-app.onrender.com/api/shipments/${selectedShipment.id}/status`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            status: newStatus,

          }),

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.error ||
          "Failed to update shipment status."

        );

      }


      // Update shipment list

      setShipments((prev) =>

        prev.map((shipment) =>

          shipment.id === data.id

            ? data

            : shipment

        )

      );


      // Update selected shipment

      setSelectedShipment(data);


    } catch (error) {

      console.error(
        "Status update error:",
        error
      );


      alert(error.message);

    }

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredShipments =
    shipments.filter(

      (shipment) =>

        `${shipment.id}
        ${shipment.batch}
        ${shipment.medicine}
        ${shipment.origin}
        ${shipment.destination}`

          .toLowerCase()

          .includes(
            search.toLowerCase()
          )

    );


  // ==========================================
  // GET MAP LOCATIONS
  // ==========================================

  const getMapLocations =
    (shipment) => {

      if (!shipment) {

        return demoLocations;

      }


      // -------------------------------
      // IN TRANSIT
      // -------------------------------

      if (
        shipment.status ===
        "In Transit"
      ) {

        return {

          factory:
            demoLocations.factory,

          warehouse:
            demoLocations.warehouse,

          current:
            demoLocations.current,

          destination:
            demoLocations.destination,

        };

      }


      // -------------------------------
      // DELAYED
      // -------------------------------

      if (
        shipment.status ===
        "Delayed"
      ) {

        return {

          factory:
            demoLocations.factory,

          warehouse:
            demoLocations.warehouse,

          current:
            demoLocations.warehouse,

          destination:
            demoLocations.destination,

        };

      }


      // -------------------------------
      // DELIVERED
      // -------------------------------

      if (
        shipment.status ===
        "Delivered"
      ) {

        return {

          factory:
            demoLocations.factory,

          warehouse:
            demoLocations.warehouse,

          current:
            demoLocations.destination,

          destination:
            demoLocations.destination,

        };

      }


      return demoLocations;

    };


  const mapLocations =
    getMapLocations(
      selectedShipment
    );


  const routeCoordinates = [

    mapLocations.factory,

    mapLocations.warehouse,

    mapLocations.current,

    mapLocations.destination,

  ];


  // ==========================================
  // CURRENT LOCATION NAME
  // ==========================================

  const getCurrentLocationName = () => {

    if (!selectedShipment) {

      return "Bangalore Distribution Centre";

    }


    if (
      selectedShipment.status ===
      "Delivered"
    ) {

      return (
        selectedShipment.destination ||
        "Bangalore Pharmacy"
      );

    }


    if (
      selectedShipment.status ===
      "Delayed"
    ) {

      return "Chennai Central Warehouse";

    }


    return "Bangalore Distribution Centre";

  };


  // ==========================================
  // CURRENT COORDINATES
  // ==========================================

  const getCurrentCoordinates = () => {

    if (!selectedShipment) {

      return {
        latitude: "12.9716",
        longitude: "77.5946",
      };

    }


    if (
      selectedShipment.status ===
      "Delivered"
    ) {

      return {

        latitude:
          demoLocations.destination[0],

        longitude:
          demoLocations.destination[1],

      };

    }


    if (
      selectedShipment.status ===
      "Delayed"
    ) {

      return {

        latitude:
          demoLocations.warehouse[0],

        longitude:
          demoLocations.warehouse[1],

      };

    }


    return {

      latitude:
        demoLocations.current[0],

      longitude:
        demoLocations.current[1],

    };

  };


  const currentCoordinates =
    getCurrentCoordinates();


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="pg-app">


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="pg-sidebar">


        <div className="pg-brand">

          <div className="pg-logo">
            PG
          </div>


          <div>

            <strong>
              PharmaGuard
            </strong>

            <span>
              Medicine Security
            </span>

          </div>

        </div>


        <div className="pg-menu-title">
          WORKSPACE
        </div>


        <nav className="pg-navigation">


          <a
            href="/"
            className="pg-nav-link"
          >

            <span>▣</span>

            Dashboard

          </a>


          <a
            href="/medicines"
            className="pg-nav-link"
          >

            <span>✚</span>

            Medicine Registry

          </a>


          <a
            href="/supply-chain"
            className="pg-nav-link selected"
          >

            <Truck size={17} />

            Supply Chain

          </a>


          <a
            href="/verify"
            className="pg-nav-link"
          >

            <span>⌕</span>

            Verify Medicine

          </a>


          <a
            href="/alerts"
            className="pg-nav-link"
          >

            <span>!</span>

            Alerts

            <span className="pg-alert-count">
              3
            </span>

          </a>


          <a
            href="/reports"
            className="pg-nav-link"
          >

            <span>▤</span>

            Reports

          </a>


        </nav>


        <div className="pg-sidebar-footer">


          <a
            href="#"
            className="pg-nav-link"
          >

            <span>⚙</span>

            Settings

          </a>


          <div className="pg-system">

            <span className="online-dot"></span>


            <div>

              <strong>
                System operational
              </strong>

              <small>
                All services running
              </small>

            </div>

          </div>


        </div>


      </aside>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="pg-main">


        {/* ======================================
            HEADER
        ====================================== */}

        <header className="pg-topbar">


          <div>

            <div className="pg-breadcrumb">
              Workspace / Supply Chain
            </div>


            <h1>
              Supply Chain
            </h1>


            <p>
              Track pharmaceutical batches
              from factory to destination.
            </p>

          </div>


          <div className="pg-top-actions">


            <div className="pg-search">

              <MapPin size={15} />


              <input
                type="text"
                placeholder="Search shipment"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


          </div>


        </header>


        {/* ======================================
            SUMMARY
        ====================================== */}

        <section className="pg-summary">


          <div className="pg-summary-card">

            <div className="pg-summary-icon">

              <Truck size={18} />

            </div>


            <div>

              <span>
                Active shipments
              </span>


              <strong>

                {
                  shipments.filter(
                    (shipment) =>
                      shipment.status ===
                      "In Transit"
                  ).length
                }

              </strong>


              <small>
                Currently moving
              </small>

            </div>

          </div>


          <div className="pg-summary-card">

            <div className="pg-summary-icon verified">

              <CheckCircle2 size={18} />

            </div>


            <div>

              <span>
                Delivered
              </span>


              <strong>

                {
                  shipments.filter(
                    (shipment) =>
                      shipment.status ===
                      "Delivered"
                  ).length
                }

              </strong>


              <small>
                Delivered shipments
              </small>

            </div>

          </div>


          <div className="pg-summary-card">

            <div className="pg-summary-icon warning">

              <Clock3 size={18} />

            </div>


            <div>

              <span>
                Delayed
              </span>


              <strong>

                {
                  shipments.filter(
                    (shipment) =>
                      shipment.status ===
                      "Delayed"
                  ).length
                }

              </strong>


              <small>
                Needs monitoring
              </small>

            </div>

          </div>


          <div className="pg-summary-card">

            <div className="pg-summary-icon delivery">

              <MapPin size={18} />

            </div>


            <div>

              <span>
                Tracking locations
              </span>


              <strong>
                4
              </strong>


              <small>
                Factory to destination
              </small>

            </div>

          </div>


        </section>


        {/* ======================================
            SUPPLY CHAIN FLOW
        ====================================== */}

        <section className="pg-panel pg-flow-panel">


          <div className="pg-panel-header">


            <div>

              <span className="pg-section-label">
                SUPPLY CHAIN NETWORK
              </span>


              <h2>
                Medicine movement
              </h2>

            </div>


          </div>


          <div className="pg-flow">


            <div className="pg-flow-node">

              <div className="pg-flow-icon">

                <Factory size={22} />

              </div>


              <strong>
                Factory
              </strong>


              <small>
                Manufacturing
              </small>

            </div>


            <div className="pg-flow-line"></div>


            <div className="pg-flow-node">

              <div className="pg-flow-icon">

                <Warehouse size={22} />

              </div>


              <strong>
                Warehouse
              </strong>


              <small>
                Storage
              </small>

            </div>


            <div className="pg-flow-line"></div>


            <div className="pg-flow-node">

              <div className="pg-flow-icon">

                <Truck size={22} />

              </div>


              <strong>
                Distributor
              </strong>


              <small>
                Transportation
              </small>

            </div>


            <div className="pg-flow-line"></div>


            <div className="pg-flow-node">

              <div className="pg-flow-icon">

                <Store size={22} />

              </div>


              <strong>
                Destination
              </strong>


              <small>
                Pharmacy
              </small>

            </div>


          </div>


        </section>


        {/* ======================================
            LOCATION TRACKING
        ====================================== */}

        <section className="pg-panel location-tracking-panel">


          <div className="pg-panel-header">


            <div>

              <span className="pg-section-label">
                LOCATION TRACKING
              </span>


              <h2>
                Live Shipment Map
              </h2>


              <p className="tracking-subtitle">
                Track medicine movement from
                factory to destination.
              </p>

            </div>


            <div className="demo-location-badge">

              <MapPin size={15} />

              Demo Tracking

            </div>


          </div>


          {/* ====================================
              SELECT SHIPMENT
          ==================================== */}

          <div className="tracking-selector">


            <label>
              Select shipment
            </label>


            <select
              value={
                selectedShipment?.id || ""
              }
              onChange={(e) => {

                const shipment =
                  shipments.find(
                    (item) =>
                      item.id ===
                      e.target.value
                  );


                setSelectedShipment(
                  shipment || null
                );

              }}
            >

              <option value="">
                Select a shipment
              </option>


              {shipments.map(
                (shipment) => (

                  <option
                    key={
                      shipment.id
                    }
                    value={
                      shipment.id
                    }
                  >

                    {shipment.id}
                    {" — "}
                    {shipment.batch}
                    {" — "}
                    {shipment.medicine}

                  </option>

                )
              )}

            </select>


          </div>


          {/* ====================================
              SELECTED SHIPMENT
          ==================================== */}

          {selectedShipment && (

            <>

              {/* ==================================
                  STATUS CONTROL
              ================================== */}

              <div className="shipment-status-control">


                <div>

                  <label>
                    Shipment Status
                  </label>


                  <select

                    value={
                      selectedShipment.status ||
                      "In Transit"
                    }

                    onChange={(e) =>
                      updateShipmentStatus(
                        e.target.value
                      )
                    }

                  >

                    <option value="In Transit">
                      🚚 In Transit
                    </option>


                    <option value="Delayed">
                      ⚠️ Delayed
                    </option>


                    <option value="Delivered">
                      ✓ Delivered
                    </option>

                  </select>

                </div>


                <span className="status-help">

                  Updating the status changes
                  the simulated current location
                  on the map.

                </span>


              </div>


              {/* ==================================
                  SHIPMENT INFORMATION
              ================================== */}

              <div className="selected-shipment-info">


                <div>

                  <span>
                    BATCH
                  </span>


                  <strong>
                    {selectedShipment.batch}
                  </strong>

                </div>


                <div>

                  <span>
                    MEDICINE
                  </span>


                  <strong>
                    {selectedShipment.medicine}
                  </strong>

                </div>


                <div>

                  <span>
                    STATUS
                  </span>


                  <strong>
                    {selectedShipment.status}
                  </strong>

                </div>


                <div>

                  <span>
                    UPDATED
                  </span>


                  <strong>
                    {selectedShipment.updated}
                  </strong>

                </div>


              </div>


              {/* ==================================
                  MAP
              ================================== */}

              <div className="shipment-map">


                <MapContainer

                  center={
                    mapLocations.current
                  }

                  zoom={7}

                  scrollWheelZoom={true}

                  style={{
                    height: "500px",
                    width: "100%",
                  }}

                >


                  <TileLayer

                    attribution='&copy; OpenStreetMap contributors'

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                  />


                  {/* FACTORY */}

                  <Marker
                    position={
                      mapLocations.factory
                    }
                  >

                    <Popup>

                      <strong>
                        🏭 Factory
                      </strong>

                      <br />

                      {selectedShipment.origin ||
                        "Chennai Manufacturing Plant"}

                      <br />

                      <small>
                        Medicine manufactured
                      </small>

                    </Popup>

                  </Marker>


                  {/* WAREHOUSE */}

                  <Marker
                    position={
                      mapLocations.warehouse
                    }
                  >

                    <Popup>

                      <strong>
                        📦 Warehouse
                      </strong>

                      <br />

                      Chennai Central Warehouse

                      <br />

                      <small>
                        Medicine stored
                      </small>

                    </Popup>

                  </Marker>


                  {/* CURRENT LOCATION */}

                  <Marker
                    position={
                      mapLocations.current
                    }
                  >

                    <Popup>

                      <strong>
                        🚚 Current Location
                      </strong>

                      <br />

                      {getCurrentLocationName()}

                      <br />

                      <small>
                        Demo tracking location
                      </small>

                    </Popup>

                  </Marker>


                  {/* DESTINATION */}

                  <Marker
                    position={
                      mapLocations.destination
                    }
                  >

                    <Popup>

                      <strong>
                        🏥 Destination
                      </strong>

                      <br />

                      {selectedShipment.destination ||
                        "Bangalore Pharmacy"}

                      <br />

                      <small>
                        Final delivery point
                      </small>

                    </Popup>

                  </Marker>


                  {/* ROUTE */}

                  <Polyline

                    positions={
                      routeCoordinates
                    }

                    pathOptions={{
                      color: "#2563eb",
                      weight: 5,
                      opacity: 0.8,
                    }}

                  />


                </MapContainer>


              </div>


              {/* ==================================
                  MAP LEGEND
              ================================== */}

              <div className="map-legend">


                <div className="map-legend-item">

                  <span className="legend-dot factory-dot"></span>

                  <span>
                    Factory
                  </span>

                </div>


                <div className="map-legend-item">

                  <span className="legend-dot warehouse-dot"></span>

                  <span>
                    Warehouse
                  </span>

                </div>


                <div className="map-legend-item">

                  <span className="legend-dot current-dot"></span>

                  <span>
                    Current Location
                  </span>

                </div>


                <div className="map-legend-item">

                  <span className="legend-dot destination-dot"></span>

                  <span>
                    Destination
                  </span>

                </div>


              </div>


              {/* ==================================
                  CURRENT LOCATION INFORMATION
              ================================== */}

              <div className="tracking-location-info">


                <div className="location-info-icon">

                  <Navigation size={20} />

                </div>


                <div>

                  <span>
                    CURRENT DEMO LOCATION
                  </span>


                  <strong>
                    {getCurrentLocationName()}
                  </strong>


                  <p>
                    Simulated location for
                    project demonstration.
                  </p>

                </div>


                <div className="coordinates">


                  <span>
                    Latitude
                  </span>


                  <strong>
                    {currentCoordinates.latitude}
                  </strong>


                  <span>
                    Longitude
                  </span>


                  <strong>
                    {currentCoordinates.longitude}
                  </strong>


                </div>


              </div>


            </>

          )}


          {!selectedShipment && (

            <div className="tracking-empty">

              <MapPin size={25} />


              <strong>
                Select a shipment to view tracking
              </strong>


              <p>
                Select a shipment above to display
                its route on the map.
              </p>

            </div>

          )}


        </section>


        {/* ======================================
            SHIPMENT TABLE
        ====================================== */}

        <section className="pg-panel pg-shipment-panel">


          <div className="pg-panel-header">


            <div>

              <span className="pg-section-label">
                SHIPMENT REGISTER
              </span>


              <h2>
                Recent shipments
              </h2>

            </div>


            <button

              className="pg-panel-link pg-action-button"

              onClick={() =>
                setShowForm(true)
              }

            >

              + New Shipment

            </button>


          </div>


          <div className="pg-table-wrapper">


            <table className="pg-table">


              <thead>

                <tr>

                  <th>
                    Shipment
                  </th>

                  <th>
                    Batch
                  </th>

                  <th>
                    Medicine
                  </th>

                  <th>
                    Origin
                  </th>

                  <th>
                    Destination
                  </th>

                  <th>
                    Updated
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>


                {filteredShipments.length ===
                0 ? (

                  <tr>

                    <td

                      colSpan="7"

                      style={{
                        textAlign:
                          "center",

                        padding:
                          "25px",
                      }}

                    >

                      No shipments found.

                    </td>

                  </tr>

                ) : (

                  filteredShipments.map(
                    (shipment) => (

                      <tr
                        key={
                          shipment.id
                        }
                      >

                        <td>

                          <strong>
                            {shipment.id}
                          </strong>

                        </td>


                        <td>

                          <span className="pg-batch">

                            {shipment.batch}

                          </span>

                        </td>


                        <td>
                          {shipment.medicine}
                        </td>


                        <td>
                          {shipment.origin}
                        </td>


                        <td>
                          {shipment.destination}
                        </td>


                        <td>
                          {shipment.updated}
                        </td>


                        <td>

                          <span
                            className={
                              shipment.status ===
                              "Delivered"

                                ? "pg-status genuine"

                                : shipment.status ===
                                  "Delayed"

                                ? "pg-status expired"

                                : "pg-status"
                            }
                          >

                            {shipment.status}

                          </span>

                        </td>


                      </tr>

                    )
                  )

                )}


              </tbody>


            </table>


          </div>


        </section>


        {/* ======================================
            NEW SHIPMENT MODAL
        ====================================== */}

        {showForm && (

          <div className="modal-overlay">


            <div className="medicine-modal">


              <div className="modal-header">


                <div>

                  <h2>
                    New Shipment
                  </h2>


                  <p>
                    Create a shipment for a
                    registered medicine batch.
                  </p>

                </div>


                <button

                  className="close-button"

                  onClick={() =>
                    setShowForm(false)
                  }

                >

                  ×

                </button>


              </div>


              <form
                onSubmit={
                  addShipment
                }
              >


                <div className="form-grid">


                  <div className="form-field">


                    <label>
                      Medicine Batch
                    </label>


                    <select

                      name="batch"

                      value={
                        form.batch
                      }

                      onChange={
                        handleChange
                      }

                    >


                      <option value="">
                        Select registered batch
                      </option>


                      {medicines.map(
                        (medicine) => (

                          <option

                            key={
                              medicine.id
                            }

                            value={
                              medicine.batch
                            }

                          >

                            {medicine.batch}
                            {" — "}
                            {medicine.name}

                          </option>

                        )
                      )}


                    </select>


                  </div>


                  <div className="form-field">


                    <label>
                      Origin
                    </label>


                    <input

                      name="origin"

                      value={
                        form.origin
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="e.g. Chennai Manufacturing Plant"

                    />


                  </div>


                  <div className="form-field">


                    <label>
                      Destination
                    </label>


                    <input

                      name="destination"

                      value={
                        form.destination
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="e.g. Bangalore Pharmacy"

                    />


                  </div>


                </div>


                <div className="modal-actions">


                  <button

                    type="button"

                    className="cancel-button"

                    onClick={() =>
                      setShowForm(false)
                    }

                  >

                    Cancel

                  </button>


                  <button

                    type="submit"

                    className="primary-button"

                  >

                    Create Shipment

                  </button>


                </div>


              </form>


            </div>


          </div>

        )}


      </main>

    </div>

  );

}


export default SupplyChain;
