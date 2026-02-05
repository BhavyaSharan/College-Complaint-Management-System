import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

import defaultAvatar from "../assets/default-avatar.png";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);

  // ✅ NEW: Preview Selected Image
  const [preview, setPreview] = useState(null);

  const [uploading, setUploading] = useState(false);

  // ✅ Load profile on page open
  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fetch Profile Data
  async function fetchProfile() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    const { data: profileData } = await supabase
      .from("admin_profiles")
      .select("id,name,role,department,photo_url")
      .eq("id", user.id)
      .single();

    setProfile(profileData);
  }

  // ✅ Upload Photo Function (Guaranteed Working)
  async function uploadPhoto() {
    if (!photo) {
      toast.error("Please select an image first ❌");
      return;
    }

    setUploading(true);
    toast.loading("Uploading photo...");

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      toast.dismiss();
      toast.error("Session expired ❌ Please login again");
      setUploading(false);
      return;
    }

    // ✅ Fixed storage path (always same)
    const filePath = `avatars/${user.id}.png`;

    // ✅ Delete old photo first
    await supabase.storage.from("profile-photos").remove([filePath]);

    // ✅ Upload new photo
   const { error } = await supabase.storage
  .from("profile-photos")
  .upload(filePath, photo, {
    contentType: photo.type,
    upsert: true,
  })

    if (error) {
      toast.dismiss();
      toast.error("Upload failed ❌");
      setUploading(false);
      return;
    }

    // ✅ Get Public URL
    const { data: urlData } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(filePath);

    // ✅ Cache busting
    const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // ✅ Save photo URL in admin_profiles table
    await supabase
      .from("admin_profiles")
      .update({ photo_url: photoUrl })
      .eq("id", user.id);

    // ✅ Update UI instantly
    setProfile((prev) => ({
      ...prev,
      photo_url: photoUrl,
    }));

    // ✅ Reset preview after upload
    setPreview(null);
    setPhoto(null);

    toast.dismiss();
    toast.success("Profile Photo Updated ✅");

    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        {/* ✅ Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          My Profile
        </h1>

        {/* ✅ Profile Photo Section */}
        <div className="flex flex-col items-center mt-6">
          {/* ✅ Show Uploaded Photo or Default */}
          {profile && (
            <img
              src={profile.photo_url || defaultAvatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover shadow-md"
            />
          )}

          {/* ✅ Select Image Button */}
          <label className="mt-5 w-full text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setPhoto(file);

                // ✅ Show preview immediately
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />

            <span className="cursor-pointer inline-block px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Select Image
            </span>
          </label>

          {/* ✅ Preview Before Upload */}
          {preview && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-green-600 font-semibold">
                ✅ Image Selected
              </p>

              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full mt-2 border-2 border-gray-400 object-cover"
              />
            </div>
          )}

          {/* ✅ Upload Button */}
          <button
            onClick={uploadPhoto}
            disabled={uploading || !photo}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>

        {/* ✅ Profile Details */}
        <div className="mt-8 space-y-3 text-lg text-gray-800">
          <p>
            <b>Name:</b> {profile?.name}
          </p>

          <p>
            <b>Role:</b> {profile?.role}
          </p>

          <p>
            <b>Department:</b> {profile?.department || "N/A"}
          </p>

          <p className="text-sm text-gray-500">
            Joined: {profile?.created_at}
          </p>
        </div>
      </div>
    </div>
  );
}
