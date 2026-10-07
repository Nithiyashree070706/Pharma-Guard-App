import { useEffect, useState } from "react";

import {
  AlertTriangle,
  XCircle,
  Clock3,
  CheckCircle2,
  Search,
  ShieldAlert,
} from "lucide-react";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD ALERTS FROM BACKEND
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch(
        "https://pharma-guard-app.onrender.com/api/alerts"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load alerts"
        );
      }

      setAlerts(data);
    } catch (error) {
      console.error("Alert loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ACKNOWLEDGE ALERT
  const acknowledgeAlert = async (id) => {
    try {
      const response = await fetch(
        `https://pharma-guard-app.onrender.com/api/alerts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to acknowledge alert"
        );
      }

      // Remove acknowledged alert from screen
      setAlerts((prev) =>
        prev.filter((alert) => alert.id !== id)
      );

    } catch (error) {
      console.error(
        "Alert acknowledgement error:",
        error
      );

      alert(error.message);
    }
  };

  // SEARCH
  const filteredAlerts = alerts.filter((alert) =>
    `${alert.title} ${alert.batch} ${alert.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="pg-app">

      {/* SIDEBAR */}

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
            className="pg-nav-link"
          >
            <span>▣</span>
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
            className="pg-nav-link selected"
          >
            <AlertTriangle size={17} />

            Alerts

            <span className="pg-alert-count">
              {alerts.length}
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

      {/* MAIN */}

      <main className="pg-main">

        {/* HEADER */}

        <header className="pg-topbar">

          <div>

            <div className="pg-breadcrumb">
              Workspace / Alerts
            </div>

            <h1>
              Security Alerts
            </h1>

            <p>
              Monitor suspicious medicine activity and supply-chain events.
            </p>

          </div>

        </header>

        {/* SUMMARY */}

        <section className="pg-summary">

          {/* ACTIVE ALERTS */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon warning">
              <AlertTriangle size={18} />
            </div>

            <div>

              <span>
                Active alerts
              </span>

              <strong>
                {alerts.length}
              </strong>

              <small>
                Require review
              </small>

            </div>

          </div>

          {/* CRITICAL */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon warning">
              <ShieldAlert size={18} />
            </div>

            <div>

              <span>
                Critical
              </span>

              <strong>
                {
                  alerts.filter(
                    (alert) =>
                      alert.type === "Critical"
                  ).length
                }
              </strong>

              <small>
                Immediate attention
              </small>

            </div>

          </div>

          {/* PENDING */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon">
              <Clock3 size={18} />
            </div>

            <div>

              <span>
                Pending review
              </span>

              <strong>
                {alerts.length}
              </strong>

              <small>
                Awaiting action
              </small>

            </div>

          </div>

          {/* RESOLVED */}

          <div className="pg-summary-card">

            <div className="pg-summary-icon verified">
              <CheckCircle2 size={18} />
            </div>

            <div>

              <span>
                Resolved today
              </span>

              <strong>
                12
              </strong>

              <small>
                Successfully handled
              </small>

            </div>

          </div>

        </section>

        {/* ALERT LIST */}

        <section className="pg-alerts-panel">

          {/* PANEL HEADER */}

          <div className="pg-panel-header">

            <div>

              <span className="pg-section-label">
                SECURITY MONITORING
              </span>

              <h2>
                Alert queue
              </h2>

            </div>

            {/* SEARCH */}

            <div className="alerts-search">

              <Search size={15} />

              <input
                type="text"
                placeholder="Search alerts..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          {/* ALERT LIST */}

          <div className="pg-alert-list">

            {/* LOADING */}

            {loading ? (

              <div className="pg-no-alerts">

                <Clock3 size={30} />

                <strong>
                  Loading alerts...
                </strong>

                <p>
                  Retrieving security alerts from the database.
                </p>

              </div>

            ) : filteredAlerts.length === 0 ? (

              /* NO ALERTS */

              <div className="pg-no-alerts">

                <CheckCircle2 size={30} />

                <strong>
                  No active alerts
                </strong>

                <p>
                  There are no security alerts matching your search.
                </p>

              </div>

            ) : (

              /* ALERTS */

              filteredAlerts.map((alert) => (

                <div
                  className={`pg-alert-row ${alert.icon}`}
                  key={alert.id}
                >

                  {/* ICON */}

                  <div className="pg-alert-icon">

                    {alert.icon === "critical" && (
                      <XCircle size={20} />
                    )}

                    {alert.icon === "warning" && (
                      <AlertTriangle size={20} />
                    )}

                    {alert.icon === "info" && (
                      <Clock3 size={20} />
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="pg-alert-content">

                    <div className="pg-alert-title">

                      <strong>
                        {alert.title}
                      </strong>

                      <span
                        className={`pg-alert-severity ${alert.icon}`}
                      >
                        {alert.type}
                      </span>

                    </div>

                    <p>
                      {alert.description}
                    </p>

                    <div className="pg-alert-meta">

                      <span>
                        Batch:{" "}
                        <strong>
                          {alert.batch}
                        </strong>
                      </span>

                      <span>
                        Location:{" "}
                        {alert.location}
                      </span>

                      <span>
                        {alert.time}
                      </span>

                    </div>

                  </div>

                  {/* ACKNOWLEDGE */}

                  <button
                    className="pg-acknowledge"
                    onClick={() =>
                      acknowledgeAlert(alert.id)
                    }
                  >
                    Acknowledge
                  </button>

                </div>

              ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Alerts;
