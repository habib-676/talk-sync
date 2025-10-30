// src/pages/dashboard/OverviewSwitcher.jsx

import useRole from "../../hooks/useRole";
import AdminHome from "../Admin/AdminHome";

import LearnerOverview from "./LearnerOverview";


export default function OverviewSwitcher() {
  const { role, isLoading, isError, error } = useRole();

  if (isLoading) return <div className="p-6 bg-white rounded-md">Loading...</div>;
  if (isError) return <div className="p-6 bg-red-50 text-red-700 rounded-md">{String(error?.message || "Failed to get role")}</div>;

  return role === "admin" ? <AdminHome /> : <LearnerOverview/>;
}
