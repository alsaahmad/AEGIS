import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/tracking")({
  component: () => <Navigate to="/citizen" />,
});
