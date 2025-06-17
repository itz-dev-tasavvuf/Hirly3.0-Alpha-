import React from "react";

const ProfileSummary = ({ profile }) => {
  if (!profile) return null;

  // Display all fields, but format nicely
  return (
    <div className="text-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Profile Summary</h2>
      <div className="space-y-3">
        {profile.name && (
          <div>
            <span className="font-semibold text-purple-700">Name:</span> {profile.name}
          </div>
        )}
        {profile.userType && (
          <div>
            <span className="font-semibold text-purple-700">Type:</span> {profile.userType}
          </div>
        )}
        {/* Render all other profile fields dynamically, except name/userType */}
        {Object.entries(profile)
          .filter(([k]) => k !== "name" && k !== "userType")
          .map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold text-purple-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProfileSummary;
