import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
    },
    genre: {
      type: String,
    },
    content: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model("List", listSchema);

export default List;
