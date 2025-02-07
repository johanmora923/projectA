import  { useState, useEffect } from 'react';
import axios from 'axios';

export const Profile = () => {
    const [user, setUser] = useState({});
    const [email, setEmail] = useState('');
    const [residence, setResidence] = useState('');
    const [phone, setPhone] = useState('');
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        // Fetch user data from the server
        axios.get('http://localhost:3000/user/profile', {
            params: { userId: window.localStorage.getItem('id') }
        })
        .then(response => {
            setUser(response.data);
            setEmail(response.data.email);
            setResidence(response.data.residence);
            setPhone(response.data.phone);
            setIsPhoneVerified(response.data.isPhoneVerified);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    const handleUpdateProfile = () => {
        axios.post('http://localhost:3000/user/update', {
            userId: window.localStorage.getItem('id'),
            email,
            residence,
            phone
        })
        .then(response => {
            if (response) return console.log(' sucefull')
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });
    };

    const handleVerifyPhone = () => {
        // Logic to verify phone number
        setIsPhoneVerified(true);
        alert('Phone number verified successfully');
    };

    const handleProfilePhotoChange = (e) => {
        setProfilePhoto(e.target.files[0]);
    };

    const handleUploadProfilePhoto = () => {
        const formData = new FormData();
        formData.append('profile_photo', profilePhoto);
        formData.append('userId', window.localStorage.getItem('id'));

        axios.post('http://localhost:3000/user/upload-profile-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response)
            alert('Profile photo updated successfully');
            // Fetch updated user data
            axios.get('http://localhost:3000/user/profile', {
                params: { userId: window.localStorage.getItem('id') }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        })
        .catch(error => {
            console.error('Error uploading profile photo:', error);
        });
    };
    return (
        <div className="profile-container p-4">
            <h2 className="text-[#110f0f] font-bold mb-4">User Profile</h2>
            <div className="profile-info mb-4">
                <img 
                src={`http://localhost:3000/${user.profile_photo}`}  
                alt="Profile" 
                className="w-24 h-24 rounded-full mb-4" 
                />
                <h3 className="text-xl text-black font-semibold">{user.name}</h3>
            </div>
            <div className="profile-photo-upload mb-4">
                <label className="block mb-2">Profile Photo:</label>
                <input
                    type="file"
                    onChange={handleProfilePhotoChange}
                    className="w-full text-black p-2 border rounded mb-4"
                />
                <button
                    onClick={handleUploadProfilePhoto}
                    className="w-full bg-blue-500 text-white p-2 rounded mb-4"
                >
                    Upload Photo
                </button>
            </div>
            <div className="profile-update mb-4">
                <label className="block mb-2">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-black p-2 border rounded mb-4"
                />
                <label className="block mb-2">Residence:</label>
                <input
                    type="text"
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                    className="w-full text-black p-2 border rounded mb-4"
                />
                <label className="block mb-2">Phone:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-black p-2 border rounded mb-4"
                />
                <button
                    onClick={handleUpdateProfile}
                    className="w-full bg-blue-500 text-white p-2 rounded mb-4"
                >
                    Update Profile
                </button>
            </div>
            <div className="phone-verification">
                <button
                    onClick={handleVerifyPhone}
                    className={`w-full ${isPhoneVerified ? 'bg-green-500' : 'bg-yellow-500'} text-white p-2 rounded`}
                    disabled={isPhoneVerified}
                >
                    {isPhoneVerified ? 'Phone Verified' : 'Verify Phone'}
                </button>
            </div>
        </div>
    );
};