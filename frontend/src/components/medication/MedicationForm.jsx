import React, { useState } from "react";

const MedicationForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    dose: { morning: "", afternoon: "", evening: "" },
    active: true,
    start_date: "",
    end_date: "",
    side_effects: [""],
    notes: [""],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.start_date) errs.start_date = "Start date is required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith("dose.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, dose: { ...f.dose, [key]: value } }));
    } else if (name === "active") {
      setForm((f) => ({ ...f, active: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleArrayChange = (e, field, idx) => {
    const vals = [...form[field]];
    vals[idx] = e.target.value;
    setForm((f) => ({ ...f, [field]: vals }));
  };

  const addArrayField = (field) => {
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  };
  const removeArrayField = (field, idx) => {
    setForm((f) => {
      const vals = [...f[field]];
      vals.splice(idx, 1);
      return { ...f, [field]: vals.length ? vals : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    // prepare payload
    const payload = {
      ...form,
      dose: {
        morning: Number(form.dose.morning) || 0,
        afternoon: Number(form.dose.afternoon) || 0,
        evening: Number(form.dose.evening) || 0,
      },
      side_effects: form.side_effects.filter((v) => v.trim()),
      notes: form.notes.filter((v) => v.trim()),
    };
    if (!payload.end_date) delete payload.end_date;
    try {
      await onSubmit(payload);
      // reset form
      setForm({ name: "", dose: { morning: "", afternoon: "", evening: "" }, active: true, start_date: "", end_date: "", side_effects: [""], notes: [""] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="container p-4 bg-light rounded shadow" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
      <h4 className="mb-3">Add Medication</h4>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className={"form-control " + (errors.name ? "is-invalid" : "")}
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      <div className="mb-3 row">
        <label className="form-label">Dose (mg)</label>
        <div className="col">
          <input
            type="number"
            name="dose.morning"
            className="form-control"
            placeholder="Morning"
            min="0"
            value={form.dose.morning}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <input
            type="number"
            name="dose.afternoon"
            className="form-control"
            placeholder="Afternoon"
            min="0"
            value={form.dose.afternoon}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <input
            type="number"
            name="dose.evening"
            className="form-control"
            placeholder="Evening"
            min="0"
            value={form.dose.evening}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          name="active"
          className="form-check-input"
          id="activeCheck"
          checked={form.active}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="activeCheck">
          Active
        </label>
      </div>
      <div className="mb-3 row">
        <div className="col">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="start_date"
            className={"form-control " + (errors.start_date ? "is-invalid" : "")}
            value={form.start_date}
            onChange={handleChange}
          />
          {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
        </div>
        <div className="col">
          <label className="form-label">
            End Date <span className="text-muted">(optional)</span>
          </label>
          <input
            type="date"
            name="end_date"
            className="form-control"
            value={form.end_date}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Side Effects</label>
        {form.side_effects.map((val, idx) => (
          <div className="input-group mb-2" key={idx}>
            <input
              type="text"
              className="form-control"
              placeholder="Side effect"
              value={val}
              onChange={(e) => handleArrayChange(e, "side_effects", idx)}
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => removeArrayField("side_effects", idx)}
              disabled={form.side_effects.length === 1}
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => addArrayField("side_effects")}
        >
          Add Side Effect
        </button>
      </div>
      <div className="mb-3">
        <label className="form-label">Notes</label>
        {form.notes.map((val, idx) => (
          <div className="input-group mb-2" key={idx}>
            <input
              type="text"
              className="form-control"
              placeholder="Note"
              value={val}
              onChange={(e) => handleArrayChange(e, "notes", idx)}
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => removeArrayField("notes", idx)}
              disabled={form.notes.length === 1}
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => addArrayField("notes")}
        >
          Add Note
        </button>
      </div>
      <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Medication"}
      </button>
    </form>
  );
};

export default MedicationForm;
