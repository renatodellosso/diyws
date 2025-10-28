import { FiAlertOctagon } from "react-icons/fi";

export default function NotFoundCard({ noun }: { noun: string }) {
  return (
    <div className="card bg-base-100 shadow-sm border border-red-500">
      <div className="card-body">
        <div className="card-title flex items-center gap-2">
          <FiAlertOctagon size={24} className="text-red-500" />
          <h3>{noun} Not Found</h3>
        </div>
      </div>
    </div>
  );
}
