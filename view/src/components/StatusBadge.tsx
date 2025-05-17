
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "Submitted" | "Under Review" | "In Progress" | "Resolved" | "Rejected";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyles()} font-medium`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
