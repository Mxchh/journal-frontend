import { useState, useEffect } from "react";

interface Journal {
  id: number;
  date: string;
  title: string;
  mood: string;
  description: string;
}

interface Props {
  journal: Journal;
  isOpen: boolean;
  onClose: () =>void;
}

function EditJournalPopup({
    journal,
    isOpen,
    onClose,
}:Props){

  const [date, setDate] = useState(journal.date);
const [title, setTitle] = useState(journal.title);
const [mood, setMood] = useState(journal.mood);
const [description, setDescription] = useState(journal.description);
useEffect(() => {
  setDate(journal.date);
  setTitle(journal.title);
  setMood(journal.mood);
  setDescription(journal.description);
}, [journal]);
    

    const handleSave = async () => {
      const editEntry = {
            date, title, mood, description
        };
        try {
          const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/journals/${journal.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editEntry),
                }
            );
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert("Entry Edited!");
                onClose();
            }
        }
        catch(error) {
            console.error("Error saving entry: ", error);
        }
    };
    return (
 <>
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Journal Entry</h2>
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
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
    );
}

export default EditJournalPopup;