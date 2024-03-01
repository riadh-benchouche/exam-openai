const generateToken = () => {
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset.charAt(randomIndex);
    }
    return code;
};

const isUserBlocked = (user) => {
    const MAX_LOGIN_ATTEMPTS = 3;
    const BLOCKING_DURATION = 15 * 60 * 1000; // 15 minutes

    return (
        user.loginAttempts >= MAX_LOGIN_ATTEMPTS &&
        new Date() - user.blockedAt < BLOCKING_DURATION
    );
};

export {generateToken, isUserBlocked};
