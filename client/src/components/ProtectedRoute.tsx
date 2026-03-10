import { Redirect } from "wouter";
import { useUser } from "@/hooks/use-auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}