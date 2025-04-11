import { useLocation } from "react-router-dom";

export default function EditEquipment() {
  const query = new URLSearchParams(useLocation().search);
  const id = query.get("id");
  return (
    <div>
      <h1>Edit Equipment</h1>
      <p>This is the edit equipment page.</p>
    </div>
  );
}
