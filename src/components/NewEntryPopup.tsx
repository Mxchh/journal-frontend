import "./NewEntryPopup.css";
import { useState } from "react";

function NewEntryPopup() {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const[description, setDescription] = useState("");
  const token = localStorage.getItem("token");


  const handleSave = async () => {
    
    console.log("Token:", token);

    const newEntry = {
      date,title,mood,description
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/journals",
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(newEntry),
        }
      );
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Entry Saved!");
    setShowModal(false);

    setDate("");
    setTitle("");
    setMood("");
    setDescription("");
      }
    }
    catch(error) {
      console.error("Error saving entry:", error);
    }
  };

  return (
    <>
      <div className="new-entry-btn">
        <button onClick={() => setShowModal(true)}>New Entry</button>
      </div>
      {showModal && (
        <div className="popup">
          <div className="popup-content">
            <h2>Create New Entry</h2>
            <div className="date">
              <p>Date</p>
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="title">
              <p>Title</p>
              <input
                type="text"
                placeholder="Enter title for your journal" value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mood">
                <p>Mood</p>
                <select name="mood" id="mood" value={mood} onChange={(e)=>setMood(e.target.value)}>
                  <option value="">Select a mood</option>
                  <option value="happy">Happy</option>
                  <option value="excited">Excited</option>
                  <option value="sad">Sad</option>
                  <option value="calm">Calm</option>
                  <option value="neutral">Neutral</option>
                  <option value="angry">Angry</option>
                  <option value="stressed">Stressed</option>
                </select>
            </div>
            <div className="description">
              <p>Journal Entry</p>
              <textarea name="description" id="description" value={description} placeholder="Write about your day..." onChange={(e)=>setDescription(e.target.value)} cols={50} rows={5}></textarea>
            </div>
            <div className="cancel-save-button">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewEntryPopup;
