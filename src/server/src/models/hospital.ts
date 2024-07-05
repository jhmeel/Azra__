import mongoose from 'mongoose';

const { Schema } = mongoose;

const validateCoordinates = (coords: string) => {
  const regex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
  return regex.test(coords);
};
const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const hospitalSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'] 
  },
  phone: { 
    type: String, 
    required: true, 
    minlength: [11, 'Phone number must be at least 11 characters long.'],
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [8, 'Password must be at least 8 characters long.'] 
  },
  hospitalName: { 
    type: String, 
    required: true 
  },
  hospitalNumber: { 
    type: String, 
    required: true 
  },
  coordinates: {
    type: String,
    required: true,
    index: '2dsphere' // This creates the 2dsphere index
  },
  role:{
    type: String,
    default: 'Hospital',
  },
  status:{
    type:String, 
    enum:['Available','Unavailable'],
    default:'Unavailable'
  }, 
  avatar: {
    secureUrl: { type: String },
    publicId: { type: String }
  },
  verificationDocuments: [{
    type: { 
      type: String, 
      required: true 
    },
    secureUrl: {
      type: String,
      required: true 
    },
    publicId: {
      type: String,
      required: true 
      
    }
  }],
  pings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ping'
  }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  rating: { 
    type: Number, 
    default: 0,
    min: [0, 'Rating must be at least 0.'],
    max: [5, 'Rating must be at most 5.']
  }
}, { timestamps: true });

hospitalSchema.pre('save', function(next) {
  if (this.isModified('coordinates') && typeof this.coordinates === 'string') {
    const [lat, lng] = this.coordinates.split(',').map(Number);
    this.coordinates = {
      type: 'Point',
      coordinates: [lng, lat] // Note: GeoJSON uses [longitude, latitude] order
    };
  }
  next();
});

hospitalSchema.virtual('coordinatesString').get(function() {
  if (this.coordinates && this.coordinates.coordinates) {
    const [lng, lat] = this.coordinates.coordinates;
    return `${lat},${lng}`;
  }
  return '';
});

hospitalSchema.index({ coordinates: '2dsphere' });
const Hospital = mongoose.model('Hospital', hospitalSchema);



export default Hospital


