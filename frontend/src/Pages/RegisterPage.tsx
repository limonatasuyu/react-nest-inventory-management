import {
  Box,
  TextField,
  Button,
  Typography,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import logo from "/logo.png";
import { registerSchema, RegisterSchema } from "../validators/auth-validators";
import packages from "/packages.png";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<RegisterSchema>({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      emailAgain: "",
      password: "",
      passwordAgain: "",
    },
    onSubmit: (values) => {
      axios
        .post("http://localhost:3000/auth/register", values)
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            navigate("/login");
          }
        })
        .catch((err) => toast.error(err.response?.data.message ?? err.message));
    },
    validationSchema: registerSchema,
  });

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1, // Bring the content to the front
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "white",
        mr: 30,
      }}
    >
      <Box
        sx={{
          oveflow: "hidden",
          height: 350,
          transform: "scale(-1, 1)",
          marginBottom: 20,
        }}
      >
        <img width="700" height="auto" src={packages} />
      </Box>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "5px",
          p: 8,
          minWidth: "21rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "black",
        }}
      >
        <Box>
          <img
            width="300"
            height="auto"
            src={logo}
            style={{ marginLeft: "2rem" }}
          />
          <Typography sx={{ fontStyle: "italic" }}>
            "Streamline Your Inventory, Simplify Your Success."
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", fontSize: ".8rem", textAlign: "end" }}
          >
            -Someone who is into inventories probably
          </Typography>

          <form onSubmit={formik.handleSubmit} style={{ marginTop: "2rem" }}>
            <Box display="flex" sx={{ flexDirection: "column", gap: 2 }}>
              <TextField
                label="First Name"
                name="firstname"
                onChange={formik.handleChange}
                value={formik.values.firstname}
                error={Boolean(
                  formik.touched.firstname && formik.errors.firstname
                )}
                helperText={formik.touched.firstname && formik.errors.firstname}
              />
              <TextField
                label="Last Name"
                name="lastname"
                onChange={formik.handleChange}
                value={formik.values.lastname}
                error={Boolean(
                  formik.touched.lastname && formik.errors.lastname
                )}
                helperText={formik.touched.lastname && formik.errors.lastname}
              />
              <TextField
                label="Email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                label="Confirm Email"
                name="emailAgain"
                onChange={formik.handleChange}
                value={formik.values.emailAgain}
                error={Boolean(
                  formik.touched.emailAgain && formik.errors.emailAgain
                )}
                helperText={
                  formik.touched.emailAgain && formik.errors.emailAgain
                }
              />

              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                >
                  {formik.touched.password && formik.errors.password}
                </FormHelperText>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="passwordAgain"
                  name="passwordAgain"
                  type={showConfirmPassword ? "text" : "password"}
                  error={Boolean(
                    formik.touched.passwordAgain && formik.errors.passwordAgain
                  )}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText
                  error={Boolean(
                    formik.touched.passwordAgain && formik.errors.passwordAgain
                  )}
                >
                  {formik.touched.passwordAgain && formik.errors.passwordAgain}
                </FormHelperText>
              </FormControl>
              <Link to="/login">Already have an account ?</Link>
              <Box display="flex" sx={{ gap: 1, justifyContent: "center" }}>
                <Button variant="contained" type="submit">
                  Register
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
