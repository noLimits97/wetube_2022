import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  avataUrl: String,
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  realname: { type: String, required: true },
  password: { type: String },
  socialLogin: { type: Boolean, default: false },
  location: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  ],
});

// Don’t save plain passwords in db. Save hashed passwrods,
// Model.save(), Model.create()에 의해 호출된다.
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
