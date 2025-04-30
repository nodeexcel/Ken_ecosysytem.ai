import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { acceptInviteEmail } from '../api/teamMember';

function AcceptInvitation() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const handleAccept = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await acceptInviteEmail({token})
            if (response?.status===200) {
                navigate("/")
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <MailCheck className="text-[#675FFF] w-16 h-16" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">You've Been Invited</h1>
                <p className="text-gray-600 mb-6">
                    {email
                        ? `${email} has been invited to join a team. Click below to accept the invitation.`
                        : 'You have received an invitation. Click below to accept it.'}
                </p>
                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className={`w-full ${loading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white py-2 rounded-lg transition`}
                >
                    {loading ? <div className="flex items-center justify-center gap-2"><p>Accepting...</p><span className="loader" /></div> : 'Accept Invitation'}
                </button>
                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default AcceptInvitation;
