export interface UserWithAttendance {
  id: number;
  image: string;
  worker_id: string;
  name: string;
  date_of_birth: Date;
  contact: string;
  email: string;
  date_joined: Date;
  site: number;
  supervisor: number;
  attendances: Attendance[];
}

export interface Attendance {
  id: number;
  worker_id: string;
  date: Date;
  date_created: Date;
  site_name: string;
  email: string;
}
