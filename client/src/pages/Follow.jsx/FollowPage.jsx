import React, { useEffect, useState } from "react";
import { UserPlus, UserCheck, UserX, Users, Search, Filter, Users as UsersIcon, Sparkles } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function FollowPage() {
  const { mongoUser, loadingMongo } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

  useEffect(() => {
    if (!mongoUser?._id) {
      setLoadingUsers(false);
      return;
    }

    const fetchUsersWithRelationships = async () => {
      try {
        setLoadingUsers(true);
        const usersResponse = await fetch("http://localhost:5000/users");
        const allUsers = await usersResponse.json();
        const filteredUsers = allUsers.filter((u) => u._id !== mongoUser._id);
        
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
        setFilteredUsers(usersWithRelationships);
        setLoadingUsers(false);
      } catch (err) {
        console.error("Error loading users:", err);
        setLoadingUsers(false);
      }
    };

    fetchUsersWithRelationships();
  }, [mongoUser]);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (activeFilter) {
      case "friends":
        result = result.filter(user => user.relationship.isFriend);
        break;
      case "following":
        result = result.filter(user => user.relationship.iFollow && !user.relationship.isFriend);
        break;
      case "followers":
        result = result.filter(user => user.relationship.followsMe && !user.relationship.iFollow);
        break;
      case "suggested":
        result = result.filter(user => !user.relationship.iFollow && !user.relationship.followsMe);
        break;
      default:
        break;
    }
    setFilteredUsers(result);
  }, [users, searchTerm, activeFilter]);

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

  const getButtonConfig = (user) => {
    const { iFollow, followsMe, isFriend } = user.relationship;
    if (isFriend) {
      return {
        text: "Friends",
        icon: <Users size={16} />,
        className: "bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 hover:border-purple-300",
        onClick: () => handleUnfollow(user._id),
        disabled: updatingUser === user._id
      };
    } else if (iFollow) {
      return {
        text: "Unfollow",
        icon: <UserX size={16} />,
        className: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300",
        onClick: () => handleUnfollow(user._id),
        disabled: updatingUser === user._id
      };
    } else if (followsMe) {
      return {
        text: "Follow Back",
        icon: <UserCheck size={16} />,
        className: "bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200 hover:border-blue-300",
        onClick: () => handleFollow(user._id),
        disabled: updatingUser === user._id
      };
    } else {
      return {
        text: "Follow",
        icon: <UserPlus size={16} />,
        className: "bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-200 hover:border-pink-300",
        onClick: () => handleFollow(user._id),
        disabled: updatingUser === user._id
      };
    }
  };

  const filterOptions = [
    { key: "all", label: "All Users", icon: <UsersIcon size={16} /> },
    { key: "friends", label: "Friends", icon: <Users size={16} /> },
    { key: "following", label: "Following", icon: <UserCheck size={16} /> },
    { key: "followers", label: "Followers", icon: <UserPlus size={16} /> },
    { key: "suggested", label: "Suggested", icon: <Sparkles size={16} /> }
  ];

  if (loadingMongo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!mongoUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <UsersIcon className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to TalkSync</h2>
          <p className="text-gray-600">Please login to connect with other language learners</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-purple-100 mb-6">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-purple-600 font-medium">Connect & Learn Together</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Language Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing language learners and build meaningful connections
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UsersIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{mongoUser.following?.length || 0}</div>
            <div className="text-blue-600 text-sm font-medium">Following</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UserPlus className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{mongoUser.followers?.length || 0}</div>
            <div className="text-purple-600 text-sm font-medium">Followers</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 text-center">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-5 w-5 text-pink-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{mongoUser.friends?.length || 0}</div>
            <div className="text-pink-600 text-sm font-medium">Friends</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search learners by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    activeFilter === option.key
                      ? "bg-purple-100 text-purple-700 border-purple-300 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loadingUsers ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Discovering amazing learners...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <UsersIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No learners found</h3>
                <p className="text-gray-600">
                  {searchTerm || activeFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "No other users available at the moment"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const buttonConfig = getButtonConfig(user);
                const { iFollow, followsMe, isFriend } = user.relationship;

                return (
                  <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.image || defaultAvatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.src = defaultAvatar;
                            }}
                          />
                          {user.status === "Online" && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isFriend ? 'bg-purple-100 text-purple-700' :
                        iFollow ? 'bg-blue-100 text-blue-700' :
                        followsMe ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {isFriend ? 'Friend' : iFollow ? 'Following' : followsMe ? 'Follows You' : 'New'}
                      </div>
                    </div>

                    {/* User Bio */}
                    {user.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
                    )}

                    {/* User Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">{user.followers?.length || 0}</div>
                        <div className="text-gray-500">Followers</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">{user.following?.length || 0}</div>
                        <div className="text-gray-500">Following</div>
                      </div>
                    </div>

                    {/* Languages */}
                    {(user.native_language || user.learning_language?.length > 0) && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {user.native_language && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              Native: {user.native_language}
                            </span>
                          )}
                          {user.learning_language?.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">
                              Learning: {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={buttonConfig.onClick}
                      disabled={buttonConfig.disabled}
                      className={`w-full py-2.5 px-4 rounded-lg border font-medium transition-all flex items-center justify-center gap-2 ${
                        buttonConfig.disabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:shadow-sm'
                      } ${buttonConfig.className}`}
                    >
                      {buttonConfig.icon}
                      {buttonConfig.disabled ? "..." : buttonConfig.text}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}