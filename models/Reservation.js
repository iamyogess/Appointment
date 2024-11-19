import mongoose, { Schema } from "mongoose";

const reservationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  timePeriod: { type: String, required: true },
  people: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  guide: { types: Schema.Types.ObjectId, ref: "User", required: true },
  cost: { types: Number, required: true },
  reservationStatus: { type: Boolean, default: false },
});

const ReservationModel = mongoose.model("Reservation", reservationSchema);

export default ReservationModel;
