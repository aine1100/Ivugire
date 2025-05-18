import { Badge } from "@/components/ui/badge";

type Status = "Pending" | "In Progress" | "Resolved" | "Rejected";

interface StatusBadgeProps {
  status: Status;
}

const statusColors: Record<Status, string> = {
  "Pending": "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Resolved": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800"
};

const statusLabels: Record<Status, string> = {
  "Pending": "Gitegereje",
  "In Progress": "Gikora",
  "Resolved": "Gisubijwe",
  "Rejected": "Gahakanwe"
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge className={`${statusColors[status]} font-medium`}>
      {statusLabels[status]}
    </Badge>
  );
};

export default StatusBadge;
