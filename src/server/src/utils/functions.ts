import crypto from 'crypto'
import Config from '../config/config.js';
import axios from "axios";
import natural from 'natural'
import disorders from '../disorders.js';
import logger from './logger.js';
import { DisorderCount } from '../types.js';

export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); 
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const base64ToFile = (base64: string, filename = "image.jpg"): File => {
  // Convert base64 string to Blob
  const byteCharacters = atob(base64.split(",")[1]); // Remove the base64 header and decode the string
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" }); // Change the MIME type if necessary

  // Create a File object from the Blob
  const file = new File([blob], filename, { type: "image/jpeg" });

  return file;
};


// Generate password reset token and expiry
export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
  return { resetToken, resetTokenExpiry };
  };
  

    // Send password reset email
export const sendPasswordResetEmail = async (userType, email, resetToken) => {
  const resetURL =  `${Config.HOST}/reset/${resetToken}`

  };
  



  
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

// Load disorders dataset and train the classifier
export const loadDisorders = () => {

disorders.forEach(disorder => {
classifier.addDocument(disorder.name, disorder.name);
});

classifier.train();
};



export const extractMajorDisorders = (complaints: string[]): DisorderCount[] => {
  const disorderCounts: Record<string, number> = {};

  complaints.forEach(complaint => {
    const tokens = tokenizer.tokenize(complaint.toLowerCase());
    const classifiedDisorder = classifier.classify(tokens.join(' '));

    // Check if the classified disorder is in our list of known disorders
    const matchedDisorder = disorders.find(d => d.name.toLowerCase() === classifiedDisorder.toLowerCase());

    if (matchedDisorder) {
      if (disorderCounts[matchedDisorder.name]) {
        disorderCounts[matchedDisorder.name]++;
      } else {
        disorderCounts[matchedDisorder.name] = 1;
      }
    }
  });

  const majorDisorders: DisorderCount[] = Object.entries(disorderCounts).map(([disorder, count]) => ({
    disorder,
    count
  }));

  majorDisorders.sort((a, b) => b.count - a.count);

  return majorDisorders;
};




export const createChatEngineAcct = async (username: string, secret: string)=>{
  try {
    const response = await axios.post(
      "https://api.chatengine.io/users/",
      { username, secret },
      {
        headers: {
          "PRIVATE-KEY": Config.CHAT_ENGINE.SECRET,
        },
      }
    );
    return response.data;
  } catch (error) {
   logger.error("Error creating Chat Engine user:", error);
    throw error;
  }
}