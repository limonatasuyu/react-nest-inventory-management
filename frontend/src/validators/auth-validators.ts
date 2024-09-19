import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required.")
    .email("Email is not valid."),
  password: yup
    .string()
    .required("Password is required.") 
});

export type LoginSchema = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
  firstname: yup.string().required("Firstname is required."),
  lastname: yup.string().required("Firstname is required."),
  email: yup
    .string()
    .required("Email is required.")
    .email("Email is not valid."),
  emailAgain: yup
    .string()
    .oneOf([yup.ref('email'), undefined], "Emails don't match.")
    .required('Required.'),
  password: yup
    .string()
    .required("Email is required.")
    .min(6, "Password can be at least 6 characters.")
    .max(20, "Password can be at most 20 characters.")
    .matches(new RegExp(".*[A-Z].*"), 'Password need to have uppercase characters.',
    )
    .matches(new RegExp(".*[a-z].*"), 'Password need to have lowercase characters.'),
  passwordAgain: yup
    .string()
    .oneOf([yup.ref('password'), undefined], "passwords don't match.")
    .required('Required.')
})

export type RegisterSchema = yup.InferType<typeof registerSchema>;
