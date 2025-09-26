import React from 'react';

const RightSection = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form>
                <div className="mb-4">
                    <label
                        htmlFor="current-password"
                        className="block text-sm font-medium mb-1"
                    >
                        Current Password
                    </label>
                    <input type="password" id="current-password" className="input" />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="new-password"
                        className="block text-sm font-medium mb-1"
                    >
                        New Password
                    </label>
                    <input type="password" id="new-password" className="input" />
                </div>
                <button type="submit" className="btn">
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default RightSection;