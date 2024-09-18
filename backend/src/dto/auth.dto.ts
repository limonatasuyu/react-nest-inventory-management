export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstname: string;
  lastname: string;
  email: string;
  emailAgain: string;
  password: string;
  passwordAgain: string;
}
