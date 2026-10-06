import { useState } from "react";

import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  Truck,
  ShieldCheck,
  Cloud,
  ExternalLink,
} from "lucide-react";

import {
  getMedicines,
  getAlerts,
  getShipments,
} from "../data/store";


function Reports() {

  const [medicines] = useState(
    getMedicines()
  );

  const [alerts] = useState(
    getAlerts()
  );

  const [shipments] = useState(
    getShipments()
  );


  // ==========================================
  // MEDICINE STATISTICS
  // ==========================================

  const registeredMedicines =
    medicines.length;


  const verifiedBatches =
    medicines.filter(
      (medicine) =>
        medicine.status === "Genuine"
    ).length;


  const expiredBatches =
    medicines.filter(
      (medicine) =>
        medicine.status === "Expired"
    ).length;


  const suspiciousBatches =
    alerts.filter(
      (alert) =>
        alert.type === "Critical" ||
        alert.type === "Warning"
    ).length;


  // ==========================================
  // SUPPLY CHAIN STATISTICS
  // ==========================================

  const activeShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "In Transit"
    ).length;


  const successfulDeliveries =
    shipments.filter(
      (shipment) =>
        shipment.status === "Delivered"
    ).length;


  const delayedShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "Delayed"
    ).length;


  // ==========================================
  // VERIFICATION STATISTICS
  // ==========================================

  const totalChecks =
    verifiedBatches +
    suspiciousBatches +
    expiredBatches;


  const genuinePercentage =
    totalChecks > 0
      ? (
          (verifiedBatches /
            totalChecks) *
          100
        ).toFixed(1)
      : "0.0";


  const suspiciousPercentage =
    totalChecks > 0
      ? (
          (suspiciousBatches /
            totalChecks) *
          100
        ).toFixed(1)
      : "0.0";


  const expiredPercentage =
    totalChecks > 0
      ? (
          (expiredBatches /
            totalChecks) *
          100
        ).toFixed(1)
      : "0.0";


  // ==========================================
  // GENERATE REPORT
  // ==========================================

  const generateReport = () => {

    const report = `
PHARMAGUARD SECURITY REPORT
===========================

Generated: ${new Date().toLocaleString()}

MEDICINE REGISTRY
-----------------
Registered medicines: ${registeredMedicines}
Verified batches: ${verifiedBatches}
Suspicious batches: ${suspiciousBatches}
Expired batches: ${expiredBatches}

SUPPLY CHAIN
------------
Active shipments: ${activeShipments}
Successful deliveries: ${successfulDeliveries}
Delayed shipments: ${delayedShipments}
Total shipments: ${shipments.length}

SYSTEM ALERTS
-------------
Total alerts: ${alerts.length}

CLOUD BACKUP
------------
Database backup: pharmaguard_backup.sql
Cloud storage: MEGA
Status: Cloud backup available

PharmaGuard Security System
`;


    const blob = new Blob(
      [report],
      {
        type: "text/plain",
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;


    link.download =
      "PharmaGuard-Security-Report.txt";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

  };


  // ==========================================
  // UI
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
            className="pg-nav-link"
          >

            <AlertTriangle
              size={17}
            />

            Alerts

            <span className="pg-alert-count">
              {alerts.length}
            </span>

          </a>


          <a
            href="/reports"
            className="pg-nav-link selected"
          >

            <FileText
              size={17}
            />

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


        {/* HEADER */}

        <header className="pg-topbar">


          <div>


            <div className="pg-breadcrumb">
              Workspace / Reports
            </div>


            <h1>
              Reports
            </h1>


            <p>
              Review medicine verification,
              registry and supply-chain activity.
            </p>


          </div>


          <button
            className="report-generate-button"
            onClick={
              generateReport
            }
          >

            <Download size={15} />

            Generate Report

          </button>


        </header>


        {/* ======================================
            REPORT SUMMARY
        ====================================== */}

        <section className="pg-summary">


          {/* REGISTERED MEDICINES */}

          <div className="pg-summary-card">


            <div className="pg-summary-icon verified">

              <Package
                size={18}
              />

            </div>


            <div>

              <span>
                Registered medicines
              </span>


              <strong>
                {registeredMedicines}
              </strong>


              <small>
                Total records
              </small>

            </div>

          </div>


          {/* VERIFIED BATCHES */}

          <div className="pg-summary-card">


            <div className="pg-summary-icon verified">

              <ShieldCheck
                size={18}
              />

            </div>


            <div>

              <span>
                Verified batches
              </span>


              <strong>
                {verifiedBatches}
              </strong>


              <small>
                {genuinePercentage}% verified
              </small>

            </div>

          </div>


          {/* SUSPICIOUS */}

          <div className="pg-summary-card">


            <div className="pg-summary-icon warning">

              <AlertTriangle
                size={18}
              />

            </div>


            <div>

              <span>
                Suspicious batches
              </span>


              <strong>
                {suspiciousBatches}
              </strong>


              <small>
                Requires investigation
              </small>

            </div>

          </div>


          {/* EXPIRED */}

          <div className="pg-summary-card">


            <div className="pg-summary-icon warning">

              <XCircle
                size={18}
              />

            </div>


            <div>

              <span>
                Expired batches
              </span>


              <strong>
                {expiredBatches}
              </strong>


              <small>
                Removed from circulation
              </small>

            </div>

          </div>


        </section>


        {/* ======================================
            REPORT OVERVIEW
        ====================================== */}

        <section className="reports-grid">


          {/* VERIFICATION ANALYSIS */}

          <div className="pg-panel report-overview">


            <div className="pg-panel-header">


              <div>

                <span className="pg-section-label">
                  VERIFICATION ANALYSIS
                </span>


                <h2>
                  Medicine verification
                </h2>

              </div>


              <span className="report-period">
                August 2026
              </span>


            </div>


            <div className="verification-chart">


              <div className="chart-number">

                <strong>
                  {totalChecks}
                </strong>


                <span>
                  Total checks
                </span>

              </div>


              <div className="chart-bars">


                {/* GENUINE */}

                <div className="chart-row">

                  <span>
                    Genuine
                  </span>


                  <div className="chart-track">

                    <div
                      className="chart-fill genuine-fill"
                      style={{
                        width:
                          `${genuinePercentage}%`,
                      }}
                    ></div>

                  </div>


                  <strong>
                    {genuinePercentage}%
                  </strong>

                </div>


                {/* SUSPICIOUS */}

                <div className="chart-row">

                  <span>
                    Suspicious
                  </span>


                  <div className="chart-track">

                    <div
                      className="chart-fill suspicious-fill"
                      style={{
                        width:
                          `${suspiciousPercentage}%`,
                      }}
                    ></div>

                  </div>


                  <strong>
                    {suspiciousPercentage}%
                  </strong>

                </div>


                {/* EXPIRED */}

                <div className="chart-row">

                  <span>
                    Expired
                  </span>


                  <div className="chart-track">

                    <div
                      className="chart-fill expired-fill"
                      style={{
                        width:
                          `${expiredPercentage}%`,
                      }}
                    ></div>

                  </div>


                  <strong>
                    {expiredPercentage}%
                  </strong>

                </div>


              </div>

            </div>

          </div>


          {/* SUPPLY CHAIN */}

          <div className="pg-panel report-overview">


            <div className="pg-panel-header">


              <div>

                <span className="pg-section-label">
                  SUPPLY CHAIN
                </span>


                <h2>
                  Distribution activity
                </h2>

              </div>


            </div>


            <div className="report-stat-list">


              {/* ACTIVE SHIPMENTS */}

              <div className="report-stat">


                <div className="report-stat-icon">

                  <Truck
                    size={17}
                  />

                </div>


                <div>

                  <span>
                    Active shipments
                  </span>


                  <strong>
                    {activeShipments}
                  </strong>

                </div>


                <small>
                  Current
                </small>

              </div>


              {/* DELIVERIES */}

              <div className="report-stat">


                <div className="report-stat-icon">

                  <CheckCircle2
                    size={17}
                  />

                </div>


                <div>

                  <span>
                    Successful deliveries
                  </span>


                  <strong>
                    {successfulDeliveries}
                  </strong>

                </div>


                <small>
                  Completed
                </small>

              </div>


              {/* DELAYED */}

              <div className="report-stat">


                <div className="report-stat-icon">

                  <AlertTriangle
                    size={17}
                  />

                </div>


                <div>

                  <span>
                    Delayed shipments
                  </span>


                  <strong>
                    {delayedShipments}
                  </strong>

                </div>


                <small>
                  Monitoring
                </small>

              </div>


            </div>

          </div>


        </section>


        {/* ======================================
            SYSTEM ACTIVITY
        ====================================== */}

        <section className="pg-panel report-activity">


          <div className="pg-panel-header">


            <div>

              <span className="pg-section-label">
                SYSTEM ACTIVITY
              </span>


              <h2>
                Recent report events
              </h2>

            </div>


            <button
              className="report-export-button"
              onClick={
                generateReport
              }
            >

              <FileText
                size={14}
              />

              Export

            </button>


          </div>


          <div className="report-events">


            {alerts.length > 0 ? (


              alerts
                .slice(0, 3)
                .map((alert) => (


                  <div
                    className="report-event"
                    key={alert.id}
                  >


                    <div className="report-event-icon warning">

                      <AlertTriangle
                        size={17}
                      />

                    </div>


                    <div>

                      <strong>
                        {alert.title}
                      </strong>


                      <p>
                        {alert.description}
                      </p>

                    </div>


                    <span>
                      {alert.time}
                    </span>


                  </div>

                ))


            ) : (


              <div className="report-event">


                <div className="report-event-icon success">

                  <CheckCircle2
                    size={17}
                  />

                </div>


                <div>

                  <strong>
                    System operating normally
                  </strong>


                  <p>
                    No security alerts
                    have been recorded.
                  </p>

                </div>


                <span>
                  Just now
                </span>


              </div>

            )}

          </div>

        </section>


        {/* ======================================
            CLOUD BACKUP
        ====================================== */}

        <section className="pg-panel cloud-backup-panel">


          <div className="pg-panel-header">


            <div>

              <span className="pg-section-label">
                CLOUD STORAGE
              </span>


              <h2>
                Cloud Backup
              </h2>

            </div>


            <div className="cloud-backup-icon">

              <Cloud
                size={20}
              />

            </div>


          </div>


          <div className="cloud-backup-content">


            {/* FILE INFORMATION */}

            <div className="cloud-file-info">


              <div className="cloud-file-icon">

                <FileText
                  size={22}
                />

              </div>


              <div>

                <strong>
                  pharmaguard_backup.sql
                </strong>


                <p>
                  PharmaGuard MySQL
                  database backup
                </p>

              </div>


            </div>


            {/* STATUS */}

            <div className="cloud-backup-status">

              <CheckCircle2
                size={16}
              />

              <span>
                Cloud backup available
              </span>

            </div>


            {/* MEGA BUTTON */}

            <a
              href="https://mega.nz/folder/jlQCjBhA#BvV2Ls3EURxN2OCx_f_IBA"
              target="_blank"
              rel="noopener noreferrer"
              className="cloud-backup-button"
            >

              <Cloud
                size={16}
              />

              View Cloud Backup

              <ExternalLink
                size={15}
              />

            </a>


          </div>

        </section>


        {/* ======================================
            FOOTER NOTE
        ====================================== */}

        <div className="report-note">


          <ShieldCheck
            size={15}
          />


          <span>

            Report data is generated from
            registered PharmaGuard medicine
            and supply-chain records.

          </span>


        </div>


      </main>

    </div>

  );
}


export default Reports;