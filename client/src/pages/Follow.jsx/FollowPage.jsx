import React, { useEffect, useState, useMemo } from "react";
import {
  UserPlus,
  UserCheck,
  UserX,
  Users,
  Search,
  Users as UsersIcon,
  Sparkles,
  Filter,
  X,
  ChevronDown,
  Globe,
  Heart,
  Tag,
  SlidersHorizontal,
  Zap,
  BookOpen,
  Languages,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

// ---- World languages (ISO 639-1 common set; প্রয়োজনে বাড়াতে/কমাতে পারেন) ----
const WORLD_LANGUAGES = [
  "Afrikaans","Albanian","Amharic","Arabic","Armenian","Assamese","Aymara",
  "Azerbaijani","Bambara","Basque","Belarusian","Bengali","Bhojpuri","Bosnian",
  "Bulgarian","Catalan","Cebuano","Chinese","Chinese (Simplified)","Chinese (Traditional)",
  "Corsican","Croatian","Czech","Danish","Dhivehi","Dogri","Dutch","English",
  "Esperanto","Estonian","Ewe","Filipino","Finnish","French","Frisian","Galician",
  "Georgian","German","Greek","Guarani","Gujarati","Haitian Creole","Hausa","Hawaiian",
  "Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo","Ilocano","Indonesian",
  "Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Kinyarwanda",
  "Konkani","Korean","Krio","Kurdish (Kurmanji)","Kurdish (Sorani)","Kyrgyz",
  "Lao","Latin","Latvian","Lingala","Lithuanian","Luganda","Luxembourgish",
  "Macedonian","Maithili","Malagasy","Malay","Malayalam","Maltese","Maori","Marathi",
  "Meiteilon (Manipuri)","Mizo","Mongolian","Myanmar (Burmese)","Nepali",
  "Norwegian","Nyanja (Chichewa)","Odia (Oriya)","Oromo","Pashto","Persian",
  "Polish","Portuguese","Punjabi","Quechua","Romanian","Russian","Samoan",
  "Sanskrit","Scots Gaelic","Sepedi","Serbian","Sesotho","Shona","Sindhi","Sinhala",
  "Slovak","Slovenian","Somali","Spanish","Sundanese","Swahili","Swedish",
  "Tagalog","Tajik","Tamil","Tatar","Telugu","Thai","Tigrinya","Tsonga","Turkish",
  "Turkmen","Twi (Akan)","Ukrainian","Urdu","Uyghur","Uzbek","Vietnamese","Welsh",
  "Xhosa","Yiddish","Yoruba","Zulu"
];

export default function FollowPage() {
  const { mongoUser, loadingMongo, refreshMongoUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // ⭐ Interests filter
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestMode, setInterestMode] = useState("any"); // "any" | "all"
  const [allInterests, setAllInterests] = useState([]);

  // ⭐ Language filter
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languageMode, setLanguageMode] = useState("any"); // "any" | "all"
  const [languageQuery, setLanguageQuery] = useState("");

  const navigate = useNavigate();

  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

  // Normalize interests from user object
  const getUserInterests = (u) => {
    const raw = Array.isArray(u?.interests)
      ? u.interests
      : Array.isArray(u?.learning_language)
      ? u.learning_language
      : [];
    return raw
      .filter(Boolean)
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0);
  };

  // Normalize languages (native + learning)
  const getUserLanguages = (u) => {
    const native = u?.native_language ? [u.native_language] : [];
    const learning = Array.isArray(u?.learning_language)
      ? u.learning_language
      : [];
    return [...native, ...learning]
      .filter(Boolean)
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0);
  };

  useEffect(() => {
    if (!mongoUser?._id) {
      setLoadingUsers(false);
      return;
    }

    const fetchUsersWithRelationships = async () => {
      try {
        setLoadingUsers(true);
        const usersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/users`
        );
        const allUsers = await usersResponse.json();
        const filteredUsers = allUsers.filter((u) => u._id !== mongoUser._id);

        const usersWithRelationships = await Promise.all(
          filteredUsers.map(async (user) => {
            try {
              const relationshipResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/relationship/${mongoUser._id}/${user._id}`
              );
              if (relationshipResponse.ok) {
                const relationshipData = await relationshipResponse.json();
                return {
                  ...user,
                  followers: user.followers || [],
                  following: user.following || [],
                  friends: user.friends || [],
                  relationship: relationshipData.success
                    ? relationshipData.relationship
                    : {
                        iFollow: false,
                        followsMe: false,
                        isFriend: false,
                      },
                };
              }
            } catch (error) {
              console.error(
                `Error fetching relationship for user ${user._id}:`,
                error
              );
            }

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
                isFriend:
                  myFriends.includes(user._id) &&
                  userFriends.includes(mongoUser._id),
              },
            };
          })
        );

        setUsers(usersWithRelationships);
        setFilteredUsers(usersWithRelationships);

        // build unique interests from users (optional; interests user-driven)
        const uniqueInterests = Array.from(
          new Set(
            usersWithRelationships
              .flatMap((u) => getUserInterests(u))
              .map((s) => s.trim())
          )
        ).sort((a, b) => a.localeCompare(b));
        setAllInterests(uniqueInterests);

        setLoadingUsers(false);
      } catch (err) {
        console.error("Error loading users:", err);
        setLoadingUsers(false);
      }
    };

    fetchUsersWithRelationships();
  }, [mongoUser]);

  // Language suggestions (search within WORLD_LANGUAGES excluding already selected)
  const languageSuggestions = useMemo(() => {
    const q = languageQuery.trim().toLowerCase();
    const pool = WORLD_LANGUAGES.filter(
      (l) => !selectedLanguages.includes(l)
    );
    if (!q) return pool.slice(0, 24);
    return pool
      .filter((l) => l.toLowerCase().includes(q))
      .slice(0, 24);
  }, [languageQuery, selectedLanguages]);

  useEffect(() => {
    let result = users;

    // name/email search
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // relationship filters
    switch (activeFilter) {
      case "friends":
        result = result.filter((user) => user.relationship.isFriend);
        break;
      case "following":
        result = result.filter(
          (user) => user.relationship.iFollow && !user.relationship.isFriend
        );
        break;
      case "followers":
        result = result.filter(
          (user) => user.relationship.followsMe && !user.relationship.iFollow
        );
        break;
      case "suggested":
        result = result.filter(
          (user) => !user.relationship.iFollow && !user.relationship.followsMe
        );
        break;
      default:
        break;
    }

    // interests filter
    if (selectedInterests.length > 0) {
      result = result.filter((u) => {
        const userTags = getUserInterests(u).map((s) => s.toLowerCase());
        const selected = selectedInterests.map((s) => s.toLowerCase());
        return interestMode === "all"
          ? selected.every((s) => userTags.includes(s))
          : selected.some((s) => userTags.includes(s));
      });
    }

    // ⭐ language filter (match on native_language + learning_language)
    if (selectedLanguages.length > 0) {
      result = result.filter((u) => {
        const langs = getUserLanguages(u).map((s) => s.toLowerCase());
        const selected = selectedLanguages.map((s) => s.toLowerCase());
        return languageMode === "all"
          ? selected.every((s) => langs.includes(s))
          : selected.some((s) => langs.includes(s));
      });
    }

    setFilteredUsers(result);
  }, [
    users,
    searchTerm,
    activeFilter,
    selectedInterests,
    interestMode,
    selectedLanguages,
    languageMode,
  ]);

  const handleFollow = async (targetId) => {
    if (!mongoUser?._id || updatingUser) return;
    try {
      setUpdatingUser(targetId);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${targetId}/follow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUserId: mongoUser._id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        await refreshMongoUser();

        setUsers((prev) =>
          prev.map((user) => {
            if (user._id === targetId) {
              const newRelationship = {
                iFollow: true,
                followsMe: user.relationship.followsMe,
                isFriend: result.becameFriends || false,
              };
              return {
                ...user,
                relationship: newRelationship,
                followers: [...(user.followers || []), mongoUser._id],
                friends: result.becameFriends
                  ? [...(user.friends || []), mongoUser._id]
                  : user.friends,
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
      await fetch(
        `${import.meta.env.VITE_API_URL}/users/${targetId}/unfollow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUserId: mongoUser._id }),
        }
      );

      await refreshMongoUser();

      setUsers((prev) =>
        prev.map((user) => {
          if (user._id === targetId) {
            return {
              ...user,
              relationship: {
                iFollow: false,
                followsMe: user.relationship.followsMe,
                isFriend: false,
              },
              followers: (user.followers || []).filter(
                (id) => id !== mongoUser._id
              ),
              friends: (user.friends || []).filter(
                (id) => id !== mongoUser._id
              ),
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

  const handleRemoveFollower = async (targetId) => {
    if (!mongoUser?._id || updatingUser) return;
    try {
      setUpdatingUser(targetId);
      await fetch(
        `${import.meta.env.VITE_API_URL}/users/${targetId}/remove-follower`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUserId: mongoUser._id }),
        }
      );

      await refreshMongoUser();

      setUsers((prev) =>
        prev.map((user) => {
          if (user._id === targetId) {
            return {
              ...user,
              relationship: {
                iFollow: user.relationship.iFollow,
                followsMe: false,
                isFriend: false,
              },
              following: (user.following || []).filter(
                (id) => id !== mongoUser._id
              ),
              friends: (user.friends || []).filter(
                (id) => id !== mongoUser._id
              ),
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error("Error removing follower:", error);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const getButtonConfig = (user) => {
    const { iFollow, followsMe, isFriend } = user.relationship;

    if (isFriend) {
      return {
        primary: {
          text: "Friends",
          icon: <Users size={16} />,
          className:
            "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200 shadow-sm",
        },
      };
    } else if (iFollow) {
      return {
        primary: {
          text: "Following",
          icon: <UserCheck size={16} />,
          className:
            "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 shadow-sm",
        },
        secondary: {
          text: "Unfollow",
          icon: <UserX size={16} />,
          className:
            "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 shadow-sm",
          onClick: () => handleUnfollow(user._id),
        },
      };
    } else if (followsMe) {
      return {
        primary: {
          text: "Follow Back",
          icon: <UserCheck size={16} />,
          className:
            "bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200 hover:border-blue-300 shadow-sm",
          onClick: () => handleFollow(user._id),
        },
        secondary: {
          text: "Remove",
          icon: <UserX size={16} />,
          className:
            "bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-sm",
          onClick: () => handleRemoveFollower(user._id),
        },
      };
    } else {
      return {
        primary: {
          text: "Follow",
          icon: <UserPlus size={16} />,
          className:
            "bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-200 shadow-sm",
          onClick: () => handleFollow(user._id),
        },
        secondary: null,
      };
    }
  };

  const filterOptions = [
    { key: "all", label: "All Users", icon: <UsersIcon size={16} /> },
    { key: "friends", label: "Friends", icon: <Users size={16} /> },
    { key: "following", label: "Following", icon: <UserCheck size={16} /> },
    { key: "followers", label: "Followers", icon: <UserPlus size={16} /> },
    { key: "suggested", label: "Suggested", icon: <Sparkles size={16} /> },
  ];

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedInterests([]);
    setSelectedLanguages([]);
    setSearchTerm("");
    setActiveFilter("all");
    setInterestMode("any");
    setLanguageMode("any");
  };

  const hasActiveFilters = searchTerm || activeFilter !== "all" || selectedInterests.length > 0 || selectedLanguages.length > 0;

  if (loadingMongo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!mongoUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <UsersIcon className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to TalkSync
          </h2>
          <p className="text-gray-600">
            Please login to connect with other language learners
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-purple-100/50 mb-6">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-purple-600 font-medium">
              Connect & Learn Together
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Language Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover amazing language learners and build meaningful connections around the world
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100/50 p-6 text-center transition-all hover:shadow-md hover:scale-105">
            <div className="w-12 h-12 bg-blue-100/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {mongoUser.following?.length || 0}
            </div>
            <div className="text-blue-600 text-sm font-semibold">Following</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100/50 p-6 text-center transition-all hover:shadow-md hover:scale-105">
            <div className="w-12 h-12 bg-purple-100/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {mongoUser.followers?.length || 0}
            </div>
            <div className="text-purple-600 text-sm font-semibold">Followers</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-pink-100/50 p-6 text-center transition-all hover:shadow-md hover:scale-105">
            <div className="w-12 h-12 bg-pink-100/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {mongoUser.friends?.length || 0}
            </div>
            <div className="text-pink-600 text-sm font-semibold">Friends</div>
          </div>
        </div>

        {/* Enhanced Search & Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Main Search Bar with Filter Toggle */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search learners by name, email, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300/50 bg-white/50 hover:bg-white transition-all shadow-sm text-gray-600 hover:text-gray-700"
                  >
                    <X size={16} />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border transition-all shadow-sm font-medium ${
                    showFilters
                      ? "bg-purple-100 text-purple-700 border-purple-300 shadow-purple-100"
                      : "bg-white/50 text-gray-700 border-gray-300/50 hover:bg-white"
                  }`}
                >
                  <SlidersHorizontal size={18} />
                  <span>Advanced Filters</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
                  />
                </button>
              </div>
            </div>

            {/* Quick Relationship Filters */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200/50">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all shadow-sm min-w-[120px] ${
                    activeFilter === option.key
                      ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-300 shadow-purple-100 transform scale-105"
                      : "bg-white/50 text-gray-700 border-gray-300/50 hover:bg-white hover:scale-105"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeFilter === option.key ? 'bg-purple-200' : 'bg-gray-100'
                  }`}>
                    {option.icon}
                  </div>
                  <span className="font-semibold text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Advanced Filters */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
              {/* Filters Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {selectedInterests.length + selectedLanguages.length} active
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Interests Filter Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="h-5 w-5 text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-900">Interests & Topics</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Match type:
                      </span>
                      <div className="inline-flex rounded-xl border border-gray-300/50 overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => setInterestMode("any")}
                          className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${
                            interestMode === "any"
                              ? "bg-purple-100 text-purple-700 shadow-inner"
                              : "bg-transparent text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <BookOpen size={14} />
                          Any Interest
                        </button>
                        <button
                          onClick={() => setInterestMode("all")}
                          className={`px-6 py-3 text-sm font-semibold border-l border-gray-300/50 transition-all flex items-center gap-2 ${
                            interestMode === "all"
                              ? "bg-purple-100 text-purple-700 shadow-inner"
                              : "bg-transparent text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Users size={14} />
                          All Interests
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((tag) => (
                        <button
                          key={`sel-int-${tag}`}
                          onClick={() =>
                            setSelectedInterests((prev) =>
                              prev.filter((x) => x !== tag)
                            )
                          }
                          className="group px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-blue-100 transition-all flex items-center gap-2 shadow-sm"
                          title="Remove"
                        >
                          <span className="font-medium text-sm">{tag}</span>
                          <X size={14} className="opacity-60 group-hover:opacity-100" />
                        </button>
                      ))}
                      {selectedInterests.length > 0 && (
                        <button
                          onClick={() => setSelectedInterests([])}
                          className="px-4 py-2.5 rounded-xl border border-gray-300/50 hover:bg-gray-50 transition-all shadow-sm text-gray-600 font-medium text-sm"
                        >
                          Clear Interests
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-3 font-medium">Available Interests:</p>
                    <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto p-2">
                      {allInterests.length === 0 ? (
                        <span className="text-sm text-gray-500 italic">
                          No interests available in the community yet
                        </span>
                      ) : (
                        allInterests.map((tag) => {
                          const active = selectedInterests.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() =>
                                setSelectedInterests((prev) =>
                                  active ? prev.filter((t) => t !== tag) : [...prev, tag]
                                )
                              }
                              className={`px-4 py-2.5 rounded-full border transition-all shadow-sm font-medium text-sm ${
                                active
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-blue-200 transform scale-105"
                                  : "bg-white text-gray-700 border-gray-300/50 hover:bg-gray-50 hover:scale-105"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Language Filter Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Languages className="h-5 w-5 text-emerald-500" />
                    <h4 className="text-lg font-semibold text-gray-900">Languages</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Match type:
                      </span>
                      <div className="inline-flex rounded-xl border border-gray-300/50 overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => setLanguageMode("any")}
                          className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${
                            languageMode === "any"
                              ? "bg-purple-100 text-purple-700 shadow-inner"
                              : "bg-transparent text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Globe size={14} />
                          Any Language
                        </button>
                        <button
                          onClick={() => setLanguageMode("all")}
                          className={`px-6 py-3 text-sm font-semibold border-l border-gray-300/50 transition-all flex items-center gap-2 ${
                            languageMode === "all"
                              ? "bg-purple-100 text-purple-700 shadow-inner"
                              : "bg-transparent text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <BookOpen size={14} />
                          All Languages
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedLanguages.map((lg) => (
                        <button
                          key={`sel-lang-${lg}`}
                          onClick={() =>
                            setSelectedLanguages((prev) =>
                              prev.filter((x) => x !== lg)
                            )
                          }
                          className="group px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200 hover:from-emerald-200 hover:to-emerald-100 transition-all flex items-center gap-2 shadow-sm"
                          title="Remove"
                        >
                          <span className="font-medium text-sm">{lg}</span>
                          <X size={14} className="opacity-60 group-hover:opacity-100" />
                        </button>
                      ))}
                      {selectedLanguages.length > 0 && (
                        <button
                          onClick={() => setSelectedLanguages([])}
                          className="px-4 py-2.5 rounded-xl border border-gray-300/50 hover:bg-gray-50 transition-all shadow-sm text-gray-600 font-medium text-sm"
                        >
                          Clear Languages
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={languageQuery}
                        onChange={(e) => setLanguageQuery(e.target.value)}
                        placeholder="Search 150+ world languages (Spanish, Japanese, Bengali...)"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
                      <p className="text-sm text-gray-600 mb-3 font-medium">
                        {languageQuery ? "Matching Languages:" : "Popular Languages:"}
                      </p>
                      <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto p-2">
                        {languageSuggestions.length === 0 ? (
                          <span className="text-sm text-gray-500 italic">
                            No languages match your search
                          </span>
                        ) : (
                          languageSuggestions.map((lg) => (
                            <button
                              key={`sugg-${lg}`}
                              onClick={() =>
                                setSelectedLanguages((prev) => [...prev, lg])
                              }
                              className="px-4 py-2.5 rounded-full bg-white text-gray-700 border border-gray-300/50 hover:bg-gray-50 hover:border-purple-300 transition-all shadow-sm font-medium text-sm hover:scale-105"
                            >
                              {lg}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Footer */}
              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{filteredUsers.length}</span> learners match your criteria
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2.5 rounded-xl border border-gray-300/50 hover:bg-white transition-all shadow-sm text-gray-600 font-medium"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Grid */}
        {loadingUsers ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Discovering amazing learners...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-16 text-center">
                <UsersIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No learners found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {hasActiveFilters
                    ? "Try adjusting your search criteria or filters to find more learners"
                    : "No other users available at the moment. Check back later!"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const buttonConfig = getButtonConfig(user);
                const { iFollow, followsMe, isFriend } = user.relationship;

                return (
                  <div
                    key={user._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  >
                   <div
  className="flex items-start mb-4 cursor-pointer"
  onClick={() => handleUserClick(user._id)}
>
  <div className="flex items-start gap-2 flex-1">
    <div className="relative">
      <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-gray-200/50 group-hover:border-purple-300 transition-colors shadow-sm">
        <img
          src={user.image || defaultAvatar}
          alt={user.name}
          className="w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </div>
      {user.status === "Online" && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
        {user.name}
      </h3>
      <p className="text-sm text-gray-500 truncate">
        {user.email}
      </p>

      {/* 👇 Status pill moved below; flex container so it sits nicely */}
      <div className="mt-2 flex">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            isFriend
              ? "bg-purple-100 text-purple-700"
              : iFollow
              ? "bg-blue-100 text-blue-700"
              : followsMe
              ? "bg-pink-100 text-pink-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {isFriend
            ? "Friend"
            : iFollow
            ? "Following"
            : followsMe
            ? "Follows You"
            : "New"}
        </div>
      </div>
    </div>
  </div>
</div>

                    {/* Bio */}
                    {user.bio && (
                      <div
                        className="text-sm text-gray-600 mb-4 line-clamp-2 cursor-pointer group-hover:text-gray-700 transition-colors leading-relaxed"
                        onClick={() => handleUserClick(user._id)}
                      >
                        {user.bio}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="text-center p-3 bg-gray-50/50 rounded-xl border border-gray-200/50">
                        <div className="font-bold text-gray-900">
                          {user.followers?.length || 0}
                        </div>
                        <div className="text-gray-500 text-xs">Followers</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50/50 rounded-xl border border-gray-200/50">
                        <div className="font-bold text-gray-900">
                          {user.following?.length || 0}
                        </div>
                        <div className="text-gray-500 text-xs">Following</div>
                      </div>
                    </div>

                    {/* Languages */}
                    {(user.native_language ||
                      user.learning_language?.length > 0) && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {user.native_language && (
                            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium shadow-sm">
                              🌍 {user.native_language}
                            </span>
                          )}
                          {user.learning_language?.map((lang, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-pink-100 text-pink-700 text-xs rounded-lg font-medium shadow-sm"
                            >
                              📚 {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
                    {getUserInterests(user).length > 0 && (
                      <div className="mb-5">
                        <div className="flex flex-wrap gap-2">
                          {getUserInterests(user).map((tag, i) => (
                            <span
                              key={`int-${i}-${tag}`}
                              className="px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg font-medium shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={buttonConfig.primary.onClick || (() => {})}
                        disabled={
                          updatingUser === user._id ||
                          !buttonConfig.primary.onClick
                        }
                        className={`flex-1 py-3 px-4 rounded-xl border font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                          updatingUser === user._id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-md hover:scale-105"
                        } ${buttonConfig.primary.className}`}
                      >
                        {buttonConfig.primary.icon}
                        {updatingUser === user._id
                          ? "..."
                          : buttonConfig.primary.text}
                      </button>

                      {buttonConfig.secondary && (
                        <button
                          onClick={buttonConfig.secondary.onClick}
                          disabled={updatingUser === user._id}
                          className={`py-3 px-4 rounded-xl border font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                            updatingUser === user._id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-md hover:scale-105"
                          } ${buttonConfig.secondary.className}`}
                        >
                          {buttonConfig.secondary.icon}
                          {updatingUser === user._id
                            ? "..."
                            : buttonConfig.secondary.text}
                        </button>
                      )}
                    </div>
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