import { FC } from "react";
import { useUser } from "../../hooks/useUser";

export const UserProfile: FC = () => {
  const { user, loading, error } = useUser();

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>UUID: {user.id}</p>
    </div>
  );
};
