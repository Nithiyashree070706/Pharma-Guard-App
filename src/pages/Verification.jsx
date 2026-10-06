import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  ScanLine,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  LayoutDashboard,
  Pill,
  Truck,
  Bell,
  FileText,
  Settings,
} from "lucide-react";

function Verification() {
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);
  const [alertCount, setAlertCount] = useState(0);

  // Load active alert count
  useEffect(() => {
    loadAlertCount();
  }, []);

  const loadAlertCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/alerts"
      );

      if (!response.ok) {
        throw new Error("Failed to load alerts");
      }

      const data = await response.json();

      setAlertCount(data.length);
    } catch (error) {
      console.error(
        "Alert count loading error:",
        error
      );
    }
  };

  // Verify medicine
  const verifyMedicine = async (e) => {
    e.preventDefault();

    const code = batchId.trim().toUpperCase();

    if (!code) {
      setResult({
        type: "empty",
        message:
          "Enter a batch ID to begin verification.",
      });

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batch: code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResult({
          type: "empty",
          message:
            data.message ||
            data.error ||
            "Verification failed.",
        });

        return;
      }

      setResult(data);

      // Refresh alert count
      loadAlertCount();

    } catch (error) {
      console.error(
        "Verification error:",
        error
      );

      setResult({
        type: "empty",
        message:
          "Unable to connect to PharmaGuard backend. Make sure the backend server is running.",
      });
    }
  };

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

          <NavLink
            to="/"
            className="pg-nav-link"
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
            className={({ isActive }) =>
              `pg-nav-link ${
                isActive ? "selected" : ""
              }`
            }
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

      {/* MAIN */}

      <main className="pg-main">

        {/* HEADER */}

        <header className="pg-topbar">

          <div>

            <div className="pg-breadcrumb">
              Workspace / Verify Medicine
            </div>

            <h1>
              Verify Medicine
            </h1>

            <p>
              Check a pharmaceutical batch against
              the registered medicine database.
            </p>

          </div>

        </header>

        {/* VERIFICATION BOX */}

        <section className="verification-page-card">

          <div className="verification-page-icon">
            <ShieldCheck size={28} />
          </div>

          <span className="pg-section-label">
            AUTHENTICITY CHECK
          </span>

          <h2>
            Verify a medicine batch
          </h2>

          <p className="verification-description">
            Enter the batch ID printed on the medicine
            package. PharmaGuard will compare it with
            registered records.
          </p>

          <form
            className="verification-form"
            onSubmit={verifyMedicine}
          >

            <div className="verification-input">

              <Search size={17} />

              <input
                type="text"
                placeholder="Enter batch ID e.g. PCM24031"
                value={batchId}
                onChange={(e) =>
                  setBatchId(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="verification-submit"
            >
              Verify Batch
            </button>

          </form>

          <div className="verification-hint">

            Try{" "}

            <strong>
              PCM24031
            </strong>

            ,{" "}

            <strong>
              AMX24018
            </strong>

            ,{" "}

            <strong>
              MET24044
            </strong>

            {" "}or{" "}

            <strong>
              AZT24009
            </strong>.

          </div>

        </section>

        {/* RESULT */}

        {result && (

          <section className="verification-result">

            {/* GENUINE */}

            {result.type === "genuine" && (

              <>

                <div className="verification-result-header genuine-result">

                  <div className="result-icon">
                    <CheckCircle2 size={25} />
                  </div>

                  <div>

                    <span>
                      VERIFICATION RESULT
                    </span>

                    <h2>
                      Medicine verified
                    </h2>

                    <p>
                      {result.message}
                    </p>

                  </div>

                  <strong className="result-status">
                    GENUINE
                  </strong>

                </div>

                <div className="medicine-details">

                  <div>
                    <span>
                      Medicine
                    </span>

                    <strong>
                      {result.medicine.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Batch ID
                    </span>

                    <strong>
                      {result.batch}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Manufacturer
                    </span>

                    <strong>
                      {result.medicine.manufacturer}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Quantity
                    </span>

                    <strong>
                      {result.medicine.quantity}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Manufacturing Date
                    </span>

                    <strong>
                      {result.medicine.manufacturing}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Expiry Date
                    </span>

                    <strong>
                      {result.medicine.expiry}
                    </strong>
                  </div>

                </div>

              </>

            )}

            {/* EXPIRED */}

            {result.type === "expired" && (

              <>

                <div className="verification-result-header expired-result">

                  <div className="result-icon">
                    <XCircle size={25} />
                  </div>

                  <div>

                    <span>
                      VERIFICATION RESULT
                    </span>

                    <h2>
                      Expired medicine
                    </h2>

                    <p>
                      {result.message}
                    </p>

                  </div>

                  <strong className="result-status">
                    EXPIRED
                  </strong>

                </div>

                <div className="medicine-details">

                  <div>
                    <span>
                      Medicine
                    </span>

                    <strong>
                      {result.medicine.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Batch ID
                    </span>

                    <strong>
                      {result.batch}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Manufacturer
                    </span>

                    <strong>
                      {result.medicine.manufacturer}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Expiry Date
                    </span>

                    <strong>
                      {result.medicine.expiry}
                    </strong>
                  </div>

                </div>

              </>

            )}

            {/* SUSPICIOUS */}

            {result.type === "suspicious" && (

              <div className="verification-result-header suspicious-result">

                <div className="result-icon">
                  <AlertTriangle size={25} />
                </div>

                <div>

                  <span>
                    VERIFICATION RESULT
                  </span>

                  <h2>
                    Batch not recognized
                  </h2>

                  <p>
                    {result.message}
                  </p>

                </div>

                <strong className="result-status">
                  SUSPICIOUS
                </strong>

              </div>

            )}

            {/* EMPTY */}

            {result.type === "empty" && (

              <div className="verification-empty">

                <AlertTriangle size={20} />

                <span>
                  {result.message}
                </span>

              </div>

            )}

          </section>

        )}

        {/* INFORMATION */}

        <section className="verification-info-grid">

          <div className="verification-info-card">

            <CheckCircle2 size={20} />

            <div>

              <strong>
                Registered batch
              </strong>

              <p>
                The batch exists in the PharmaGuard
                registry and has valid product
                information.
              </p>

            </div>

          </div>

          <div className="verification-info-card">

            <AlertTriangle size={20} />

            <div>

              <strong>
                Unrecognized batch
              </strong>

              <p>
                A batch that is not registered should
                be investigated before distribution
                or use.
              </p>

            </div>

          </div>

          <div className="verification-info-card">

            <XCircle size={20} />

            <div>

              <strong>
                Expired batch
              </strong>

              <p>
                Expired medicines should not be
                distributed or dispensed to patients.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Verification;