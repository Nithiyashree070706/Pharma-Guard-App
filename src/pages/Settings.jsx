
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  Truck,
  ScanLine,
  Bell,
  FileText,
  Settings as SettingsIcon,
} from "lucide-react";

function Settings() {
  return (
    <div className="pg-app">

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

          <NavLink to="/" className="pg-nav-link">
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>

          <NavLink to="/medicines" className="pg-nav-link">
            <Pill size={17} />
            Medicine Registry
          </NavLink>

          <NavLink to="/supply-chain" className="pg-nav-link">
            <Truck size={17} />
            Supply Chain
          </NavLink>

          <NavLink to="/verify" className="pg-nav-link">
            <ScanLine size={17} />
            Verify Medicine
          </NavLink>

          <NavLink to="/alerts" className="pg-nav-link">
            <Bell size={17} />
            Alerts
          </NavLink>

          <NavLink to="/reports" className="pg-nav-link">
            <FileText size={17} />
            Reports
          </NavLink>

        </nav>

        <div className="pg-sidebar-footer">

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `pg-nav-link ${isActive ? "selected" : ""}`
            }
          >
            <SettingsIcon size={17} />
            Settings
          </NavLink>

          <div className="pg-system">
            <span className="online-dot"></span>

            <div>
              <strong>System operational</strong>
              <small>All services running</small>
            </div>
          </div>

        </div>

      </aside>

      <main className="pg-main">

        <header className="pg-topbar">

          <div>
            <div className="pg-breadcrumb">
              Workspace / Settings
            </div>

            <h1>Settings</h1>

            <p>
              Manage PharmaGuard system preferences and configuration.
            </p>
          </div>

        </header>

        <section className="pg-panel settings-panel">

          <div className="pg-panel-header">

            <div>
              <span className="pg-section-label">
                SYSTEM SETTINGS
              </span>

              <h2>Application settings</h2>
            </div>

          </div>

          <div className="settings-row">

            <div>
              <strong>System status</strong>
              <p>
                Current PharmaGuard services status.
              </p>
            </div>

            <span className="settings-status">
              Operational
            </span>

          </div>

          <div className="settings-row">

            <div>
              <strong>Medicine verification</strong>
              <p>
                Verify pharmaceutical batches against registered records.
              </p>
            </div>

            <span className="settings-status">
              Enabled
            </span>

          </div>

          <div className="settings-row">

            <div>
              <strong>Security monitoring</strong>
              <p>
                Monitor suspicious and expired medicine activity.
              </p>
            </div>

            <span className="settings-status">
              Enabled
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Settings;