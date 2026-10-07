import { useEffect, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";

const API_URL = "https://pharma-guard-app.onrender.com/api";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    batch: "",
    manufacturer: "",
    manufacturing: "",
    expiry: "",
    quantity: "",
  });

  // ==========================================
  // LOAD MEDICINES FROM MYSQL
  // ==========================================

  const loadMedicines = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/medicines`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load medicines."
        );
      }

      const data = await response.json();

      setMedicines(data);
    } catch (error) {
      console.error(
        "Error loading medicines:",
        error
      );

      alert(
        "Unable to connect to PharmaGuard backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // ADD MEDICINE
  // ==========================================

  const addMedicine = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.batch.trim() ||
      !form.manufacturer.trim() ||
      !form.manufacturing ||
      !form.expiry ||
      !form.quantity
    ) {
      alert("Please fill all fields.");
      return;
    }

    const batch =
      form.batch.trim().toUpperCase();

    // Check duplicate in current list
    const batchExists = medicines.some(
      (medicine) =>
        medicine.batch?.toUpperCase() === batch
    );

    if (batchExists) {
      alert(
        "This Batch ID is already registered."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/medicines`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            batch,
            manufacturer:
              form.manufacturer.trim(),
            manufacturing:
              form.manufacturing,
            expiry: form.expiry,
            quantity:
              Number(form.quantity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to register medicine."
        );
        return;
      }

      // Add returned MySQL record
      setMedicines((prev) => [
        data,
        ...prev,
      ]);

      // Clear form
      setForm({
        name: "",
        batch: "",
        manufacturer: "",
        manufacturing: "",
        expiry: "",
        quantity: "",
      });

      // Close modal
      setShowForm(false);

      alert(
        "Medicine registered successfully."
      );

    } catch (error) {
      console.error(
        "Add medicine error:",
        error
      );

      alert(
        "Unable to connect to PharmaGuard backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE MEDICINE
  // ==========================================

  const deleteMedicine = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this medicine?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/medicines/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to delete medicine."
        );
        return;
      }

      // Remove deleted record from UI
      setMedicines((prev) =>
        prev.filter(
          (medicine) =>
            medicine.id !== id
        )
      );

      alert(
        "Medicine deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete medicine error:",
        error
      );

      alert(
        "Unable to connect to PharmaGuard backend."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredMedicines =
    medicines.filter((medicine) =>
      `${medicine.name}
       ${medicine.batch}
       ${medicine.manufacturer}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page-content">

      {/* PAGE HEADING */}

      <div className="page-heading">

        <div>

          <h2>
            Medicine Registry
          </h2>

          <p>
            Manage registered pharmaceutical
            products and batches.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          <Plus size={17} />

          Add Medicine
        </button>

      </div>


      {/* TOOLBAR */}

      <div className="medicine-toolbar">

        <div className="medicine-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search medicine, batch or manufacturer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <span className="record-count">
          {filteredMedicines.length} records
        </span>

      </div>


      {/* TABLE */}

      <div className="medicine-table-card">

        <table className="medicine-table">

          <thead>

            <tr>

              <th>
                Batch ID
              </th>

              <th>
                Medicine
              </th>

              <th>
                Manufacturer
              </th>

              <th>
                Manufacturing
              </th>

              <th>
                Expiry
              </th>

              <th>
                Quantity
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="8"
                  className="no-records"
                >
                  Loading medicines...
                </td>

              </tr>

            ) : filteredMedicines.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="no-records"
                >
                  No medicines found.
                </td>

              </tr>

            ) : (

              filteredMedicines.map(
                (medicine) => (

                  <tr
                    key={medicine.id}
                  >

                    <td>

                      <strong className="batch-id">
                        {medicine.batch}
                      </strong>

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
                      {medicine.expiry}
                    </td>

                    <td>
                      {medicine.quantity}
                    </td>

                    <td>

                      <span className="medicine-status">

                        {medicine.status}

                      </span>

                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteMedicine(
                            medicine.id
                          )
                        }
                        title="Delete medicine"
                      >

                        <Trash2 size={16} />

                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ADD MEDICINE MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="medicine-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Register Medicine
                </h2>

                <p>
                  Add a new pharmaceutical batch.
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >

                <X size={19} />

              </button>

            </div>


            <form
              onSubmit={addMedicine}
            >

              <div className="form-grid">


                {/* MEDICINE NAME */}

                <div className="form-field">

                  <label>
                    Medicine Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Paracetamol 500mg"
                  />

                </div>


                {/* BATCH */}

                <div className="form-field">

                  <label>
                    Batch ID
                  </label>

                  <input
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    placeholder="e.g. PCM24031"
                  />

                </div>


                {/* MANUFACTURER */}

                <div className="form-field">

                  <label>
                    Manufacturer
                  </label>

                  <input
                    name="manufacturer"
                    value={
                      form.manufacturer
                    }
                    onChange={handleChange}
                    placeholder="Manufacturer name"
                  />

                </div>


                {/* QUANTITY */}

                <div className="form-field">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Number of units"
                    min="1"
                  />

                </div>


                {/* MANUFACTURING */}

                <div className="form-field">

                  <label>
                    Manufacturing Date
                  </label>

                  <input
                    type="date"
                    name="manufacturing"
                    value={
                      form.manufacturing
                    }
                    onChange={handleChange}
                  />

                </div>


                {/* EXPIRY */}

                <div className="form-field">

                  <label>
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiry"
                    value={
                      form.expiry
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* ACTIONS */}

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
                  disabled={saving}
                >

                  {saving
                    ? "Registering..."
                    : "Register Medicine"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Medicines;
