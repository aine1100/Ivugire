import { cn } from "@/lib/utils";

export type Status = "Submitted" | "Under Review" | "In Progress" | "Pending" | "Resolved" | "Rejected";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusColor(status)
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
