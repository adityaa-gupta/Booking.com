'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../_store/useAuthStore';
import ApiService from '../_lib/services/ApiService';
import uploadImage from '../_lib/helpers/ImageUpload';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
  FaCalendar,
  FaCamera,
  FaSpinner,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function MyProfilePage() {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    profilePhoto: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    if (mounted && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (mounted && isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, router, mounted, user]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      if (!user || !user.userid) {
        setMessage({ text: 'User information is missing', type: 'error' });
        return;
      }

      const userData = await ApiService.getUserProfile({ userId: user.userid });
      console.log('User profile data:', userData);

      // Map the returned data to our profile state
      setProfile({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: user?.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        dateOfBirth: userData.dateOfBirth || '',
        profileId: userData.profileId,
        profilePhoto: userData.profilePhoto || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ text: 'Failed to load profile data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file);

      if (result.error) {
        setMessage({ text: `Upload failed: ${result.error}`, type: 'error' });
        return;
      }

      setProfile((prev) => ({ ...prev, profilePhoto: result.url }));
      setMessage({
        text: 'Profile picture uploaded successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ text: 'Failed to upload profile picture', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updatedProfile = await ApiService.updateUserProfile({
        ...profile,
        userId: user.userid,
      });

      // Update the user in the auth store
      updateUser({
        name: `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim(),
        profilePhoto: profile.profilePhoto,
      });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen pt-20"></div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center bg-[#FDFAF6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#498526]"></div>
      </div>
    );
  }

  // Get full name for display
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FDFAF6]">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#498526]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#498526] font-medium">My Profile</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="bg-[#EBF5E0] w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.profilePhoto ? (
                      <Image
                        src={profile.profilePhoto}
                        alt={fullName}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        priority
                      />
                    ) : (
                      <FaUserCircle className="text-[#498526] w-16 h-16" />
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 bg-[#498526] text-white p-2 rounded-full shadow-md hover:bg-[#3B6B1E] transition"
                    >
                      {isUploading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCamera />
                      )}
                    </button>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-[#255F38] mb-1">
                  {fullName || 'User'}
                </h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#498526] py-3 px-6 text-white font-medium">
                Navigation
              </div>
              <div className="p-2">
                <Link
                  href="/my-profile"
                  className="flex items-center gap-3 p-3 rounded-md bg-[#EBF5E0] text-[#255F38] font-medium"
                >
                  <FaUser className="text-[#99BC85]" />
                  Profile Information
                </Link>
                <Link
                  href="/my-bookings"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <FaMapMarkerAlt className="text-[#99BC85]" />
                  My Bookings
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#498526] p-6 text-white flex justify-between items-center">
                <h1 className="text-2xl font-bold">Profile Information</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white text-[#498526] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#EBF5E0] transition"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>

              {message.text && (
                <div
                  className={`p-4 ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  } flex items-center`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  ></div>
                  {message.text}
                </div>
              )}

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Profile photo section for larger screens */}
                    <div className="hidden md:block">
                      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <FaUser className="text-[#99BC85]" /> Profile Photo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#EBF5E0]">
                          {profile.profilePhoto ? (
                            <Image
                              src={profile.profilePhoto}
                              alt={fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUserCircle className="text-[#498526] w-12 h-12" />
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={triggerFileInput}
                              disabled={isUploading}
                              className="px-4 py-2 bg-[#99BC85] text-white rounded-lg hover:bg-[#7da369] transition flex items-center gap-2"
                            >
                              {isUploading ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaCamera />
                              )}
                              {isUploading ? 'Uploading...' : 'Change Photo'}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG or GIF (max. 2MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                          <FaUser className="text-[#99BC85]" /> First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            {profile.firstName || 'Not provided'}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                          <FaUser className="text-[#99BC85]" /> Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            {profile.lastName || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <FaEnvelope className="text-[#99BC85]" /> Email Address
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                        {profile.email}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <FaPhone className="text-[#99BC85]" /> Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleChange}
                          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {profile.phoneNumber || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <FaCalendar className="text-[#99BC85]" /> Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profile.dateOfBirth}
                          onChange={handleChange}
                          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {profile.dateOfBirth || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <FaMapMarkerAlt className="text-[#99BC85]" /> Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={profile.address}
                          onChange={handleChange}
                          rows="3"
                          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {profile.address || 'Not provided'}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#498526] text-white rounded-lg hover:bg-[#3B6B1E] transition flex items-center gap-2"
                        >
                          <FaSave /> Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Activity summary section */}
            <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#99BC85] p-4 text-white">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <FaUserCircle />
                    </div>
                    <div>
                      <p className="font-medium">Profile Updated</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <FaCalendar />
                    </div>
                    <div>
                      <p className="font-medium">New Booking Created</p>
                      <p className="text-sm text-gray-500">1 week ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-gray-500">2 weeks ago</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button className="text-[#498526] text-sm font-medium hover:underline">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>

            {/* Account preferences section */}
            <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#99BC85] p-4 text-white">
                <h2 className="text-lg font-semibold">Account Preferences</h2>
              </div>
              <div className="p-4">
                <div className="divide-y divide-gray-100">
                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive booking updates via email
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        id="toggle-1"
                        defaultChecked
                      />
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-6"></span>
                    </div>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">
                        Get alerts on your phone
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        id="toggle-2"
                      />
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform"></span>
                    </div>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security
                      </p>
                    </div>
                    <button className="px-3 py-1 text-sm border border-[#498526] text-[#498526] rounded-md hover:bg-[#EBF5E0]">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
