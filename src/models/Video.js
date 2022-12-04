import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, trim: true, minlength: 2, required: true },
  description: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 500,
    required: true,
  },
  // Date.now()가 아닌 이유는 객체가 생성됐을 때만 실행하기 위해서
  createdAt: { type: Date, default: Date.now, required: true },
  hashtags: [{ type: String, trim: true, required: true }],
  vidUrl: { type: String, required: true },
  thumbUrl: { type: String },
  meta: {
    views: { type: Number, default: 1, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// pre의 callback func에 arrow func을 사용하면 this의 대상이 달라지므로, fucntion () {}을 사용할 것
videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((hashtag) =>
      hashtag.startsWith("#") ? hashtag.trim() : `#${hashtag.trim()}`
    );
});

const Video = mongoose.model("Video", videoSchema);

export default Video;

/*
  trim: string 양 공백을 제거한다.
*/
