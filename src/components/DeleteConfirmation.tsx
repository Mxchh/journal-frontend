import "./DeleteConfirmation.css";
interface DeleteConfirmation {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmation({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmation) {
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Delete Journal?</h3>
        <p>This action cannot be undone</p>
        <div className="popup-button">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
