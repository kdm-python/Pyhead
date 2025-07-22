import React from "react";
import DiaryDeleteButton from "./DiaryDeleteButton";

const DiaryCard = ({ entry, onDeleted, collapsed, onToggle }) => {
  if (!entry) return null;
  const { date, score, limited, cluster, notes } = entry;

  return (
    <div
      className="card mb-3 shadow-sm d-flex flex-column align-items-stretch position-relative"
      style={{ maxWidth: "400px", minHeight: collapsed ? "auto" : "260px", paddingTop: "48px" }}
    >
      {/* Delete button positioned at top-right */}
      <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
        <DiaryDeleteButton date={date} onDeleted={onDeleted} />
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 
          className="card-title mb-2" 
          onClick={onToggle}
          style={{ cursor: "pointer", userSelect: "none" }}
          title={collapsed ? "Show details" : "Hide details"}
        >
          {date}
          <span style={{ marginLeft: 8, fontSize: "1rem" }}>
            {collapsed ? "▼" : "▲"}
          </span>
        </h5>
        
        {!collapsed && (
          <>
            <h6 className="card-subtitle mb-2 text-primary">Pain Score: {score} / 10</h6>
            <div className="mb-2">
              <span className="badge me-2 bg-secondary-subtle text-dark">
                Limited: {limited ? "Yes" : "No"}
              </span>
              <span className="badge bg-secondary-subtle text-dark">
                Cluster: {cluster ? "Yes" : "No"}
              </span>
            </div>
            {notes && notes.length > 0 && (
              <div>
                <strong>Notes:</strong>
                <ul className="list-group list-group-flush mb-0" style={{ background: '#f5f5f5', borderRadius: '6px' }}>
                  {notes.map((note, idx) => (
                    <li className="list-group-item px-0 py-1 border-0" key={idx} style={{ background: 'transparent' }}>
                      <small className="text-secondary">{note}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiaryCard;