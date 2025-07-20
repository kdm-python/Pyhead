import React, { useState } from "react";

const DiaryForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date as default
    score: 1,
    limited: false,
    cluster: false,
    notes: [""],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = "Date is required.";
    if (form.score < 1 || form.score > 10) errs.score = "Score must be between 1 and 10.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (name === "score") {
      // Remove leading zeros and ensure empty string is allowed for typing
      let sanitized = value.replace(/^0+/, "");
      if (sanitized === "") sanitized = "0";
      setForm((f) => ({ ...f, [name]: Number(sanitized) }));
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
    
    // Prepare payload
    const payload = {
      ...form,
      notes: form.notes.filter((v) => v.trim()),
    };
    
    try {
      await onSubmit(payload);
      // Reset form
      setForm({
        date: new Date().toISOString().split('T')[0],
        score: 1,
        limited: false,
        cluster: false,
        notes: [""],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="container p-4 bg-light rounded shadow" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
      <h4 className="mb-3">Add Diary Entry</h4>
      
      <div className="mb-3">
        <label className="form-label">Date</label>
        <input
          type="date"
          name="date"
          className={"form-control " + (errors.date ? "is-invalid" : "")}
          value={form.date}
          onChange={handleChange}
        />
        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Pain Score (1-10)</label>
        <input
          type="number"
          name="score"
          min="1"
          max="10"
          className={"form-control " + (errors.score ? "is-invalid" : "")}
          value={form.score}
          onChange={handleChange}
        />
        {errors.score && <div className="invalid-feedback">{errors.score}</div>}
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            name="limited"
            className="form-check-input"
            checked={form.limited}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Activity was limited
          </label>
        </div>
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            name="cluster"
            className="form-check-input"
            checked={form.cluster}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Cluster headache
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Notes</label>
        {form.notes.map((note, idx) => (
          <div key={idx} className="mb-2 d-flex">
            <input
              type="text"
              className="form-control me-2"
              value={note}
              onChange={(e) => handleArrayChange(e, "notes", idx)}
              placeholder="Add a note..."
            />
            {form.notes.length > 1 && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeArrayField("notes", idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => addArrayField("notes")}
        >
          + Add Note
        </button>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Entry"}
        </button>
      </div>
    </form>
  );
};

export default DiaryForm;