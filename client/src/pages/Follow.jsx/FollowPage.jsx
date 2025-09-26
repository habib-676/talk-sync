import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";

export default function FollowPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  const handleFollow = (id) => {
    alert(`You followed user with ID: ${id}`);
    // এখানে আপনি follow/unfollow logic backend এ পাঠাতে পারবেন
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Suggested Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onFollow={handleFollow} />
        ))}
      </div>
    </div>
  );
}
