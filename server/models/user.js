import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required!!"],
    },
    email:{
        type:String,
        required:[true,"Email is required!!"],
        unique:true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true,"Password is required!!"],
        minlength:[6,"Password must be at least 6 characters long"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    }],
    googleId: {
        type: String,
    },
    isVerified: {
    type: Boolean,
    default: false,
    },
    createdAt: {
    type: Date,
    default: Date.now,
    }
});

UserSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);        
    }
    next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;