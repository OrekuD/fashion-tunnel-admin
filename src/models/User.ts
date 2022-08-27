import { DeviceTypes } from "./../types";
export default interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  deviceType: string;
  createdAt: string;
}
