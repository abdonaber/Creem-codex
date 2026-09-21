/** Database access boundary for ride queries; services own workflow and authorization. */
import { Ride } from '../models/index.js';
export const rideRepository={
  findOwned: (id:string,userId:string,role:string)=>Ride.findOne({_id:id,...(role==='ADMIN'?{}:role==='RIDER'?{riderId:userId}:{driverId:userId})}),
  listFor: (userId:string,role:string)=>Ride.find(role==='ADMIN'?{}:role==='RIDER'?{riderId:userId}:{driverId:userId}).sort({createdAt:-1})
};
