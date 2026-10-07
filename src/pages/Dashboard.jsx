import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Pill,
  Truck,
  ScanLine,
  Bell,
  FileText,
  Settings,
  Search,
  AlertTriangle,
  ArrowUpRight,
  PackageCheck,
} from "lucide-react";

function Sidebar({ alertCount }) {
  return (
    <aside className="pg-sidebar">

      <div className="pg-brand">
        <div className="pg-logo">PG</div>

        <div>
          <strong>PharmaGuard</strong>
          <span>Medicine Security</span>
        </div>
      </div>

      <div className="pg-menu-title">
        WORKSPACE
      </div>

      <nav className="pg-navigation">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `pg-nav-link ${isActive ? "selected" : ""}`
          }
        >
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>

        <NavLink
          to="/medicines"
          className="pg-nav-link"
        >
          <Pill size={17} />
          Medicine Registry
        </NavLink>

        <NavLink
          to="/supply-chain"
          className="pg-nav-link"
        >
          <Truck size={17} />
          Supply Chain
        </NavLink>

        <NavLink
          to="/verify"
          className="pg-nav-link"
        >
          <ScanLine size={17} />
          Verify Medicine
        </NavLink>

        <NavLink
          to="/alerts"
          className="pg-nav-link"
        >
          <Bell size={17} />

          Alerts

          <span className="pg-alert-count">
            {alertCount}
          </span>
        </NavLink>

        <NavLink
          to="/reports"
          className="pg-nav-link"
        >
          <FileText size={17} />
          Reports
        </NavLink>

      </nav>

      <div className="pg-sidebar-footer">

        <NavLink
          to="/settings"
          className="pg-nav-link"
        >
          <Settings size={17} />
          Settings
        </NavLink>

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
  );
}


function Dashboard() {

  const [medicines, setMedicines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [shipments, setShipments] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // LOAD DATA FROM MYSQL THROUGH BACKEND
  // ==========================================

  const loadDashboardData = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        medicinesResponse,
        alertsResponse,
        shipmentsResponse,
      ] = await Promise.all([

        fetch("https://pharma-guard-app.onrender.com/api/medicines"),

        fetch("https://pharma-guard-app.onrender.com/api/alerts"),

        fetch("https://pharma-guard-app.onrender.com/api/shipments"),

      ]);


      if (
        !medicinesResponse.ok ||
        !alertsResponse.ok ||
        !shipmentsResponse.ok
      ) {
        throw new Error(
          "Unable to load dashboard data."
        );
      }


      const medicinesData =
        await medicinesResponse.json();

      const alertsData =
        await alertsResponse.json();

      const shipmentsData =
        await shipmentsResponse.json();


      setMedicines(medicinesData);
      setAlerts(alertsData);
      setShipments(shipmentsData);

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        "Unable to connect to PharmaGuard backend."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD DATA WHEN DASHBOARD OPENS
  // ==========================================

  useEffect(() => {

    loadDashboardData();

  }, []);


  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================

  const registeredMedicines =
    medicines.length;


  const verifiedBatches =
    medicines.filter(
      (medicine) =>
        medicine.status === "Genuine"
    ).length;


  const activeShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "In Transit"
    ).length;


  // ==========================================
  // SEARCH MEDICINES
  // ==========================================

  const filteredMedicines =
    medicines.filter((medicine) =>

      `${medicine.batch}
       ${medicine.name}
       ${medicine.manufacturer}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );


  const recentMedicines =
    filteredMedicines.slice(0, 4);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="pg-app">

        <Sidebar alertCount={0} />

        <main className="pg-main">

          <header className="pg-topbar">

            <div>

              <div className="pg-breadcrumb">
                Workspace / Dashboard
              </div>

              <h1>
                Dashboard
              </h1>

              <p>
                Loading PharmaGuard data...
              </p>

            </div>

          </header>

        </main>

      </div>

    );

  }


  return (

    <div className="pg-app">

      <Sidebar
        alertCount={alerts.length}
      />


      <main className="pg-main">


        {/* TOP BAR */}

        <header className="pg-topbar">

          <div>

            <div className="pg-breadcrumb">
              Workspace / Dashboard
            </div>

            <h1>
              Dashboard
            </h1>

            <p>
              Overview of medicine registration,
              verification and supply movement.
            </p>

          </div>


          <div className="pg-top-actions">


            <div className="pg-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search records"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <button
              className="pg-notification"
            >

              <Bell size={17} />

              <span></span>

            </button>


            <div className="pg-user">

              <div className="pg-user-avatar">
                A
              </div>

              <div>

                <strong>
                  Administrator
                </strong>

                <small>
                  System Admin
                </small>

              </div>

            </div>


          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div
            style={{
              marginBottom: "20px",
              padding: "14px 18px",
              borderRadius: "10px",
              background: "#fff4f4",
              border: "1px solid #ffd4d4",
              color: "#c62828",
            }}
          >

            <strong>
              Backend connection error:
            </strong>{" "}

            {error}

          </div>

        )}


        {/* SUMMARY */}

        <section className="pg-summary">


          {/* MEDICINES */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon">

              <Pill size={18} />

            </div>

            <div>

              <span>
                Registered medicines
              </span>

              <strong>
                {registeredMedicines}
              </strong>

              <small>
                Total registered
              </small>

            </div>

          </div>


          {/* VERIFIED */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon verified">

              <PackageCheck size={18} />

            </div>

            <div>

              <span>
                Verified batches
              </span>

              <strong>
                {verifiedBatches}
              </strong>

              <small>
                Genuine records
              </small>

            </div>

          </div>


          {/* ALERTS */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon warning">

              <AlertTriangle size={18} />

            </div>

            <div>

              <span>
                Security alerts
              </span>

              <strong>
                {alerts.length}
              </strong>

              <small>
                Recorded alerts
              </small>

            </div>

          </div>


          {/* SHIPMENTS */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon delivery">

              <Truck size={18} />

            </div>

            <div>

              <span>
                Active shipments
              </span>

              <strong>
                {activeShipments}
              </strong>

              <small>
                Currently moving
              </small>

            </div>

          </div>

        </section>


        {/* VERIFY SECTION */}

        <section className="pg-verify-panel">

          <div className="pg-verify-left">

            <div className="pg-verify-icon">

              <ScanLine size={25} />

            </div>

            <div>

              <span className="pg-section-label">
                QUICK VERIFICATION
              </span>

              <h2>
                Check medicine authenticity
              </h2>

              <p>
                Verify a pharmaceutical batch
                before accepting, distributing
                or dispensing it.
              </p>

            </div>

          </div>


          <NavLink
            to="/verify"
            className="pg-verify-button"
          >

            Open Verification

            <ArrowUpRight size={16} />

          </NavLink>

        </section>


        {/* LOWER AREA */}

        <section className="pg-grid">


          {/* MEDICINES */}

          <div className="pg-panel">

            <div className="pg-panel-header">

              <div>

                <span className="pg-section-label">
                  MEDICINE REGISTRY
                </span>

                <h2>
                  Recently registered
                </h2>

              </div>

              <NavLink
                to="/medicines"
                className="pg-panel-link"
              >
                View registry
              </NavLink>

            </div>


            <div className="pg-table-wrapper">

              <table className="pg-table">

                <thead>

                  <tr>

                    <th>
                      Batch
                    </th>

                    <th>
                      Medicine
                    </th>

                    <th>
                      Manufacturer
                    </th>

                    <th>
                      Registered
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentMedicines.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          padding: "25px",
                        }}
                      >
                        No matching medicines found.
                      </td>

                    </tr>

                  ) : (

                    recentMedicines.map(
                      (medicine) => (

                        <tr
                          key={medicine.id}
                        >

                          <td>

                            <span className="pg-batch">
                              {medicine.batch}
                            </span>

                          </td>

                          <td>

                            <strong>
                              {medicine.name}
                            </strong>

                          </td>

                          <td>
                            {medicine.manufacturer}
                          </td>

                          <td>
                            {medicine.manufacturing}
                          </td>

                          <td>

                            <span
                              className={
                                medicine.status ===
                                "Genuine"
                                  ? "pg-status genuine"
                                  : "pg-status expired"
                              }
                            >
                              {medicine.status}
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ACTIVITY */}

          <div className="pg-panel">

            <div className="pg-panel-header">

              <div>

                <span className="pg-section-label">
                  SYSTEM ACTIVITY
                </span>

                <h2>
                  Recent alerts
                </h2>

              </div>

              <NavLink
                to="/alerts"
                className="pg-panel-link"
              >
                View all
              </NavLink>

            </div>


            <div className="pg-activity">

              {alerts.length === 0 ? (

                <div className="pg-activity-item">

                  <div className="pg-activity-icon success">

                    <PackageCheck size={15} />

                  </div>

                  <div>

                    <strong>
                      System operating normally
                    </strong>

                    <p>
                      No security alerts recorded.
                    </p>

                    <small>
                      Just now
                    </small>

                  </div>

                </div>

              ) : (

                alerts
                  .slice(0, 4)
                  .map((alert) => (

                    <div
                      className="pg-activity-item"
                      key={alert.id}
                    >

                      <div className="pg-activity-icon danger">

                        <AlertTriangle size={15} />

                      </div>

                      <div>

                        <strong>
                          {alert.title}
                        </strong>

                        <p>
                          Batch {alert.batch}
                        </p>

                        <small>
                          {alert.time}
                        </small>

                      </div>

                    </div>

                  ))

              )}

            </div>

          </div>


        </section>

      </main>

    </div>

  );
}

export default Dashboard;
