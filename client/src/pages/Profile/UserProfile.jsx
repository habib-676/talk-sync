import React, { useEffect, useState } from "react";
import { 
  UserPlus, 
  UserCheck, 
  UserX, 
  Users, 
  MapPin, 
  Calendar, 
  Globe, 
  BookOpen, 
  MessageCircle,
  ArrowLeft,

  Mail,
  Heart,
  Star,
  Award,
  Languages,
  Target,
  Sparkles,
  Trash2
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { mongoUser, refreshMongoUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/users/id/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setProfileUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!mongoUser?._id || !profileUser?._id || updating) return;

    try {
      setUpdating(true);
      const response = await fetch(`http://localhost:5000/users/${profileUser._id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: mongoUser._id }),
      });

      const result = await response.json();
      if (result.success) {
        await refreshMongoUser();
        const updatedResponse = await fetch(`http://localhost:5000/users/id/${userId}`);
        const updatedData = await updatedResponse.json();
        if (updatedData.success) {
          setProfileUser(updatedData.user);
        }
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnfollow = async () => {
    if (!mongoUser?._id || !profileUser?._id || updating) return;

    try {
      setUpdating(true);
      const response = await fetch(`http://localhost:5000/users/${profileUser._id}/unfollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: mongoUser._id }),
      });

      const result = await response.json();
      if (result.success) {
        await refreshMongoUser();
        const updatedResponse = await fetch(`http://localhost:5000/users/id/${userId}`);
        const updatedData = await updatedResponse.json();
        if (updatedData.success) {
          setProfileUser(updatedData.user);
        }
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFollower = async () => {
    if (!mongoUser?._id || !profileUser?._id || updating) return;

    try {
      setUpdating(true);
      const response = await fetch(`http://localhost:5000/users/${profileUser._id}/remove-follower`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: mongoUser._id }),
      });

      const result = await response.json();
      if (result.success) {
        await refreshMongoUser();
        const updatedResponse = await fetch(`http://localhost:5000/users/id/${userId}`);
        const updatedData = await updatedResponse.json();
        if (updatedData.success) {
          setProfileUser(updatedData.user);
        }
      }
    } catch (error) {
      console.error("Error removing follower:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = () => {
    if (!profileUser?._id) return;
    navigate('/inbox');
  };

  const getRelationshipStatus = () => {
    if (!mongoUser || !profileUser || !mongoUser._id) return null;

    const myFollowing = mongoUser.following || [];
    const myFollowers = mongoUser.followers || [];
    const myFriends = mongoUser.friends || [];
    // const theirFollowing = profileUser.following || [];
    const theirFriends = profileUser.friends || [];

    const iFollow = myFollowing.includes(profileUser._id);
    const followsMe = myFollowers.includes(profileUser._id);
    const isFriend = myFriends.includes(profileUser._id) && theirFriends.includes(mongoUser._id);

    return { iFollow, followsMe, isFriend };
  };

  const getActionButtons = () => {
    if (!mongoUser || !mongoUser._id || !profileUser) return { primary: null, secondary: null };

    const relationship = getRelationshipStatus();
    if (!relationship) return { primary: null, secondary: null };

    const { iFollow, followsMe, isFriend } = relationship;

    // Check if viewing own profile
    const isOwnProfile = mongoUser._id === profileUser._id;

    if (!isOwnProfile) {
      if (isFriend) {
        return {
          primary: {
            text: "Friends",
            icon: <Users size={18} />,
            className: "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200",
            onClick: handleUnfollow,
          },
          secondary: {
            text: "Unfriend",
            icon: <UserX size={18} />,
            className: "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50",
            onClick: handleUnfollow,
          }
        };
      } else if (iFollow) {
        return {
          primary: {
            text: "Following",
            icon: <UserCheck size={18} />,
            className: "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200",
            onClick: () => {},
          },
          secondary: {
            text: "Unfollow",
            icon: <UserX size={18} />,
            className: "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50",
            onClick: handleUnfollow,
          }
        };
      } else if (followsMe) {
        return {
          primary: {
            text: "Follow Back",
            icon: <UserPlus size={18} />,
            className: "bg-green-100 hover:bg-green-200 text-green-700 border border-green-200",
            onClick: handleFollow,
          },
          secondary: {
            text: "Delete",
            icon: <Trash2 size={18} />,
            className: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
            onClick: handleRemoveFollower,
          }
        };
      } else {
        return {
          primary: {
            text: "Follow",
            icon: <UserPlus size={18} />,
            className: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
            onClick: handleFollow,
          },
          secondary: null
        };
      }
    } else {
      return {
        primary: {
          text: "Edit Profile",
          icon: <UserCheck size={18} />,
          className: "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200",
          onClick: () => navigate("/edit-profile"),
        },
        secondary: null
      };
    }
  };

  const actionButtons = getActionButtons();

  const getProficiencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'expert': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Users className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-500">Discover and connect</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100"></div>
          
          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar and Info */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={profileUser.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt={profileUser.name}
                    className="w-24 h-24 rounded-xl border-4 border-white object-cover shadow-md"
                  />
                  {profileUser.status === "Online" && (
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
                    {profileUser.proficiency_level && (
                      <div className={`px-2 py-1 ${getProficiencyColor(profileUser.proficiency_level)} text-xs font-medium rounded-full border`}>
                        {profileUser.proficiency_level}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center gap-1 text-sm">
                    <Mail size={14} className="text-purple-500" />
                    {profileUser.email}
                  </p>
                  {profileUser.bio && (
                    <p className="text-gray-700 mt-2 max-w-md text-sm leading-relaxed">{profileUser.bio}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                {mongoUser && mongoUser._id && profileUser && mongoUser._id !== profileUser._id && (
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span className="font-medium">Message</span>
                  </button>
                )}
                
                {actionButtons.primary && (
                  <button
                    onClick={actionButtons.primary.onClick}
                    disabled={updating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      updating ? 'opacity-50 cursor-not-allowed' : ''
                    } ${actionButtons.primary.className}`}
                  >
                    {actionButtons.primary.icon}
                    {updating ? "..." : actionButtons.primary.text}
                  </button>
                )}

                {actionButtons.secondary && (
                  <button
                    onClick={actionButtons.secondary.onClick}
                    disabled={updating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      updating ? 'opacity-50 cursor-not-allowed' : ''
                    } ${actionButtons.secondary.className}`}
                  >
                    {actionButtons.secondary.icon}
                    {updating ? "..." : actionButtons.secondary.text}
                  </button>
                )}

                
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-gray-900 mb-1">{profileUser.followers?.length || 0}</div>
                <div className="text-blue-600 text-sm font-medium flex items-center justify-center gap-1">
                  <Heart size={14} />
                  Followers
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-gray-900 mb-1">{profileUser.following?.length || 0}</div>
                <div className="text-purple-600 text-sm font-medium flex items-center justify-center gap-1">
                  <UserCheck size={14} />
                  Following
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-gray-900 mb-1">{profileUser.friends?.length || 0}</div>
                <div className="text-pink-600 text-sm font-medium flex items-center justify-center gap-1">
                  <Users size={14} />
                  Friends
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: "about", label: "About", icon: <UserCheck size={16} /> },
                  { id: "languages", label: "Languages", icon: <Languages size={16} /> },
                  { id: "interests", label: "Interests", icon: <Star size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === "about" && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">About Me</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {profileUser.user_country && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <MapPin size={18} className="text-blue-500" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Location</p>
                        <p className="text-gray-900">{profileUser.user_country}</p>
                      </div>
                    </div>
                  )}
                  
                  {profileUser.date_of_birth && (
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                      <Calendar size={18} className="text-pink-500" />
                      <div>
                        <p className="text-sm text-pink-600 font-medium">Date of Birth</p>
                        <p className="text-gray-900">{new Date(profileUser.date_of_birth).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {profileUser.gender && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <Users size={18} className="text-green-500" />
                      <div>
                        <p className="text-sm text-green-600 font-medium">Gender</p>
                        <p className="text-gray-900 capitalize">{profileUser.gender}</p>
                      </div>
                    </div>
                  )}
                  
                  {profileUser.proficiency_level && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <Award size={18} className="text-orange-500" />
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Proficiency Level</p>
                        <p className="text-gray-900 capitalize">{profileUser.proficiency_level}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "languages" && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Languages className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Language Skills</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileUser.native_language && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Native Language</p>
                        <p className="text-blue-800 font-semibold">{profileUser.native_language}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-blue-700">
                      <Star size={14} className="fill-current" />
                      <span>Fluent Speaker</span>
                    </div>
                  </div>
                )}
                
                {profileUser.learning_language && profileUser.learning_language.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Learning Languages</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileUser.learning_language.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded border border-purple-200">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-purple-700">
                      <BookOpen size={14} />
                      <span>Currently Learning</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "interests" && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Interests & Hobbies</h3>
              </div>
              {profileUser.interests && profileUser.interests.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {profileUser.interests.map((interest, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-center hover:bg-purple-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Heart size={16} className="text-purple-600" />
                      </div>
                      <span className="text-purple-700 font-medium text-sm">{interest}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Star size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">No interests added yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}