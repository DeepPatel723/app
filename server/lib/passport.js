import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] && profile.emails[0].value;
                if (!email) return done(new Error("No email found in Google profile"), null);

                // Try to find user by googleId first
                let user = await User.findOne({ googleId: profile.id });

                // If not found by googleId, try by email (for users who registered with email/password or phone)
                if (!user) {
                    user = await User.findOne({ email });
                }

                if (user) {
                    // Link Google if not already linked
                    if (!user.googleId) {
                        user.googleId = profile.id;
                    }
                    // Add 'google' to loginMethods if not present
                    if (!user.loginMethods || !user.loginMethods.includes('google')) {
                        user.loginMethods = [...new Set([...(user.loginMethods || []), 'google'])];
                    }
                    user.isVerified = true;
                    await user.save();
                    return done(null, user);
                } else {
                    // Create new user with Google info
                    const newUser = await User.create({
                        googleId: profile.id,
                        email,
                        name: profile.displayName,
                        loginMethods: ['google'],
                        isVerified: true
                    });
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});