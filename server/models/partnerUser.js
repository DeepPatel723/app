import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PartnerUserSchema = new mongoose.Schema({
    Orgname: {
        type: String,
        required: [true, "OrgName is required!"],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters long"],
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isProfileComplete: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Add any other fields you need (roles, profile, etc.)
},
    { timestamps: true });

// Hash password if modified
PartnerUserSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Password comparison method
PartnerUserSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const PartnerUser = mongoose.model("PartnerUser", PartnerUserSchema);
export default PartnerUser;