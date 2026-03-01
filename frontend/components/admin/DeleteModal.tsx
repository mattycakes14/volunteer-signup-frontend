import styles from "@/components/admin/DeleteModal.module.css";

interface DeleteModalProps {
  onConfirm: (eventId: string) => void;
  onCancel: () => void;
  eventId: string;
}

const DeleteModal = ({ onConfirm, onCancel, eventId }: DeleteModalProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div>
          <p className={styles.title}>Delete Event</p>
          <p className={styles.message}>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={() => onConfirm(eventId)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
