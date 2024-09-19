import { Box } from "@mui/material";
import background1 from "/background1.jpg";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${background1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          filter: "blur(5px)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: -1, // Send the background behind the content
        }}
      />
          <Outlet />
    </Box>
  );
}
