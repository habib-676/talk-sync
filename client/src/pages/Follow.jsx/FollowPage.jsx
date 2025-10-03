import React, { useEffect, useState } from "react";
import { UserPlus, UserCheck, UserX, Users } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function FollowPage() {
  const { mongoUser, loadingMongo } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);

  // Working default avatar
  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  // Fetch users with relationship data
  useEffect(() => {
    if (!mongoUser?._id) {
      setLoadingUsers(false);
      return;
    }

    const fetchUsersWithRelationships = async () => {
      try {
        setLoadingUsers(true);
        
        // Fetch all users
        const usersResponse = await fetch("http://localhost:5000/users");
        const allUsers = await usersResponse.json();
        
        // Filter out current user
        const filteredUsers = allUsers.filter((u) => u._id !== mongoUser._id);
        
        // Fetch relationship status for each user
        const usersWithRelationships = await Promise.all(
          filteredUsers.map(async (user) => {
            try {
              const relationshipResponse = await fetch(
                `http://localhost:5000/relationship/${mongoUser._id}/${user._id}`
              );
              
              if (relationshipResponse.ok) {
                const relationshipData = await relationshipResponse.json();
                return {
                  ...user,
                  followers: user.followers || [],
                  following: user.following || [],
                  friends: user.friends || [],
                  relationship: relationshipData.success ? relationshipData.relationship : {
                    iFollow: false,
                    followsMe: false,
                    isFriend: false
                  }
                };
              }
            } catch (error) {
              console.error(`Error fetching relationship for user ${user._id}:`, error);
            }
            
            // Fallback: Calculate relationship from user data
            const userFollowing = user.following || [];
            const userFollowers = user.followers || [];
            const userFriends = user.friends || [];
            const myFollowing = mongoUser.following || [];
            const myFriends = mongoUser.friends || [];
            
            return {
              ...user,
              followers: user.followers || [],
              following: user.following || [],
              friends: user.friends || [],
              relationship: {
                iFollow: myFollowing.includes(user._id),
                followsMe: userFollowers.includes(mongoUser._id),
                isFriend: myFriends.includes(user._id) && userFriends.includes(mongoUser._id)
              }
            };
          })
        );
        
        setUsers(usersWithRelationships);
        setLoadingUsers(false);
      } catch (err) {
        console.error("Error loading users:", err);
        setLoadingUsers(false);
      }
    };

    fetchUsersWithRelationships();
  }, [mongoUser]);

  const handleFollow = async (targetId) => {
    if (!mongoUser?._id || updatingUser) return;

    try {
      setUpdatingUser(targetId);
      
      const response = await fetch(`http://localhost:5000/users/${targetId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: mongoUser._id }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state based on the new relationship
        setUsers(prev =>
          prev.map(user => {
            if (user._id === targetId) {
              const newRelationship = {
                iFollow: true,
                followsMe: user.relationship.followsMe,
                isFriend: result.becameFriends || (user.relationship.followsMe && true)
              };
              
              return {
                ...user,
                relationship: newRelationship,
                followers: [...(user.followers || []), mongoUser._id]
              };
            }
            return user;
          })
        );
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleUnfollow = async (targetId) => {
    if (!mongoUser?._id || updatingUser) return;

    try {
      setUpdatingUser(targetId);
      
      await fetch(`http://localhost:5000/users/${targetId}/unfollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: mongoUser._id }),
      });

      // Update local state
      setUsers(prev =>
        prev.map(user => {
          if (user._id === targetId) {
            return {
              ...user,
              relationship: {
                iFollow: false,
                followsMe: user.relationship.followsMe,
                isFriend: false
              },
              followers: (user.followers || []).filter(id => id !== mongoUser._id)
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setUpdatingUser(null);
    }
  };

  // Get button configuration based on relationship
  const getButtonConfig = (user) => {
    const { iFollow, followsMe, isFriend } = user.relationship;

    if (isFriend) {
      return {
        text: "Friends",
        icon: <Users size={18} />,
        className: "bg-green-500 hover:bg-green-600 text-white",
        onClick: () => handleUnfollow(user._id),
        disabled: updatingUser === user._id
      };
    } else if (iFollow) {
      return {
        text: "Unfollow",
        icon: <UserX size={18} />,
        className: "bg-gray-500 hover:bg-gray-600 text-white",
        onClick: () => handleUnfollow(user._id),
        disabled: updatingUser === user._id
      };
    } else if (followsMe) {
      return {
        text: "Follow Back",
        icon: <UserCheck size={18} />,
        className: "bg-blue-500 hover:bg-blue-600 text-white",
        onClick: () => handleFollow(user._id),
        disabled: updatingUser === user._id
      };
    } else {
      return {
        text: "Follow",
        icon: <UserPlus size={18} />,
        className: "bg-blue-500 hover:bg-blue-600 text-white",
        onClick: () => handleFollow(user._id),
        disabled: updatingUser === user._id
      };
    }
  };

  // Debug logs
  console.log("Current MongoDB User:", mongoUser);
  console.log("Users with relationships:", users);

  // Loading states
  if (loadingMongo) {
    return <p className="text-center text-gray-500 mt-10">Loading user data...</p>;
  }

  if (!mongoUser) {
    return <p className="text-center text-gray-500 mt-10">Please login first.</p>;
  }

  if (loadingUsers) {
    return <p className="text-center text-gray-500 mt-10">Loading users...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">People You May Know</h2>
      
      {/* Current User Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800">Your Profile</h3>
        <p className="text-sm text-blue-600">
          Following: {mongoUser.following?.length || 0} • 
          Followers: {mongoUser.followers?.length || 0} • 
          Friends: {mongoUser.friends?.length || 0}
        </p>
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          users.map((user) => {
            const buttonConfig = getButtonConfig(user);
            const { iFollow, followsMe, isFriend } = user.relationship;

            return (
              <div key={user._id} className="flex items-center justify-between bg-white shadow rounded-lg p-4 border">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={user.image || defaultAvatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {user.followers?.length || 0} followers • {user.following?.length || 0} following
                      {isFriend && " • Friends"}
                      {iFollow && !isFriend && " • You follow"}
                      {followsMe && !iFollow && " • Follows you"}
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors font-medium ${buttonConfig.className} ${
                      buttonConfig.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                    }`}
                  >
                    {buttonConfig.icon} 
                    {buttonConfig.disabled ? "..." : buttonConfig.text}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}