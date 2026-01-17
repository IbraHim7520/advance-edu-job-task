import mongoose from "mongoose"

const UserSchema = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
        maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    }

},
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("Users", UserSchema);
export default userModel